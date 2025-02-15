import React from "react";
import { useState } from "react";
import AppContext from "../../AppContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import GenericNewData from "../GenericDataComponents/GenericNewData";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {
    setFlashMessages,
    setIsAuthenticated,
    isAuthenticated,
    emailNotVerified,
    setEmailNotVerified,
    userInfo,
    setUserInfo,
  } = useContext(AppContext);

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error_response = await response.json();
        console.log(`error_response is : ${JSON.stringify(error_response)}`);
        if (error_response.non_field_errors !== undefined) {
          const non_field_errors = error_response.non_field_errors;
          console.log(`non_field_errors value : ${non_field_errors[0]}`);

          if (non_field_errors[0].includes("E-mail")) {
            setEmailNotVerified(true);
            navigate("/email_unverified", { state: { email: email } });
          }
        }
        throw new Error(`Login failed! ${JSON.stringify(error_response)}`);
      }

      const data = await response.json();

      console.log(`data from login : ${JSON.stringify(data)}`);

      //save tokens
      localStorage.setItem("access_token", data.access);
      setIsAuthenticated(true);
      setUserInfo(data.user);
      setFlashMessages([{ category: "success", message: "Successful Login!" }]);
      navigate("/");
    } catch (error) {
      console.log(`Error during login : ${error}`);
      setFlashMessages([
        { category: "danger", message: `Error during login : ${error}` },
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
    {
      fieldType: "password",
      fieldLabel: "Password",
      fieldValue: password,
      setFieldValue: setPassword,
    },
  ];

  return (
    <>
      {isAuthenticated || emailNotVerified ? (
        <>
          <p>
            You're either already logged in or your email is not verified yet!
          </p>
          <p>
            Press this link to resend email verification{" "}
            <a href="http://loclahost:8000/auth/resend-email-verification/">
              Resend email verification
            </a>
          </p>
        </>
      ) : (
        <GenericNewData
          title="Login"
          formFields={formFields}
          handleNewData={handleLogin}
        />
      )}
    </>
  );
};

export default Login;
