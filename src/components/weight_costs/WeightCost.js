// src/components/weight_costs/WeightCost.js
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import AppContext from "../../AppContext";
import {
  ACTIVE_WEIGHT_COST_ENDPOINT,
  WEIGHT_COSTS_ENDPOINT,
} from "../ApiUtils/ApiEndpoints";

const WeightCost = () => {
  const { get } = useApi();
  const navigate = useNavigate();
  const { userInfo } = useContext(AppContext);
  const [activeWeightCost, setActiveWeightCost] = useState(null);
  const [history, setHistory] = useState([]);
  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;

  useEffect(() => {
    if (!isStaff) return;

    const fetchData = async () => {
      try {
        const active = await get(ACTIVE_WEIGHT_COST_ENDPOINT, true);
        setActiveWeightCost(active);
      } catch {
        setActiveWeightCost(null);
      }

      try {
        const all = await get(WEIGHT_COSTS_ENDPOINT, true);
        setHistory(all);
      } catch (err) {
        console.error("Failed to fetch history", err);
      }
    };

    fetchData();
  }, [isStaff]);

  if (!isStaff) {
    return <p>You do not have permission to view this page.</p>;
  }

  return (
    <div className="container mt-4">
      <h1>Weight Cost Management</h1>

      {/* Active */}
      <h3 className="mt-4">Active Weight Cost</h3>
      {!activeWeightCost ? (
        <div>
          <p>No active weight cost found.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/weight-costs/new")}
          >
            Create New Weight Cost
          </button>
        </div>
      ) : (
        <>
          <table className="table table-bordered mt-3">
            <tbody>
              <tr>
                <th>ID</th>
                <td>{activeWeightCost.id}</td>
              </tr>
              <tr>
                <th>Cost per Kg</th>
                <td>{activeWeightCost.cost_per_kg}</td>
              </tr>
              <tr>
                <th>Currency</th>
                <td>{activeWeightCost.weight_cost_currency?.code}</td>
              </tr>
              <tr>
                <th>Start Date</th>
                <td>{activeWeightCost.start_date}</td>
              </tr>
            </tbody>
          </table>

          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/weight-costs/edit/active")}
          >
            Edit Active Weight Cost
          </button>
        </>
      )}

      {/* History */}
      <h3 className="mt-5">History</h3>
      {history.length === 0 ? (
        <p>No past records.</p>
      ) : (
        <table className="table table-striped table-bordered mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cost per Kg</th>
              <th>Currency</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((wc) => (
              <tr key={wc.id}>
                <td>{wc.id}</td>
                <td>{wc.cost_per_kg}</td>
                <td>{wc.weight_cost_currency?.code}</td>
                <td>{wc.start_date}</td>
                <td>{wc.end_date || "Active"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WeightCost;
