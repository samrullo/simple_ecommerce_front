// src/components/Purchase/PurchaseByDateDetailCreate.js
import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GenericNewData from "../GenericDataComponents/GenericNewData";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import {
  MINIMAL_PRODUCTS_ENDPOINT,
  LAST_PURCHASE_PRICES_ENDPOINT,
  PURCHASE_CREATE_ENDPOINT,
  CURRENCIES_ENDPOINT,
} from "../ApiUtils/ApiEndpoints";

const PurchaseByDateDetailCreate = () => {
  const { get, post } = useApi();
  const navigate = useNavigate();
  const { purchaseDate } = useParams();
  const { userInfo, setFlashMessages } = useContext(AppContext);

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
        const data = await get(CURRENCIES_ENDPOINT);
        setCurrencies(data.map((c) => ({ value: c.code, label: c.name })));
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
      const lastPrice = lastPurchasePrices.find((lp) => lp.id === p.id);
      return {
        value: p.id,
        label: p.name,
        last_price: lastPrice?.last_price || "",
        last_currency: lastPrice?.last_currency || null,
      };
    });
  }, [products, lastPurchasePrices]);

  // Auto-fill price + currency when product changes
  useEffect(() => {
    if (!selectedProduct) return;
    const match = enrichedProducts.find((p) => p.value === selectedProduct.value);
    if (match) {
      console.log(`found match ${JSON.stringify(match)}`)
      if (match.last_price) setPricePerUnit(match.last_price);
      if (match.last_currency) {
        setSelectedCurrency({
          value: match.last_currency.code,
          label: match.last_currency.name,
        });
      } else {
        setSelectedCurrency({
          value: "",
          label: ""
        })
      }
    }
  }, [selectedProduct, enrichedProducts]);

  if (!userInfo?.is_staff) {
    return <p>You are not authorized to create purchases.</p>;
  }

  const formFields = [
    {
      fieldType: "select",
      fieldLabel: "Product",
      fieldValue: selectedProduct,
      setFieldValue: setSelectedProduct,
      selectOptions: enrichedProducts,
    },
    { fieldType: "number", fieldLabel: "Quantity", fieldValue: quantity, setFieldValue: setQuantity },
    { fieldType: "number", fieldLabel: "Price per Unit", fieldValue: pricePerUnit, setFieldValue: setPricePerUnit },
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
    if (!selectedProduct?.value) {
      setFlashMessages([{ category: "danger", message: "Please select a product." }]);
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
      setFlashMessages([{ category: "success", message: "Purchase created successfully." }]);
      navigate(`/purchases-by-date-detail/${purchaseDate}`, { state: { timestamp: Date.now() } });
    } catch (err) {
      setFlashMessages([{ category: "danger", message: "Failed to create purchase." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GenericNewData
      title={`New Purchase on ${purchaseDate}`}
      formFields={formFields}
      handleNewData={handleNewData}
      submitButtonLabel={loading ? "Submitting..." : "Create Purchase"}
      disableSubmit={loading}
    />
  );
};

export default PurchaseByDateDetailCreate;