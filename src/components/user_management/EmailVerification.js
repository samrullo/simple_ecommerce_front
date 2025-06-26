import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useApi } from "../hooks/useApi"
import { VERIFY_EMAIL_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import AppContext from "../../AppContext";

const EmailVerification = () => {
    const { get } = useApi()

    const { key } = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState(null);
    const [status, setStatus] = useState("verifying")
    const [message, setMessage] = useState("");
    const { setFlashMessages, logoutUser } = useContext(AppContext);


    const verifyEmail = async () => {
        try {
            await get(
                `${VERIFY_EMAIL_ENDPOINT}${key}/`, false);

            setFlashMessages([
                {
                    category: "success",
                    message: "Email was successfully verified! You can log in now!",
                },
            ]);
            setStatus("success")
            setMessage("Your email was successfully verified. You can now log in")
            logoutUser();
        } catch (error) {
            setErrors(error?.response?.data || { detail: "Unknown error occurred" });
            if (error.response?.data?.detail) {
                setFlashMessages([{ category: "danger", message: error.response.data.detail }])

            } else {
                setFlashMessages([{ category: "danger", message: "An error occurred during verification." }])
            }
        }
    };




    return (
        <div className="container mt-5">
            <h2>Email Verification</h2>
            {key?<button className="btn btn-primary" onClick={verifyEmail}>Verify Email</button>:"Key not set yet"}
            
        </div>
    );
};

export default EmailVerification;