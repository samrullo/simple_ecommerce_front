// src/components/profit_rates/ProfitRate.js
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import AppContext from "../../AppContext";
import {
  ACTIVE_PROFIT_RATE_ENDPOINT,
  PROFIT_RATES_ENDPOINT,
} from "../ApiUtils/ApiEndpoints";

const ProfitRate = () => {
  const { get } = useApi();
  const navigate = useNavigate();
  const { userInfo } = useContext(AppContext);
  const [active, setActive] = useState(null);
  const [history, setHistory] = useState([]);
  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;

  useEffect(() => {
    if (!isStaff) return;
    const fetchData = async () => {
      try {
        const activeRate = await get(ACTIVE_PROFIT_RATE_ENDPOINT, true);
        setActive(activeRate);
      } catch {
        setActive(null);
      }
      try {
        const all = await get(PROFIT_RATES_ENDPOINT, true);
        setHistory(all);
      } catch (err) {
        console.error("Failed to fetch profit rate history", err);
      }
    };
    fetchData();
  }, [isStaff]);

  if (!isStaff) return <p>You do not have permission to view this page.</p>;

  return (
    <div className="container mt-4">
      <h1>Profit Rate Management</h1>

      <h3 className="mt-4">Active Profit Rate</h3>
      {!active ? (
        <div>
          <p>No active profit rate found.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/profit-rates/new")}
          >
            Create New Profit Rate
          </button>
        </div>
      ) : (
        <>
          <table className="table table-bordered mt-3">
            <tbody>
              <tr><th>ID</th><td>{active.id}</td></tr>
              <tr><th>Profit Rate (%)</th><td>{active.profit_rate}</td></tr>
              <tr><th>Start Date</th><td>{active.start_date}</td></tr>
            </tbody>
          </table>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/profit-rates/edit/active")}
          >
            Edit Active Profit Rate
          </button>
        </>
      )}

      <h3 className="mt-5">History</h3>
      {history.length === 0 ? (
        <p>No past records.</p>
      ) : (
        <table className="table table-striped table-bordered mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Profit Rate (%)</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.profit_rate}</td>
                <td>{r.start_date}</td>
                <td>{r.end_date || "Active"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProfitRate;
