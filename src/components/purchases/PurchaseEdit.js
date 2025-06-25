import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GenericEditData from "../GenericDataComponents/GenericEditData";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import {
  PURCHASES_ENDPOINT,
  UPDATE_PURCHASE_ENDPOINT,PRODUCTS_ENDPOINT
} from "../ApiUtils/ApiEndpoints";


const PurchaseEdit = () => {
  const { purchaseId } = useParams();
  const navigate = useNavigate();
  const { userInfo, setFlashMessages } = useContext(AppContext);
  const { get, put, del } = useApi();

  const [products,setProducts]=useState([])
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(0);
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

  useEffect(() => {
    const loadPurchase = async () => {
      try {
        const data = await get(`${PURCHASES_ENDPOINT}${purchaseId}/`);
        setProductId(data.product);
        setSelectedProduct({value:data.product,label:data.product_name})
        setQuantity(data.quantity);
        setPricePerUnit(data.price_per_unit);
        setPurchaseDatetime(data.purchase_datetime);
        setHasLoaded(true);
      } catch (err) {
        setFlashMessages([
          { category: "danger", message: "Failed to load purchase." },
        ]);
      }
    };

    if (!hasLoaded) loadPurchase();
  }, [hasLoaded, get, purchaseId, setFlashMessages]);

  if (!userInfo?.is_staff && !userInfo?.is_superuser) {
    return <p>You are not authorized to edit purchases.</p>;
  }

  const formFields = [
    {
      fieldType: "select",
      fieldLabel: "Product",
      fieldValue: selectedProduct,
      setFieldValue: setSelectedProduct,
      selectOptions: products,
    },,
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
      fieldLabel: "Purchase Datetime",
      fieldValue: purchaseDatetime,
      setFieldValue: setPurchaseDatetime,
    },
  ];

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      product_id: productId,
      quantity,
      price_per_unit: pricePerUnit,
      purchase_datetime: purchaseDatetime,
    };

    try {
      await put(`${UPDATE_PURCHASE_ENDPOINT}${purchaseId}/`, payload,true);
      setFlashMessages([
        { category: "success", message: "Purchase updated successfully." },
      ]);
      navigate("/purchases", { state: { timestamp: Date.now() } });
    } catch (error) {
      const backendMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        "Update failed.";

      setFlashMessages([
        { category: "danger", message: `Update failed: ${backendMessage}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await del(`${PURCHASES_ENDPOINT}${purchaseId}/`);
      setFlashMessages([
        { category: "success", message: "Purchase deleted." },
      ]);
      navigate("/purchases", { state: { timestamp: Date.now() } });
    } catch (error) {
      const backendMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        "Deletion failed.";

      setFlashMessages([
        { category: "danger", message: `Deletion failed: ${backendMessage}` },
      ]);
    }
  };

  return (
    <>
      {loading && (
        <div className="alert alert-info" role="alert">
          Updating purchase...
        </div>
      )}
      <GenericEditData
        title={`Edit Purchase #${purchaseId}`}
        formFields={formFields}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default PurchaseEdit;
