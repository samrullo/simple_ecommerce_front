// src/components/Purchase/PurchaseByDateDetailEdit.js
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GenericEditData from "../GenericDataComponents/GenericEditData";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import {
  PURCHASES_ENDPOINT,
  UPDATE_PURCHASE_ENDPOINT,
  PRODUCTS_ENDPOINT,
  CURRENCIES_ENDPOINT,
} from "../ApiUtils/ApiEndpoints";

const PurchaseByDateDetailEdit = () => {
  const { purchaseId, purchaseDate } = useParams();
  const navigate = useNavigate();
  const { userInfo, setFlashMessages } = useContext(AppContext);
  const { get, put, del } = useApi();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [purchaseDatetime, setPurchaseDatetime] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    get(PRODUCTS_ENDPOINT).then(data => {
      setProducts(data.map(p => ({ value: p.id, label: p.name })));
    });

    get(CURRENCIES_ENDPOINT).then(data => {
      setCurrencies(data.map(c => ({ value: c.code, label: c.name })));
    });
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      get(`${PURCHASES_ENDPOINT}${purchaseId}/`, true).then(data => {
        setSelectedProduct({ value: data.product, label: data.product_name });
        setQuantity(data.quantity);
        setPricePerUnit(data.price_per_unit);
        setSelectedCurrency({ value: data.currency?.code, label: data.currency?.name });
        setPurchaseDatetime(data.purchase_datetime);
        setHasLoaded(true);
      }).catch(() => {
        setFlashMessages([{ category: "danger", message: "Failed to load purchase." }]);
      });
    }
  }, [hasLoaded, purchaseId, setFlashMessages]);

  const formFields = [
    { fieldType: "select", fieldLabel: "Product", fieldValue: selectedProduct, setFieldValue: setSelectedProduct, selectOptions: products },
    { fieldType: "number", fieldLabel: "Quantity", fieldValue: quantity, setFieldValue: setQuantity },
    { fieldType: "number", fieldLabel: "Price per Unit", fieldValue: pricePerUnit, setFieldValue: setPricePerUnit },
    { fieldType: "select", fieldLabel: "Currency", fieldValue: selectedCurrency, setFieldValue: setSelectedCurrency, selectOptions: currencies },
  ];

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await put(`${UPDATE_PURCHASE_ENDPOINT}${purchaseId}/`, {
        product_id: selectedProduct.value,
        quantity,
        price_per_unit: pricePerUnit,
        currency: selectedCurrency?.value,
        purchase_datetime: purchaseDatetime,
      }, true);

      setFlashMessages([{ category: "success", message: "Purchase updated successfully." }]);
      navigate(`/purchases-by-date-detail/${purchaseDate}`,{ state: { timestamp: Date.now() } });
    } catch (err) {
      setFlashMessages([{ category: "danger", message: "Update failed." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await del(`${PURCHASES_ENDPOINT}${purchaseId}/`);
      setFlashMessages([{ category: "success", message: "Purchase deleted." }]);
      navigate(`/purchases-by-date-detail/${purchaseDate}`,{ state: { timestamp: Date.now() } });
    } catch (err) {
      setFlashMessages([{ category: "danger", message: "Deletion failed." }]);
    }
  };

  return (
    <GenericEditData
      title={`Edit Purchase #${purchaseId}`}
      formFields={formFields}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default PurchaseByDateDetailEdit;