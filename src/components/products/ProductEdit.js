import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GenericEditData from "../GenericDataComponents/GenericEditData";
import AppContext from "../../AppContext";
import { PRODUCTS_ENDPOINT,UPDATE_PRODUCT_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import { useApi } from "../hooks/useApi";

const ProductEdit = () => {
  const { productId } = useParams();
  const [hasLoaded, setHasLoaded] = useState(false);

  const navigate = useNavigate();
  const { userInfo, setFlashMessages } = useContext(AppContext);
  const { get, put, del } = useApi();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(1);
  const [categoryName, setCategoryName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasLoaded) {
      const loadProduct = async () => {
        try {
          const data = await get(`${PRODUCTS_ENDPOINT}${productId}/`);
          setName(data.name);
          setSku(data.sku);
          setDescription(data.description || "");
          const activePrice = data.price?.find(p => p.end_date === null);
          setPrice(activePrice?.price || "");
          const activeInventory = data.inventory?.[0];          
          setStock(activeInventory?.stock || 1);
          setCategoryName(data.category?.name || "");
          setBrandName(data.brand?.name || "");
          setTagsText(data.tags?.map(t => t.name).join(", ") || "");
          setHasLoaded(true);
        } catch (err) {
          console.error("Failed to fetch product:", err);
          setFlashMessages([{ category: "danger", message: "Failed to load product." }]);
        }
      };

      loadProduct();
    }
  }, [hasLoaded, get, productId, setFlashMessages]);

  if (!userInfo?.is_staff && !userInfo?.is_superuser) {
    return <p>You are not authorized to edit products.</p>;
  }

  const formFields = [
    {
      fieldType: "text",
      fieldLabel: "Name",
      fieldValue: name,
      setFieldValue: setName,
    },
    {
      fieldType: "text",
      fieldLabel: "SKU",
      fieldValue: sku,
      setFieldValue: setSku,
    },
    {
      fieldType: "textarea",
      fieldLabel: "Description",
      fieldValue: description,
      setFieldValue: setDescription,
    },
    {
      fieldType: "number",
      fieldLabel: "Price",
      fieldValue: price,
      setFieldValue: setPrice,
    },
    {
      fieldType: "number",
      fieldLabel: "Inventory (Stock)",
      fieldValue: stock,
      setFieldValue: setStock,
    },
    {
      fieldType: "text",
      fieldLabel: "Category",
      fieldValue: categoryName,
      setFieldValue: setCategoryName,
    },
    {
      fieldType: "text",
      fieldLabel: "Brand",
      fieldValue: brandName,
      setFieldValue: setBrandName,
    },
    {
      fieldType: "text",
      fieldLabel: "Tags (comma-separated)",
      fieldValue: tagsText,
      setFieldValue: setTagsText,
    },
    {
      fieldType: "file",
      fieldLabel: "Image (optional)",
      setFieldValue: setImage,
    },
  ];

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", sku);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("category_name", categoryName);
    formData.append("brand_name", brandName);
    formData.append("tags", tagsText);
    if (image) formData.append("image", image); // optional

    try {
      await put(`${UPDATE_PRODUCT_ENDPOINT}${productId}/`, formData, true);
      setFlashMessages([{ category: "success", message: "Product updated successfully." }]);
      navigate("/products", { state: { timestamp: Date.now() } });
    } catch (error) {
      const backendMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        "Update failed.";

      setFlashMessages([{ category: "danger", message: `Update failed: ${backendMessage}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await del(`${PRODUCTS_ENDPOINT}${productId}/`, true);
      setFlashMessages([{ category: "success", message: "Product deleted." }]);
      navigate("/products", { state: { timestamp: Date.now() } });
    } catch (error) {
      const backendMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        JSON.stringify(error.response?.data) ||
        "Deletion failed.";

      setFlashMessages([{ category: "danger", message: `Deletion failed: ${backendMessage}` }]);
    }
  };

  return (
    <>
      {loading && (
        <div className="alert alert-info" role="alert">
          Updating product...
        </div>
      )}
      <GenericEditData
        title={`Edit Product #${productId}`}
        formFields={formFields}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default ProductEdit;