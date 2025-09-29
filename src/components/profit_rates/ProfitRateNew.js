// src/components/profit_rates/ProfitRateNew.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import GenericNewData from "../GenericDataComponents/GenericNewData";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { CREATE_UPDATE_PROFIT_RATE_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const ProfitRateNew = () => {
  const { post } = useApi();
  const navigate = useNavigate();
  const { setFlashMessages, userInfo } = useContext(AppContext);

  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;
  const [form, setForm] = useState({ profit_rate: "" });
  const [loading, setLoading] = useState(false);

  if (!isStaff) return <p>You do not have permission to view this page.</p>;

  const formFields = [
    {
      fieldType: "number",
      fieldLabel: "Profit Rate (%)",
      fieldValue: form.profit_rate,
      setFieldValue: (v) => setForm({ ...form, profit_rate: v }),
    },
  ];

  const handleNewData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await post(CREATE_UPDATE_PROFIT_RATE_ENDPOINT, form, true);
      setFlashMessages([{ category: "success", message: "Profit rate created successfully." }]);
      navigate("/profit-rates", { state: { timestamp: Date.now() } });
    } catch {
      setFlashMessages([{ category: "danger", message: "Failed to create profit rate." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GenericNewData
      title="New Profit Rate"
      formFields={formFields}
      handleNewData={handleNewData}
      submitButtonLabel={loading ? "Submitting..." : "Create Profit Rate"}
      disableSubmit={loading}
    />
  );
};

export default ProfitRateNew;
