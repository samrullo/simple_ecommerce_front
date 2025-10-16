import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../AppContext";
import GenericNewData from "../GenericDataComponents/GenericNewData";
import { PASSWORD_RESET_REQUEST_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import extractApiErrorMessage from "../../utils/extractApiErrorMessage";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // ✅ new loading state
  const navigate = useNavigate();
  const { setFlashMessages } = useContext(AppContext);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(PASSWORD_RESET_REQUEST_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        let errorData = null;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error("Forgot password error (unable to parse JSON):", parseError);
        }
        console.error("Forgot password error:", errorData || response.statusText);
        const message = extractApiErrorMessage(
          { response: { data: errorData } },
          "Failed to send reset email."
        );
        setFlashMessages([{ category: "danger", message }]);
        setLoading(false);
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
      const message = extractApiErrorMessage(error, "Unexpected error while sending reset email.");
      setFlashMessages([{ category: "danger", message }]);
    } finally {
      setLoading(false); // ✅ always stop loading
    }
  };

  const formFields = [
    {
      fieldType: "email",
      fieldLabel: "Email",
      fieldValue: email,
      setFieldValue: setEmail,
      fieldProps: { disabled: loading }, // optional disable during loading
    },
  ];

  return (
    <>
      {loading && (
        <div className="alert alert-info" role="alert">
          Sending password reset email...
        </div>
      )}
      <GenericNewData
        title="Forgot Password"
        formFields={formFields}
        handleNewData={handleForgotPassword}
        submitButtonLabel={loading ? "Sending..." : "Send Reset Link"}
        disableSubmit={loading}
      />

    </>
  );
};

export default ForgotPassword;
