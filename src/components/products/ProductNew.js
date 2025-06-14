import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import GenericNewData from "../GenericDataComponents/GenericNewData";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { CREATE_PRODUCT_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const ProductNew = () => {
  const {get,put,post,patch,del}=useApi()
  const navigate = useNavigate();
  const { userInfo, setFlashMessages } = useContext(AppContext);

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

  if (!userInfo?.is_staff && !userInfo?.is_superuser) {
    return <p>You are not authorized to create products.</p>;
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
      fieldLabel: "Initial Inventory (Stock)",
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
      fieldLabel: "Image",
      setFieldValue: setImage,
    },
  ];

  const handleNewData = async (e) => {
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
    if (image) formData.append("image", image);

    try {
      await post(CREATE_PRODUCT_ENDPOINT, formData, true);      

      setFlashMessages([
        { category: "success", message: "Product created successfully." },
      ]);
      navigate("/products", { state: { timestamp: Date.now() } });
    } catch (error) {
      console.error("Error:", error);
      setFlashMessages([
        { category: "danger", message: "Failed to create product." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="alert alert-info" role="alert">
          Creating product...
        </div>
      )}
      <GenericNewData
        title="New Product"
        formFields={formFields}
        handleNewData={handleNewData}
        submitButtonLabel={loading ? "Submitting..." : "Create Product"}
        disableSubmit={loading}
      />
    </>
  );
};

export default ProductNew;
