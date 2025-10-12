// src/components/spendings/SpendingNew.js
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import GenericNewData from "../GenericDataComponents/GenericNewData";
import { SPENDINGS_ENDPOINT, CURRENCIES_ENDPOINT, SPENDING_NAMES_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import AppContext from "../../AppContext";

const SpendingNew = () => {
  const { post, get } = useApi();
  const navigate = useNavigate();
  const { userInfo, setFlashMessages } = useContext(AppContext);

  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;
  const [currencies, setCurrencies] = useState([]);
  const [spendingNames, setSpendingNames] = useState([]);
  const [spendingNameId, setSpendingNameId] = useState(null);
  const [adate, setAdate] = useState(new Date().toISOString().substring(0, 10));
  const [amount, setAmount] = useState("");
  const [currencyId, setCurrencyId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDropdowns = async () => {
      const [curs, cats] = await Promise.all([
        get(CURRENCIES_ENDPOINT, false),
        get(SPENDING_NAMES_ENDPOINT, true)
      ]);
      setCurrencies(curs);
      setSpendingNames(cats);
    };
    if (isStaff) fetchDropdowns();
  }, [get, isStaff]);

  const spendingNameOptions = useMemo(
    () =>
      spendingNames.map((s) => ({
        value: s.id,
        label: s.name,
      })),
    [spendingNames]
  );

  const currencyOptions = useMemo(
    () =>
      currencies.map((c) => ({
        value: c.id,
        label: `${c.code} - ${c.name}`,
      })),
    [currencies]
  );

  if (!isStaff) {
    return <p>You are not authorized to create spendings.</p>;
  }

  const formFields = [
    {
      fieldType: "select",
      fieldLabel: "Spending Category",
      fieldValue: spendingNameOptions.find((option) => option.value === spendingNameId) || null,
      setFieldValue: (option) => setSpendingNameId(option ? option.value : null),
      selectOptions: spendingNameOptions,
      fieldProps: { isClearable: false },
    },
    { fieldType: "date", fieldLabel: "Date", fieldValue: adate, setFieldValue: setAdate },
    {
      fieldType: "number",
      fieldLabel: "Amount",
      fieldValue: amount,
      setFieldValue: setAmount,
      fieldProps: { step: "0.01" },
    },
    {
      fieldType: "select",
      fieldLabel: "Currency",
      fieldValue: currencyOptions.find((option) => option.value === currencyId) || null,
      setFieldValue: (option) => setCurrencyId(option ? option.value : null),
      selectOptions: currencyOptions,
      fieldProps: { isClearable: false },
    }
  ];

  const handleNewData = async (event) => {
    event.preventDefault();
    if (!spendingNameId || !currencyId) {
      setFlashMessages([
        { category: "danger", message: "Spending category and currency are required." },
      ]);
      return;
    }

    setLoading(true);
    try {
      await post(
        SPENDINGS_ENDPOINT,
        {
          spending_name: spendingNameId,
          adate,
          amount,
          currency_id: currencyId,
        },
        true
      );
      setFlashMessages([{ category: "success", message: "Spending created successfully." }]);
      navigate("/spendings", { state: { timestamp: Date.now() } });
    } catch (error) {
      console.error("Failed to create spending", error);
      const backendMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        "Failed to create spending.";
      setFlashMessages([{ category: "danger", message: backendMessage }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GenericNewData
      title="New Spending"
      formFields={formFields}
      handleNewData={handleNewData}
      submitButtonLabel={loading ? "Saving..." : "Create Spending"}
      disableSubmit={loading}
    />
  );
};

export default SpendingNew;
