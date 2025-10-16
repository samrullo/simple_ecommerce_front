// src/components/weight_costs/WeightCostEdit.js
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import GenericEditData from "../GenericDataComponents/GenericEditData";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import {
    ACTIVE_WEIGHT_COST_ENDPOINT,
    CREATE_UPDATE_WEIGHT_COST_ENDPOINT,
    CURRENCIES_ENDPOINT,
} from "../ApiUtils/ApiEndpoints";
import extractApiErrorMessage from "../../utils/extractApiErrorMessage";

const WeightCostEdit = () => {
    const { get, post } = useApi();
    const { setFlashMessages, userInfo } = useContext(AppContext);
    const navigate = useNavigate();

    const isStaff = userInfo?.is_staff || userInfo?.is_superuser;
    const [form, setForm] = useState({ cost_per_kg: "", currency_id: "" });
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isStaff) return;

        const fetchData = async () => {
            try {
                const active = await get(ACTIVE_WEIGHT_COST_ENDPOINT, true);
                setForm({
                    cost_per_kg: active.cost_per_kg,
                    currency_id: active.weight_cost_currency?.id,
                });
            } catch (err) {
                console.error("Failed to fetch active weight cost:", err);
            }

            try {
                const currencyData = await get(CURRENCIES_ENDPOINT, false);
                setCurrencies(currencyData);
            } catch (err) {
                console.error("Failed to fetch currencies:", err);
            }
        };

        fetchData();
    }, [isStaff]);

    if (!isStaff) {
        return <p>You do not have permission to view this page.</p>;
    }

    const formFields = [
        {
            fieldType: "number",
            fieldLabel: "Cost per Kg",
            fieldValue: form.cost_per_kg,
            setFieldValue: (v) => setForm({ ...form, cost_per_kg: v }),
        },
        {
            fieldType: "select",
            fieldLabel: "Currency",
            fieldValue:
                currencies
                    .map((c) => ({ value: c.id, label: `${c.code} - ${c.name}`, id: c.id }))
                    .find((opt) => opt.value === form.currency_id) || null,
            setFieldValue: (v) => setForm({ ...form, currency_id: v.value }),
            selectOptions: currencies.map((c) => ({
                value: c.id,
                label: `${c.code} - ${c.name}`,
                id: c.id,
            })),
        },
    ];

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await post(CREATE_UPDATE_WEIGHT_COST_ENDPOINT, form, true);
            setFlashMessages([{ category: "success", message: "Weight cost updated successfully." }]);
            navigate("/weight-costs", { state: { timestamp: Date.now() } });
        } catch (err) {
            const backendMessage = extractApiErrorMessage(err, null);
            const message = backendMessage
                ? `Failed to update weight cost: ${backendMessage}`
                : "Failed to update weight cost.";
            setFlashMessages([{ category: "danger", message }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GenericEditData
            title="Edit Active Weight Cost"
            formFields={formFields}
            handleEdit={handleUpdate}
            disableSubmit={loading}
        />
    );
};

export default WeightCostEdit;
