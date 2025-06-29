import React, { useContext, useEffect, useState } from "react";
import NavBar from "./NavBar";
import FlashMessage from "./FlashMessage";
import AppRoutes from "./AppRoutes";
import LoginWithAccessToken from "./user_management/LoginWithAccessToken";
import AppContext from "../AppContext";
import { useApi } from "./hooks/useApi";
import { CURRENCIES_ENDPOINT } from "./ApiUtils/ApiEndpoints";

const MainPage = () => {
  const { baseCurrency, setBaseCurrency } = useContext(AppContext);
  const { get } = useApi();
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await get(CURRENCIES_ENDPOINT, false);
        setCurrencies(data.filter((cur) => cur.is_active));
      } catch (error) {
        console.error("Failed to fetch currencies:", error);
      }
    };
    fetchCurrencies();
  }, []);

  const handleCurrencyChange = (e) => {
    setBaseCurrency(e.target.value);
  };

  return (
    <div className="container mt-5">
      <header>
        <LoginWithAccessToken />
        <NavBar title="Simple Ecommerce" />

        {/* Dynamic Base Currency Dropdown */}
        <div className="mb-3 d-flex align-items-center">
          <label htmlFor="baseCurrency" className="form-label fw-bold me-3 mb-0" style={{ minWidth: "130px" }}>
            Base Currency:
          </label>
          <select
            id="baseCurrency"
            value={baseCurrency}
            onChange={handleCurrencyChange}
            className="form-select"
            style={{ maxWidth: "300px" }}
          >
            {currencies.map((cur) => (
              <option key={cur.code} value={cur.code}>
                {cur.code} - {cur.name}
              </option>
            ))}
          </select>
        </div>

        <FlashMessage />
      </header>

      <AppRoutes />
    </div>
  );
};

export default MainPage;