// src/components/spendings/SpendingNameNew.js
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import GenericNewData from "../GenericDataComponents/GenericNewData";
import { SPENDING_NAMES_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import AppContext from "../../AppContext";

const SpendingNameNew = () => {
  const { post } = useApi();
  const navigate = useNavigate();
  const { userInfo, setFlashMessages } = useContext(AppContext);
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;

  if (!isStaff) {
    return <p>You are not authorized to create spending names.</p>;
  }

  const formFields = [
    { fieldType: "text", fieldLabel: "Name", fieldValue: form.name, setFieldValue: (v) => setForm({ ...form, name: v }) },
    { fieldType: "text", fieldLabel: "Description", fieldValue: form.description, setFieldValue: (v) => setForm({ ...form, description: v }) }
  ];

  const handleNewData = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setFlashMessages([{ category: "danger", message: "Name is required." }]);
      return;
    }

    setLoading(true);
    try {
      await post(SPENDING_NAMES_ENDPOINT, form, true);
      setFlashMessages([{ category: "success", message: "Spending name created successfully." }]);
      navigate("/spending-names", { state: { timestamp: Date.now() } });
    } catch (error) {
      console.error("Failed to create spending name", error);
      const backendMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        "Failed to create spending name.";
      setFlashMessages([{ category: "danger", message: backendMessage }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GenericNewData
      title="New Spending Name"
      formFields={formFields}
      handleNewData={handleNewData}
      submitButtonLabel={loading ? "Saving..." : "Create Spending Name"}
      disableSubmit={loading}
    />
  );
};

export default SpendingNameNew;
