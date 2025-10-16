// src/components/FXRates/FXRateNew.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import {
  CURRENCIES_ENDPOINT,
  CREATE_UPDATE_FXRATES_ENDPOINT,
} from "../ApiUtils/ApiEndpoints";
import GenericEditData from "../GenericDataComponents/GenericEditData";
import extractApiErrorMessage from "../../utils/extractApiErrorMessage";

const FXRateNew = () => {
  const { get, post } = useApi();
  const navigate = useNavigate();
  const { userInfo, setFlashMessages } = useContext(AppContext);

  const [currencyFromCode, setCurrencyFromCode] = useState("USD");
  const [currencyFromId, setCurrencyFromId] = useState(null);
  const [currencyToId, setCurrencyToId] = useState(null);
  const [fxRate, setFxRate] = useState("");
  const [fxRateSource, setFxRateSource] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch currencies (excluding USD)
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await get(CURRENCIES_ENDPOINT, false);
        const usdCurrency = data.find((c) => c.code === "USD");
        if (usdCurrency) setCurrencyFromId(usdCurrency.id);

        const otherCurrencies = data
          .filter((c) => c.code !== "USD")
          .map((c) => ({ value: c.id, label: `${c.code} - ${c.name}` }));
        setCurrencies(otherCurrencies);
      } catch (err) {
        console.error("Failed to fetch currencies", err);
        setCurrencies([]);
      }
    };
    fetchCurrencies();
  }, []);

  if (!userInfo?.is_staff) return <p>You are not authorized to create FX rates.</p>;

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        currency_from_id: currencyFromId,
        currency_to_id: currencyToId?.value,
        rate: fxRate,
        source: fxRateSource,
      };
      console.log(`Sending payload ${JSON.stringify(payload)}`);
      await post(CREATE_UPDATE_FXRATES_ENDPOINT, payload, true);
      setFlashMessages([
        { category: "success", message: "FX rate created successfully." },
      ]);
      navigate("/fxrates", { state: { timestamp: Date.now() } });
    } catch (err) {
      const backendMessage = extractApiErrorMessage(err, null);
      const message = backendMessage
        ? `Failed to create FX rate: ${backendMessage}`
        : "Failed to create FX rate.";
      setFlashMessages([{ category: "danger", message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setFlashMessages([{ category: "danger", message: "Deletion not allowed" }]);
  };

  const formFields = [
    {
      fieldType: "text",
      fieldLabel: "Currency From",
      fieldValue: currencyFromCode,
      setFieldValue: setCurrencyFromCode,
      fieldProps: { disabled: true },
    },
    {
      fieldType: "select",
      fieldLabel: "Currency To",
      fieldValue: currencyToId,
      setFieldValue: setCurrencyToId,
      selectOptions: currencies,
    },
    {
      fieldType: "number",
      fieldLabel: "FX Rate",
      fieldValue: fxRate,
      setFieldValue: setFxRate,
    },
    {
      fieldType: "text",
      fieldLabel: "Source (Optional)",
      fieldValue: fxRateSource,
      setFieldValue: setFxRateSource,
    },
  ];

  return (
    <>
      {loading && (
        <div className="alert alert-info" role="alert">
          Creating fx rate...
        </div>
      )}
      <GenericEditData
        title="New FX Rate"
        formFields={formFields}
        handleEdit={handleCreate}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default FXRateNew;
