import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import GenericNewData from "../GenericDataComponents/GenericNewData";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { CUSTOMERS_BY_ADMIN_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import extractApiErrorMessage from "../../utils/extractApiErrorMessage";

const CustomerByAdminNew = () => {
  const { post } = useApi();
  const navigate = useNavigate();
  const { setFlashMessages } = useContext(AppContext);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    street: "Default street",
    city: "Default city",
    state: "Default state",
    zip_code: "123-4567",
    country: "Default Country",
    is_default: true,
  });
  const [loading, setLoading] = useState(false);

  const formFields = [
    { fieldType: "text", fieldLabel: "First Name", fieldValue: form.first_name, setFieldValue: (v) => setForm({ ...form, first_name: v }) },
    { fieldType: "text", fieldLabel: "Last Name", fieldValue: form.last_name, setFieldValue: (v) => setForm({ ...form, last_name: v }) },
    { fieldType: "email", fieldLabel: "Email", fieldValue: form.email, setFieldValue: (v) => setForm({ ...form, email: v }) },
    { fieldType: "text", fieldLabel: "Phone", fieldValue: form.phone, setFieldValue: (v) => setForm({ ...form, phone: v }) },
    { fieldType: "text", fieldLabel: "Street", fieldValue: form.street, setFieldValue: (v) => setForm({ ...form, street: v }) },
    { fieldType: "text", fieldLabel: "City", fieldValue: form.city, setFieldValue: (v) => setForm({ ...form, city: v }) },
    { fieldType: "text", fieldLabel: "State", fieldValue: form.state, setFieldValue: (v) => setForm({ ...form, state: v }) },
    { fieldType: "text", fieldLabel: "Zip Code", fieldValue: form.zip_code, setFieldValue: (v) => setForm({ ...form, zip_code: v }) },
    { fieldType: "text", fieldLabel: "Country", fieldValue: form.country, setFieldValue: (v) => setForm({ ...form, country: v }) },
  ];

  const handleNewData = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      addresses: [
        {
          street: form.street,
          city: form.city,
          state: form.state,
          zip_code: form.zip_code,
          country: form.country,
          is_default: true,
        },
      ],
    };

    try {
      await post(CUSTOMERS_BY_ADMIN_ENDPOINT, payload, true);
      setFlashMessages([{ category: "success", message: "Customer created successfully." }]);
      navigate("/admin-customers", { state: { timestamp: Date.now() } });
    } catch (err) {
      const backendMessage = extractApiErrorMessage(err, null);
      const message = backendMessage
        ? `Failed to create customer: ${backendMessage}`
        : "Failed to create customer.";
      setFlashMessages([{ category: "danger", message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GenericNewData
      title="New Customer"
      formFields={formFields}
      handleNewData={handleNewData}
      submitButtonLabel={loading ? "Submitting..." : "Create Customer"}
      disableSubmit={loading}
    />
  );
};

export default CustomerByAdminNew;
