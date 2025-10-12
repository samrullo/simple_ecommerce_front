// src/components/spendings/SpendingEdit.js
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GenericEditData from "../GenericDataComponents/GenericEditData";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import {
  CURRENCIES_ENDPOINT,
  SPENDINGS_ENDPOINT,
  SPENDING_NAMES_ENDPOINT,
} from "../ApiUtils/ApiEndpoints";

const SpendingEdit = () => {
  const { spendingId } = useParams();
  const navigate = useNavigate();
  const { userInfo, setFlashMessages } = useContext(AppContext);
  const { get, put, del } = useApi();

  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;

  const [spendingNames, setSpendingNames] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const [spendingNameId, setSpendingNameId] = useState(null);
  const [adate, setAdate] = useState("");
  const [amount, setAmount] = useState("");
  const [currencyId, setCurrencyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!isStaff) return;

    const fetchData = async () => {
      try {
        const [detail, spendingNameData, currencyData] = await Promise.all([
          get(`${SPENDINGS_ENDPOINT}${spendingId}/`, true),
          get(SPENDING_NAMES_ENDPOINT, true),
          get(CURRENCIES_ENDPOINT, false),
        ]);

        setSpendingNames(spendingNameData || []);
        setCurrencies(currencyData || []);

        setSpendingNameId(detail?.spending_name ?? null);
        setAdate(detail?.adate ? detail.adate.substring(0, 10) : "");
        setAmount(detail?.amount ?? "");
        setCurrencyId(detail?.currency?.id ?? null);
      } catch (error) {
        console.error("Failed to load spending", error);
        const backendMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          JSON.stringify(error.response?.data) ||
          "Failed to load spending.";
        setFlashMessages([{ category: "danger", message: backendMessage }]);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [isStaff, spendingId, setFlashMessages]);

  const spendingNameOptions = useMemo(
    () =>
      spendingNames.map((spendingName) => ({
        value: spendingName.id,
        label: spendingName.name,
      })),
    [spendingNames]
  );

  const currencyOptions = useMemo(
    () =>
      currencies.map((currency) => ({
        value: currency.id,
        label: `${currency.code} - ${currency.name}`,
      })),
    [currencies]
  );

  if (!isStaff) {
    return <p>You are not authorized to edit spendings.</p>;
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
    {
      fieldType: "date",
      fieldLabel: "Date",
      fieldValue: adate,
      setFieldValue: setAdate,
    },
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
    },
  ];

  const handleEdit = async (event) => {
    event.preventDefault();
    if (!spendingNameId || !currencyId) {
      setFlashMessages([
        { category: "danger", message: "Spending name and currency are required." },
      ]);
      return;
    }

    setLoading(true);
    try {
      await put(
        `${SPENDINGS_ENDPOINT}${spendingId}/`,
        {
          spending_name: spendingNameId,
          adate,
          amount,
          currency_id: currencyId,
        },
        true
      );

      setFlashMessages([{ category: "success", message: "Spending updated successfully." }]);
      navigate("/spendings", { state: { timestamp: Date.now() } });
    } catch (error) {
      console.error("Failed to update spending", error);
      const backendMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        "Failed to update spending.";
      setFlashMessages([{ category: "danger", message: backendMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await del(`${SPENDINGS_ENDPOINT}${spendingId}/`, true);
      setFlashMessages([{ category: "success", message: "Spending deleted successfully." }]);
      navigate("/spendings", { state: { timestamp: Date.now() } });
    } catch (error) {
      console.error("Failed to delete spending", error);
      const backendMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        "Failed to delete spending.";
      setFlashMessages([{ category: "danger", message: backendMessage }]);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <p>Loading spending...</p>;
  }

  return (
    <GenericEditData
      title={`Edit Spending #${spendingId}`}
      formFields={formFields}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      submitButtonLabel={loading ? "Saving..." : "Save Changes"}
      disableSubmit={loading}
    />
  );
};

export default SpendingEdit;
