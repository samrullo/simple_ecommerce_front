// src/components/FXRates/FXRateEdit.js
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import {
    FXRATES_ENDPOINT, CREATE_UPDATE_FXRATES_ENDPOINT
} from "../ApiUtils/ApiEndpoints";
import GenericEditData from "../GenericDataComponents/GenericEditData";
import extractApiErrorMessage from "../../utils/extractApiErrorMessage";

const FXRateEdit = () => {
    const { fxRateId } = useParams();
    const { get, post } = useApi();
    const navigate = useNavigate();
    const { userInfo, setFlashMessages } = useContext(AppContext);

    const [currencyFromCode, setCurrencyFromCode] = useState("")
    const [currencyToCode, setCurrencyToCode] = useState("")
    const [currencyFromId, setCurrencyFromId] = useState(null)
    const [currencyToId, setCurrencyToId] = useState(null)
    const [fxRate, setFxRate] = useState(null);
    const [startDate, setStartDate] = useState(null)
    const [fxRateSource, setFxRateSource] = useState("")
    const [hasLoaded, setHasLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!hasLoaded) {
            const fetchFxRate = async () => {
                try {
                    const data = await get(`${FXRATES_ENDPOINT}${fxRateId}/`, false);
                    setCurrencyFromCode(data.currency_from?.code)
                    setCurrencyToCode(data.currency_to?.code)
                    setCurrencyFromId(data.currency_from?.id)
                    setCurrencyToId(data.currency_to?.id)
                    setFxRate(data.rate)
                    setFxRateSource(data?.source||"")
                    setStartDate(data.start_date)
                    setHasLoaded(true)

                } catch (err) {
                    console.error("Failed to fetch FX rate", err);
                    setFxRate(null);
                }
            };
            fetchFxRate();
        }
    }, [hasLoaded, fxRateId]);

    if (!userInfo?.is_staff) return <p>You are not authorized to edit FX rates.</p>;


    const handleEdit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                currency_from_id: currencyFromId,
                currency_to_id: currencyToId,
                rate: fxRate,
                source: fxRateSource,
            }
            console.log(`Sending payload ${JSON.stringify(payload)}`)
            await post(`${CREATE_UPDATE_FXRATES_ENDPOINT}`, payload, true);
            setFlashMessages([{ category: "success", message: "FX rate updated successfully." }]);
            navigate("/fxrates", { state: { timestamp: Date.now() } }); // go back to fx list
        } catch (err) {
            const backendMessage = extractApiErrorMessage(err, null);
            const message = backendMessage
                ? `Failed to update FX rate: ${backendMessage}`
                : "Failed to update FX rate.";
            setFlashMessages([{ category: "danger", message }]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        setFlashMessages([{ category: "danger", message: "Deletion not allowed" }]);
    }

    // if user is not staff or super user he can't update FX rate
    if (!userInfo?.is_staff && !userInfo?.is_superuser) {
        return <p>You are not authorized to edit products.</p>;
    }

    const formFields = [
        {
            fieldType: "text",
            fieldLabel: "Currency From",
            fieldValue: currencyFromCode,
            setFieldValue: setCurrencyFromCode,
            fieldProps: { disabled: true }
        },
        {
            fieldType: "text",
            fieldLabel: "Currency To",
            fieldValue: currencyToCode,
            setFieldValue: setCurrencyToCode,
            fieldProps: { disabled: true }
        },
        {
            fieldType: "numeric",
            fieldLabel: "FX Rate",
            fieldValue: fxRate,
            setFieldValue: setFxRate
        }
    ]

    return (
        <>
            {loading && (
                <div className="alert alert-info" role="alert">
                    Updating fx rate...
                </div>
            )}
            <GenericEditData
                title={`Edit FXRAte #${fxRateId}`}
                formFields={formFields}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        </>
    );
};

export default FXRateEdit;
