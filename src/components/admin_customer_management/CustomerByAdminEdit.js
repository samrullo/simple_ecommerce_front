import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GenericEditData from "../GenericDataComponents/GenericEditData";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { CUSTOMERS_BY_ADMIN_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const CustomerByAdminEdit = () => {
  const { get, patch, put } = useApi();
  const { setFlashMessages } = useContext(AppContext);
  const { customerId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    adress_id: "",
    street: "",
    city: "",
    state: "",
    zip_code: "",
    country: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await get(`${CUSTOMERS_BY_ADMIN_ENDPOINT}${customerId}/`, true);
        const addr = data.addresses?.[0] || {};
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          adress_id: addr.id || "",
          street: addr.street || "",
          city: addr.city || "",
          state: addr.state || "",
          zip_code: addr.zip_code || "",
          country: addr.country || "",
        });
      } catch (err) {
        console.error("Failed to fetch customer:", err);
        setForm(null);
      }
    };
    fetchCustomer();
  }, []);

  const formFields = form
    ? [
      { fieldType: "text", fieldLabel: "First Name", fieldValue: form.first_name, setFieldValue: (v) => setForm({ ...form, first_name: v }) },
      { fieldType: "text", fieldLabel: "Last Name", fieldValue: form.last_name, setFieldValue: (v) => setForm({ ...form, last_name: v }) },
      { fieldType: "email", fieldLabel: "Email", fieldValue: form.email, setFieldValue: (v) => setForm({ ...form, email: v }) },
      { fieldType: "text", fieldLabel: "Phone", fieldValue: form.phone, setFieldValue: (v) => setForm({ ...form, phone: v }) },
      { fieldType: "text", fieldLabel: "Address Id", fieldValue: form.adress_id, setFieldValue: (v) => setForm({ ...form, adress_id: v }) },
      { fieldType: "text", fieldLabel: "Street", fieldValue: form.street, setFieldValue: (v) => setForm({ ...form, street: v }) },
      { fieldType: "text", fieldLabel: "City", fieldValue: form.city, setFieldValue: (v) => setForm({ ...form, city: v }) },
      { fieldType: "text", fieldLabel: "State", fieldValue: form.state, setFieldValue: (v) => setForm({ ...form, state: v }) },
      { fieldType: "text", fieldLabel: "ZIP Code", fieldValue: form.zip_code, setFieldValue: (v) => setForm({ ...form, zip_code: v }) },
      { fieldType: "text", fieldLabel: "Country", fieldValue: form.country, setFieldValue: (v) => setForm({ ...form, country: v }) },
    ]
    : [];

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      addresses: [
        {
          id: form.address_id,
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
      console.log(`Submitting payload ${payload} to ${CUSTOMERS_BY_ADMIN_ENDPOINT}${customerId}/ `)
      await patch(`${CUSTOMERS_BY_ADMIN_ENDPOINT}${customerId}/`, payload, true);
      setFlashMessages([{ category: "success", message: "Customer updated successfully." }]);
      navigate("/admin-customers", { state: { timestamp: Date.now() } });
    } catch (err) {
      console.error(err);
      setFlashMessages([{ category: "danger", message: "Failed to update customer." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GenericEditData
      title="Edit Customer"
      formFields={formFields}
      handleEdit={handleUpdate}
      disableSubmit={loading}
    />
  );
};

export default CustomerByAdminEdit;