import React from "react";
import { useState, useContext } from "react";
import AppContext from "../../AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { RESEND_EMAIL_VERIFICATION } from "../ApiUtils/ApiEndpoints";
import { createResourceWithoutAuth } from "../ApiUtils/create_data";

const EmailNotVerified = () => {
  const location = useLocation();
  const email = location.state?.email || "empty_email@mail.com";
  const { setFlashMessages } = useContext(AppContext);

  const resendEmailVerification = () => {
    try {
      const posted_data = createResourceWithoutAuth(
        RESEND_EMAIL_VERIFICATION,
        { email: email },
        "resend_email_verification"
      );
      setFlashMessages([
        {
          category: "success",
          message: `Resent email verification link to your email ${email}`,
        },
      ]);
    } catch (error) {
      console.log(`Error : ${error}`);
    }
  };

  return (
    <>
      {email} is registered but not verified yet! Please verify your email by
      clicking on url we sent to your email!
      <p>
        Press this link to resend email verification{" "}
        <button className="btn btn-primary" onClick={resendEmailVerification}>
          Resend email verification
        </button>
      </p>
    </>
  );
};

export default EmailNotVerified;
