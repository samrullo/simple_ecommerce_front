import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GenericNewData from "../GenericDataComponents/GenericNewData";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { CREATE_PRODUCT_ENDPOINT, CURRENCIES_ENDPOINT, CATEGORIES_ENDPOINT, BRANDS_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const ProductNew = () => {
  const { get, post } = useApi();
  const navigate = useNavigate();
  const { userInfo, setFlashMessages } = useContext(AppContext);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [stock, setStock] = useState(1);
  const [categoryName, setCategoryName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isNewCategory, setIsNewCategory] = useState(false);
  const [isNewBrand, setIsNewBrand] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await get(CURRENCIES_ENDPOINT);
        const options = data.map((c) => ({ value: c.code, label: c.name }));
        setCurrencies(options);
      } catch (err) {
        console.log("Error fetching currencies:", err);
        setCurrencies([]);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await get(CATEGORIES_ENDPOINT);
        setCategories(data.map((c) => ({ value: c.name, label: c.name })));
      } catch (err) {
        console.log("Failed to fetch categories", err);
      }
    };

    const fetchBrands = async () => {
      try {
        const data = await get(BRANDS_ENDPOINT);
        setBrands(data.map((b) => ({ value: b.name, label: b.name })));
      } catch (err) {
        console.log("Failed to fetch brands", err);
      }
    };

    fetchCurrencies();
    fetchCategories();
    fetchBrands();
  }, []);

  if (!userInfo?.is_staff && !userInfo?.is_superuser) {
    return <p>You are not authorized to create products.</p>;
  }

  const formFields = [
    {
      fieldName: "name",
      fieldType: "text",
      fieldLabel: "Name",
      fieldValue: name,
      setFieldValue: setName,
    },
    {
      fieldName: "sku",
      fieldType: "text",
      fieldLabel: "SKU",
      fieldValue: sku,
      setFieldValue: setSku,
    },
    {
      fieldName: "description",
      fieldType: "textarea",
      fieldLabel: "Description",
      fieldValue: description,
      setFieldValue: setDescription,
    },
    {
      fieldName: "price",
      fieldType: "number",
      fieldLabel: "Price",
      fieldValue: price,
      setFieldValue: setPrice,
    },
    {
      fieldName: "currency",
      fieldType: "select",
      fieldLabel: "Currency",
      fieldValue: selectedCurrency,
      setFieldValue: setSelectedCurrency,
      selectOptions: currencies,
    },
    {
      fieldName: "stock",
      fieldType: "number",
      fieldLabel: "Initial Inventory (Stock)",
      fieldValue: stock,
      setFieldValue: setStock,
    },
    {
      fieldName: "category",
      fieldType: isNewCategory ? "text" : "select",
      fieldLabel: (
        <div className="d-flex gap-4 mb-3">
          Category
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={isNewCategory}
              onChange={(e) => {
                setIsNewCategory(e.target.checked);
                setCategoryName("");
              }}
              id="toggleCategory"
            />
            <label className="form-check-label" htmlFor="toggleCategory">
              Add New Category
            </label>
          </div></div>),
      fieldValue: categoryName,
      setFieldValue: setCategoryName,
      ...(isNewCategory ? {} : { selectOptions: categories }),
    },
    {
      fieldName: "brand",
      fieldType: isNewBrand ? "text" : "select",
      fieldLabel: (
        <div className="d-flex gap-4 mb-3">
          Brand
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={isNewBrand}
              onChange={(e) => {
                setIsNewBrand(e.target.checked);
                setBrandName("");
              }}
              id="toggleBrand"
            />
            <label className="form-check-label" htmlFor="toggleBrand">
              Add New Brand
            </label>
          </div>
        </div>),
      fieldValue: brandName,
      setFieldValue: setBrandName,
      ...(isNewBrand ? {} : { selectOptions: brands }),
    },
    {
      fieldName: "tags",
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
    formData.append("currency", selectedCurrency.value);
    formData.append("stock", stock);
    formData.append("category_name", isNewCategory ? categoryName : categoryName.value);
    formData.append("brand_name", isNewBrand ? brandName : brandName.value);
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
    <GenericNewData
      title="New Product"
      formFields={formFields}
      handleNewData={handleNewData}
      submitButtonLabel={loading ? "Submitting..." : "Create Product"}
      disableSubmit={loading}
    />
  );
};

export default ProductNew;
