import React from "react";
import { createResourceWithoutAuth } from "../ApiUtils/create_data";
import { REGISTER_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import { useState, useContext, useEffect } from "react";
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
  const [passwordTouched, setPasswordTouched] = useState({
    password1: false,
    password2: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({
    password1: "",
    password2: "",
  });

  useEffect(() => {
    const errors = {
      password1:
        password1.length < 8
          ? "Password must be at least 8 characters long."
          : "",
      password2: "",
    };

    if (password2.length < 8) {
      errors.password2 = "Password must be at least 8 characters long.";
    } else if (password1 !== password2) {
      errors.password2 = "Passwords do not match.";
    }

    setPasswordErrors(errors);
  }, [password1, password2]);

  const handlePasswordBlur = (fieldName) => () => {
    setPasswordTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  const handleRegister = (e) => {
    try {
      e.preventDefault();
      if (password1.length < 8) {
        setPasswordTouched((prev) => ({ ...prev, password1: true }));
        setFlashMessages([
          {
            category: "danger",
            message: "Password must be at least 8 characters long.",
          },
        ]);
        return;
      }
      if (password2.length < 8) {
        setPasswordTouched((prev) => ({ ...prev, password2: true }));
        setFlashMessages([
          {
            category: "danger",
            message: "Password must be at least 8 characters long.",
          },
        ]);
        return;
      }
      if (password1 !== password2) {
        setPasswordTouched((prev) => ({
          ...prev,
          password1: true,
          password2: true,
        }));
        setFlashMessages([
          {
            category: "danger",
            message: "Passwords do not match.",
          },
        ]);
        return;
      }
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
      fieldType: "custom",
      fieldLabel: "Password1",
      fieldProps: {
        render: () => (
          <>
            <input
              type="password"
              className={`form-control ${
                passwordTouched.password1 && passwordErrors.password1
                  ? "is-invalid"
                  : ""
              }`}
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              onBlur={handlePasswordBlur("password1")}
            />
            {passwordTouched.password1 && passwordErrors.password1 && (
              <div className="invalid-feedback d-block">
                {passwordErrors.password1}
              </div>
            )}
          </>
        ),
      },
    },
    {
      fieldType: "custom",
      fieldLabel: "Password2",
      fieldProps: {
        render: () => (
          <>
            <input
              type="password"
              className={`form-control ${
                passwordTouched.password2 && passwordErrors.password2
                  ? "is-invalid"
                  : ""
              }`}
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              onBlur={handlePasswordBlur("password2")}
            />
            {passwordTouched.password2 && passwordErrors.password2 && (
              <div className="invalid-feedback d-block">
                {passwordErrors.password2}
              </div>
            )}
          </>
        ),
      },
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
