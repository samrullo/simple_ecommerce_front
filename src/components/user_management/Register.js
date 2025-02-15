import React from "react";
import { createResourceWithoutAuth } from "../ApiUtils/create_data";
import { REGISTER_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import GenericNewData from "../GenericDataComponents/GenericNewData";
import AppContext from "../../AppContext";

const Register = () => {
  const navigate = useNavigate();
  const { setFlashMessages, setEmailNotVerified } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [phone, setPhone] = useState("+998123456789");
  const [street, setStreet] = useState("Yunusabad");
  const [city, setCity] = useState("Tashkent");
  const [state, setState] = useState("Tashkent");
  const [zipCode, setZipCode] = useState("123-4567");
  const [country, setCountry] = useState("Uzbekistan");
  const [isDefault, setIsDefault] = useState(true);

  const handleRegister = (e) => {
    try {
      e.preventDefault();
      const payload = {
        email: email,
        password1: password1,
        password2: password2,
        first_name: firstName,
        last_name: lastName,
        customer: { phone: phone },
        address: {
          street: street,
          city: city,
          state: state,
          zip_code: zipCode,
          country: country,
          is_default: isDefault,
        },
      };
      const posted_data = createResourceWithoutAuth(
        REGISTER_ENDPOINT,
        payload,
        "registration"
      );
      setFlashMessages([
        {
          category: "success",
          message: `Registration successful! ${JSON.stringify(posted_data)}`,
        },
      ]);
      setEmailNotVerified(true);
      navigate("/email_unverified", { state: { email: email } });
    } catch (error) {
      console.log(`Error while registering : ${error}`);
      setFlashMessages([
        { category: "danger", message: `Registration failed! ${error}` },
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
      fieldLabel: "Password1",
      fieldValue: password1,
      setFieldValue: setPassword1,
    },
    {
      fieldType: "password",
      fieldLabel: "Password2",
      fieldValue: password2,
      setFieldValue: setPassword2,
    },
    {
      fieldType: "text",
      fieldLabel: "First Name",
      fieldValue: firstName,
      setFieldValue: setFirstName,
    },
    {
      fieldType: "text",
      fieldLabel: "Last Name",
      fieldValue: lastName,
      setFieldValue: setLastName,
    },
    {
      fieldType: "text",
      fieldLabel: "Phone",
      fieldValue: phone,
      setFieldValue: setPhone,
    },
    {
      fieldType: "text",
      fieldLabel: "Street",
      fieldValue: street,
      setFieldValue: setStreet,
    },
    {
      fieldType: "text",
      fieldLabel: "City",
      fieldValue: city,
      setFieldValue: setCity,
    },
    {
      fieldType: "text",
      fieldLabel: "State",
      fieldValue: state,
      setFieldValue: setState,
    },
    {
      fieldType: "text",
      fieldLabel: "Zip Code",
      fieldValue: zipCode,
      setFieldValue: setZipCode,
    },
    {
      fieldType: "text",
      fieldLabel: "Country",
      fieldValue: country,
      setFieldValue: setCountry,
    },
    {
      fieldType: "checkbox",
      fieldLabel: "Is Default Address",
      fieldValue: isDefault,
      setFieldValue: setIsDefault,
    },
  ];

  return (
    <>
      <GenericNewData
        title="Register"
        formFields={formFields}
        handleNewData={handleRegister}
      />
    </>
  );
};

export default Register;
