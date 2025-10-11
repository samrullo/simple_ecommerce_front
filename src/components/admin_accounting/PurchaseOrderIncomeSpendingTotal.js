// src/components/admin_accounting/PurchaseOrderIncomeSpendingTotal.js
import React, { useEffect, useState, useContext } from "react";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { ACTIVE_FXRATES_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import {
    PURCHASES_TOTAL_ENDPOINT,
    ORDERS_TOTAL_ENDPOINT,
    INCOME_TOTAL_ENDPOINT,
    SPENDING_TOTAL_ENDPOINT,
} from "../ApiUtils/ApiEndpoints";
import { useLocation, useNavigate } from "react-router-dom";

const PurchaseOrderIncomeSpendingTotal = () => {
    const navigate = useNavigate()
    const { baseCurrency } = useContext(AppContext);
    const { get } = useApi();
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const startDate = queryParams.get("start_date");
    const endDate = queryParams.get("end_date");

    const [totals, setTotals] = useState({
        purchase: 0,
        order: 0,
        income: 0,
        spending: 0,
        currency: ""
    });
    const [fxRates, setFxRates] = useState([]);

    useEffect(() => {
        const fetchTotals = async () => {
            try {
                const [purchase, order, income, spending, fx] = await Promise.all([
                    get(`${PURCHASES_TOTAL_ENDPOINT}?start_date=${startDate || ""}&end_date=${endDate || ""}`, true),
                    get(`${ORDERS_TOTAL_ENDPOINT}?start_date=${startDate || ""}&end_date=${endDate || ""}`, true),
                    get(`${INCOME_TOTAL_ENDPOINT}?start_date=${startDate || ""}&end_date=${endDate || ""}`, true),
                    get(`${SPENDING_TOTAL_ENDPOINT}?start_date=${startDate || ""}&end_date=${endDate || ""}`, true),
                    get(ACTIVE_FXRATES_ENDPOINT, false)
                ]);

                setTotals({
                    purchase: purchase.amount,
                    order: order.amount,
                    income: income.amount,
                    spending: spending.amount,
                    currency: income.currency, // all totals are in accounting currency
                });

                setFxRates(
                    fx.map((rate) => ({
                        from: rate.currency_from.code,
                        to: rate.currency_to.code,
                        rate: parseFloat(rate.rate),
                    }))
                );
            } catch (err) {
                console.error("Failed to fetch totals or FX rates", err);
            }
        };

        fetchTotals();
    }, [startDate, endDate]);

    const convert = (amount, from, to) => {
        if (from === to) return amount;
        const rate = fxRates.find((r) => r.from === from && r.to === to);
        return rate ? amount * rate.rate : amount;
    };

    const displayAmount = (amount) => {
        const value = convert(amount, totals.currency, baseCurrency);
        return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div className="container mt-4">
            <h2>Summary: Purchases, Orders, Income & Spending</h2>
            <table className="table table-bordered mt-3">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount ({baseCurrency})</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Total Purchase</td>
                        <td>{displayAmount(totals.purchase)}</td>
                    </tr>
                    <tr>
                        <td>Total Order</td>
                        <td>{displayAmount(totals.order)}</td>
                    </tr>
                    <tr>
                        <td>Total Income</td>
                        <td>{displayAmount(totals.income)}</td>
                    </tr>
                    <tr>
                        <td>Total Spending</td>
                        <td>{displayAmount(totals.spending)}</td>
                    </tr>
                    <tr className="table-secondary fw-bold">
                        <td>Net Income (Income+Order) - (Purchase + Spending)</td>
                        <td>{displayAmount((totals.income + totals.order) - (totals.spending + totals.purchase))}</td>
                    </tr>
                </tbody>
            </table>
            <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/totals-accounting-date-range-filter")}
            >
                Back to Date Range
            </button>
        </div>
    );
};

export default PurchaseOrderIncomeSpendingTotal;