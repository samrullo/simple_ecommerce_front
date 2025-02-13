import React from "react";
import { useState } from "react";
import AppContext from "../../AppContext";
import { useContext } from "react";
import { LOGIN_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import GenericNewData from "../GenericDataComponents/GenericNewData";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setFlashMessages, setIsAuthenticated, isAuthenticated } =
    useContext(AppContext);

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
        const error_response = await response.json()
        throw new Error(`Login failed! ${JSON.stringify(error_response)}`);
      }

      const data = await response.json();

      console.log(`data from login : ${JSON.stringify(data)}`);

      //save tokens
      localStorage.setItem("access_token", data.access);
      setIsAuthenticated(true);
      setFlashMessages([{ category: "success", message: "Successful Login!" }]);
    } catch (error) {
      console.log(`Error during login : ${error}`);
      setFlashMessages([{ category: "danger", message: `Error during login : ${error}` }]);
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
      {isAuthenticated ? (
        <p>You're already logged in</p>
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
