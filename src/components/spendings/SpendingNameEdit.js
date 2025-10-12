// src/components/spendings/SpendingNameEdit.js
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GenericEditData from "../GenericDataComponents/GenericEditData";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { SPENDING_NAMES_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const SpendingNameEdit = () => {
  const { spendingNameId } = useParams();
  const navigate = useNavigate();
  const { userInfo, setFlashMessages } = useContext(AppContext);
  const { get, put, del } = useApi();

  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!isStaff) return;

    const fetchSpendingName = async () => {
      try {
        const detail = await get(`${SPENDING_NAMES_ENDPOINT}${spendingNameId}/`, true);
        setName(detail?.name ?? "");
        setDescription(detail?.description ?? "");
      } catch (error) {
        console.error("Failed to load spending name", error);
        const backendMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          JSON.stringify(error.response?.data) ||
          "Failed to load spending name.";
        setFlashMessages([{ category: "danger", message: backendMessage }]);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchSpendingName();
  }, [isStaff, spendingNameId, setFlashMessages]);

  if (!isStaff) {
    return <p>You are not authorized to edit spending names.</p>;
  }

  const formFields = [
    {
      fieldType: "text",
      fieldLabel: "Name",
      fieldValue: name,
      setFieldValue: setName,
    },
    {
      fieldType: "text",
      fieldLabel: "Description",
      fieldValue: description,
      setFieldValue: setDescription,
    },
  ];

  const handleEdit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setFlashMessages([{ category: "danger", message: "Name is required." }]);
      return;
    }

    setLoading(true);
    try {
      await put(
        `${SPENDING_NAMES_ENDPOINT}${spendingNameId}/`,
        { name, description },
        true
      );

      setFlashMessages([{ category: "success", message: "Spending name updated successfully." }]);
      navigate("/spending-names", { state: { timestamp: Date.now() } });
    } catch (error) {
      console.error("Failed to update spending name", error);
      const backendMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        "Failed to update spending name.";
      setFlashMessages([{ category: "danger", message: backendMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await del(`${SPENDING_NAMES_ENDPOINT}${spendingNameId}/`, true);
      setFlashMessages([{ category: "success", message: "Spending name deleted successfully." }]);
      navigate("/spending-names", { state: { timestamp: Date.now() } });
    } catch (error) {
      console.error("Failed to delete spending name", error);
      const backendMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        "Failed to delete spending name.";
      setFlashMessages([{ category: "danger", message: backendMessage }]);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <p>Loading spending name...</p>;
  }

  return (
    <GenericEditData
      title={`Edit Spending Name #${spendingNameId}`}
      formFields={formFields}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      submitButtonLabel={loading ? "Saving..." : "Save Changes"}
      disableSubmit={loading}
    />
  );
};

export default SpendingNameEdit;
