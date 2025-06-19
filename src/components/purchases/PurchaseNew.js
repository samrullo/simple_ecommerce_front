import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GenericNewData from "../GenericDataComponents/GenericNewData";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { PRODUCTS_ENDPOINT, PURCHASE_CREATE_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const PurchaseNew = () => {
  const { get, post } = useApi();
  const navigate = useNavigate();
  const { userInfo, setFlashMessages } = useContext(AppContext);

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [purchaseDatetime, setPurchaseDatetime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await get(PRODUCTS_ENDPOINT, false);
        const options = data.map((product) => ({
          value: product.id,
          label: product.name,
        }));
        setProducts(options);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  if (!userInfo?.is_staff) return <p>You are not authorized to create purchases.</p>;

  const formFields = [
    {
      fieldType: "select",
      fieldLabel: "Product",
      fieldValue: selectedProduct,
      setFieldValue: setSelectedProduct,
      selectOptions: products,
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
      fieldType: "datetime-local",
      fieldLabel: "Purchase DateTime",
      fieldValue: purchaseDatetime,
      setFieldValue: setPurchaseDatetime,
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
          purchase_datetime: purchaseDatetime,
        },
        true
      );

      setFlashMessages([{ category: "success", message: "Purchase created successfully." }]);
      navigate("/purchases", { state: { timestamp: Date.now() } });
    } catch (err) {
      console.error(err);
      setFlashMessages([{ category: "danger", message: "Failed to create purchase." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <div className="alert alert-info">Creating purchase...</div>}
      <GenericNewData
        title="New Purchase"
        formFields={formFields}
        handleNewData={handleNewData}
        submitButtonLabel={loading ? "Submitting..." : "Create Purchase"}
        disableSubmit={loading}
      />
    </>
  );
};

export default PurchaseNew;