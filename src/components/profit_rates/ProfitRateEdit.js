// src/components/profit_rates/ProfitRateEdit.js
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import GenericEditData from "../GenericDataComponents/GenericEditData";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import {
  ACTIVE_PROFIT_RATE_ENDPOINT,
  CREATE_UPDATE_PROFIT_RATE_ENDPOINT,
} from "../ApiUtils/ApiEndpoints";

const ProfitRateEdit = () => {
  const { get, post } = useApi();
  const { setFlashMessages, userInfo } = useContext(AppContext);
  const navigate = useNavigate();

  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;
  const [form, setForm] = useState({ profit_rate: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isStaff) return;
    const fetchData = async () => {
      try {
        const active = await get(ACTIVE_PROFIT_RATE_ENDPOINT, true);
        setForm({ profit_rate: active.profit_rate });
      } catch (err) {
        console.error("Failed to fetch active profit rate:", err);
      }
    };
    fetchData();
  }, [isStaff]);

  if (!isStaff) return <p>You do not have permission to view this page.</p>;

  const formFields = [
    {
      fieldType: "number",
      fieldLabel: "Profit Rate (%)",
      fieldValue: form.profit_rate,
      setFieldValue: (v) => setForm({ ...form, profit_rate: v }),
    },
  ];

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await post(CREATE_UPDATE_PROFIT_RATE_ENDPOINT, form, true);
      setFlashMessages([{ category: "success", message: "Profit rate updated successfully." }]);
      navigate("/profit-rates", { state: { timestamp: Date.now() } });
    } catch {
      setFlashMessages([{ category: "danger", message: "Failed to update profit rate." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GenericEditData
      title="Edit Active Profit Rate"
      formFields={formFields}
      handleEdit={handleUpdate}
      disableSubmit={loading}
    />
  );
};

export default ProfitRateEdit;
