// src/components/weight_costs/WeightCostNew.js
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GenericNewData from "../GenericDataComponents/GenericNewData";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import {
  CREATE_UPDATE_WEIGHT_COST_ENDPOINT,
  CURRENCIES_ENDPOINT,
} from "../ApiUtils/ApiEndpoints";
import extractApiErrorMessage from "../../utils/extractApiErrorMessage";

const WeightCostNew = () => {
  const { post, get } = useApi();
  const navigate = useNavigate();
  const { setFlashMessages, userInfo } = useContext(AppContext);

  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;
  const [form, setForm] = useState({ cost_per_kg: "", currency_id: "" });
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await get(CURRENCIES_ENDPOINT, false);
        setCurrencies(data);
      } catch (err) {
        console.error("Failed to fetch currencies:", err);
      }
    };
    fetchCurrencies();
  }, []);

  if (!isStaff) {
    return <p>You do not have permission to view this page.</p>;
  }

  const formFields = [
    {
      fieldType: "number",
      fieldLabel: "Cost per Kg",
      fieldValue: form.cost_per_kg,
      setFieldValue: (v) => setForm({ ...form, cost_per_kg: v }),
    },
    {
      fieldType: "select",
      fieldLabel: "Currency",
      fieldValue:
        currencies
          .map((c) => ({ value: c.id, label: `${c.code} - ${c.name}`, id: c.id }))
          .find((opt) => opt.value === form.currency_id) || null,
      setFieldValue: (v) => setForm({ ...form, currency_id: v.value }),
      selectOptions: currencies.map((c) => ({
        value: c.id,
        label: `${c.code} - ${c.name}`,
        id: c.id,
      })),
    },
  ];

  const handleNewData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await post(CREATE_UPDATE_WEIGHT_COST_ENDPOINT, form, true);
      setFlashMessages([{ category: "success", message: "Weight cost created successfully." }]);
      navigate("/weight-costs", { state: { timestamp: Date.now() } });
    } catch (err) {
      const backendMessage = extractApiErrorMessage(err, null);
      const message = backendMessage
        ? `Failed to create weight cost: ${backendMessage}`
        : "Failed to create weight cost.";
      setFlashMessages([{ category: "danger", message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GenericNewData
      title="New Weight Cost"
      formFields={formFields}
      handleNewData={handleNewData}
      submitButtonLabel={loading ? "Submitting..." : "Create Weight Cost"}
      disableSubmit={loading}
    />
  );
};

export default WeightCostNew;
