// src/components/Purchase/PurchaseByDateNew.js
import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import GenericNewData from "../GenericDataComponents/GenericNewData";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import {
  MINIMAL_PRODUCTS_ENDPOINT,
  LAST_PURCHASE_PRICES_ENDPOINT,
  PURCHASE_CREATE_ENDPOINT,
  CURRENCIES_ENDPOINT,
} from "../ApiUtils/ApiEndpoints";

const PurchaseByDateNew = () => {
  const { get, post } = useApi();
  const navigate = useNavigate();
  const { userInfo, setFlashMessages } = useContext(AppContext);

  const [purchaseDate, setPurchaseDate] = useState("");
  const [products, setProducts] = useState([]);
  const [lastPurchasePrices, setLastPurchasePrices] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const fetched = await get(CURRENCIES_ENDPOINT);
        setCurrencies(
          fetched.map((c) => ({ value: c.code, label: c.name }))
        );
      } catch (err) {
        console.error("Error fetching currencies", err);
        setCurrencies([]);
      }
    };
    fetchCurrencies();
  }, []);

  // Fetch minimal products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await get(MINIMAL_PRODUCTS_ENDPOINT, false);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Fetch last purchase prices
  useEffect(() => {
    const fetchLastPrices = async () => {
      try {
        const data = await get(LAST_PURCHASE_PRICES_ENDPOINT, false);
        setLastPurchasePrices(data);
      } catch (err) {
        console.error("Error fetching last purchase prices", err);
        setLastPurchasePrices([]);
      }
    };
    fetchLastPrices();
  }, []);

  // Merge products with last purchase price
  const enrichedProducts = useMemo(() => {
    return products.map((p) => {
      const lastPrice = lastPurchasePrices.find((lp) => lp.product === p.id);
      return {
        value: p.id,
        label: p.name,
        last_price: lastPrice?.last_price || "",
        last_currency: lastPrice?.currency || null,
      };
    });
  }, [products, lastPurchasePrices]);

  // When product changes, populate price and currency
  useEffect(() => {
    if (!selectedProduct) return;
    const match = enrichedProducts.find((p) => p.value === selectedProduct.value);
    if (match) {
      if (match.last_price) setPricePerUnit(match.last_price);
      if (match.last_currency) {
        setSelectedCurrency({
          value: match.last_currency.code,
          label: match.last_currency.name,
        });
      }
    }
  }, [selectedProduct, enrichedProducts]);

  if (!userInfo?.is_staff) {
    return <p>You are not authorized to create purchases.</p>;
  }

  const formFields = [
    {
      fieldType: "date",
      fieldLabel: "Purchase Date",
      fieldValue: purchaseDate,
      setFieldValue: setPurchaseDate,
    },
    {
      fieldType: "select",
      fieldLabel: "Product",
      fieldValue: selectedProduct,
      setFieldValue: setSelectedProduct,
      selectOptions: enrichedProducts,
    },
    {
      fieldType: "number",
      fieldLabel: "Quantity",
      fieldValue: quantity,
      setFieldValue: setQuantity,
    },
    {
      fieldType: "number",
      fieldLabel: "Price per Unit",
      fieldValue: pricePerUnit,
      setFieldValue: setPricePerUnit,
    },
    {
      fieldType: "select",
      fieldLabel: "Currency",
      fieldValue: selectedCurrency,
      setFieldValue: setSelectedCurrency,
      selectOptions: currencies,
    },
  ];

  const handleNewData = async (e) => {
    e.preventDefault();
    if (!selectedProduct?.value || !purchaseDate) {
      setFlashMessages([
        { category: "danger", message: "Please select a product and a date." },
      ]);
      return;
    }

    setLoading(true);
    try {
      await post(
        PURCHASE_CREATE_ENDPOINT,
        {
          product_id: selectedProduct.value,
          quantity,
          price_per_unit: pricePerUnit,
          currency: selectedCurrency?.value,
          purchase_datetime: `${purchaseDate}T00:00:00`,
        },
        true
      );
      setFlashMessages([
        { category: "success", message: "Purchase created successfully." },
      ]);
      navigate(`/purchases-by-date-detail/${purchaseDate}`);
    } catch (err) {
      setFlashMessages([
        { category: "danger", message: "Failed to create purchase." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GenericNewData
      title="New Purchase By Date"
      formFields={formFields}
      handleNewData={handleNewData}
      submitButtonLabel={loading ? "Submitting..." : "Create Purchase"}
      disableSubmit={loading}
    />
  );
};

export default PurchaseByDateNew;