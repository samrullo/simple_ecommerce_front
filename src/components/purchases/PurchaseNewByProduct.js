import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GenericNewData from "../GenericDataComponents/GenericNewData";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import {
  MINIMAL_PRODUCTS_ENDPOINT,
  PURCHASE_CREATE_ENDPOINT,
  CURRENCIES_ENDPOINT,
  LAST_PURCHASE_PRICES_ENDPOINT,
} from "../ApiUtils/ApiEndpoints";
import extractApiErrorMessage from "../../utils/extractApiErrorMessage";

const PurchaseNewByProduct = () => {
  const { get, post } = useApi();
  const navigate = useNavigate();
  const { productId } = useParams();
  const { userInfo, setFlashMessages } = useContext(AppContext);

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [purchaseDatetime, setPurchaseDatetime] = useState("");
  const [lastPurchasePrices, setLastPurchasePrices] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🕒 Automatically set current datetime (local time)
  useEffect(() => {
    const now = new Date();
    const formattedNow = now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
    setPurchaseDatetime(formattedNow);
  }, []);

  // 🪙 Fetch currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await get(CURRENCIES_ENDPOINT);
        const options = data.map((c) => ({
          value: c.code,
          label: `${c.code} - ${c.name}`,
        }));
        setCurrencies(options);
      } catch (err) {
        console.error("Error fetching currencies:", err);
        setCurrencies([]);
      }
    };
    fetchCurrencies();
  }, []);

  // 📦 Fetch products and preselect the one from URL
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await get(MINIMAL_PRODUCTS_ENDPOINT, false);
        const options = data.map((p) => ({
          value: p.id,
          label: p.name,
        }));
        setProducts(options);

        const preselected = options.find(
          (p) => String(p.value) === String(productId)
        );
        if (preselected) setSelectedProduct(preselected);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, [productId]);

  // 💰 Fetch last purchase prices
  useEffect(() => {
    const fetchLastPrices = async () => {
      try {
        const data = await get(LAST_PURCHASE_PRICES_ENDPOINT, false);
        setLastPurchasePrices(data);
      } catch (err) {
        console.error("Error fetching last purchase prices:", err);
        setLastPurchasePrices([]);
      }
    };
    fetchLastPrices();
  }, []);

  // 🧠 Auto-fill last price + currency when product changes
  useEffect(() => {
    if (!selectedProduct || !lastPurchasePrices.length || !currencies.length) return;

    const match = lastPurchasePrices.find(
      (lp) => lp.id === selectedProduct.value
    );

    if (match) {
      if (match.last_price) setPricePerUnit(match.last_price);
      if (match.last_currency) {
        const option = currencies.find(
          (c) => c.value === match.last_currency.code
        );
        setSelectedCurrency(option || null);
      } else {
        setSelectedCurrency(null);
      }
    }
  }, [selectedProduct, lastPurchasePrices, currencies]);

  if (!userInfo?.is_staff)
    return <p>You are not authorized to create purchases.</p>;

  const formFields = [
    {
      fieldType: "select",
      fieldLabel: "Product",
      fieldValue: selectedProduct,
      setFieldValue: setSelectedProduct,
      selectOptions: products,
      fieldProps: { isDisabled: true },
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
    {
      fieldType: "datetime-local",
      fieldLabel: "Purchase DateTime",
      fieldValue: purchaseDatetime,
      setFieldValue: setPurchaseDatetime,
      fieldProps: { readOnly: true },
    },
  ];

  const handleNewData = async (e) => {
    e.preventDefault();

    if (!selectedProduct?.value) {
      setFlashMessages([
        { category: "danger", message: "Product not found or invalid." },
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
          purchase_datetime: new Date().toISOString(), // always use now
        },
        true
      );

      setFlashMessages([
        { category: "success", message: "Purchase created successfully." },
      ]);
      navigate("/products", { state: { timestamp: Date.now() } });
    } catch (err) {
      console.error(err);
      const backendMessage = extractApiErrorMessage(err, null);
      const message = backendMessage
        ? `Failed to create purchase: ${backendMessage}`
        : "Failed to create purchase.";
      setFlashMessages([{ category: "danger", message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <div className="alert alert-info">Creating purchase...</div>}
      <GenericNewData
        title={`New Purchase for ${selectedProduct?.label || "Product"}`}
        formFields={formFields}
        handleNewData={handleNewData}
        submitButtonLabel={loading ? "Submitting..." : "Create Purchase"}
        disableSubmit={loading}
      />
    </>
  );
};

export default PurchaseNewByProduct;
