import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../AppContext";
import GenericNewData from "../GenericDataComponents/GenericNewData";
import { PASSWORD_RESET_REQUEST_ENDPOINT } from "../ApiUtils/ApiEndpoints";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { setFlashMessages } = useContext(AppContext);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(PASSWORD_RESET_REQUEST_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Forgot password error:", errorData);
        setFlashMessages([
          { category: "danger", message: "Failed to send reset email." },
        ]);
        return;
      }

      setFlashMessages([
        {
          category: "success",
          message: "Password reset email sent! Please check your inbox.",
        },
      ]);
      navigate("/login");
    } catch (error) {
      console.error("Unexpected error:", error);
      setFlashMessages([
        { category: "danger", message: `Unexpected error: ${error}` },
      ]);
    }
  };

  const formFields = [
    {
      fieldType: "email",
      fieldLabel: "Email",
      fieldValue: email,
      setFieldValue: setEmail,
    },
  ];

  return (
    <GenericNewData
      title="Forgot Password"
      formFields={formFields}
      handleNewData={handleForgotPassword}
    />
  );
};

export default ForgotPassword;
