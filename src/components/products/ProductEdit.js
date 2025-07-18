import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GenericEditData from "../GenericDataComponents/GenericEditData";
import AppContext from "../../AppContext";
import {
  PRODUCTS_ENDPOINT,
  UPDATE_PRODUCT_ENDPOINT,
  CURRENCIES_ENDPOINT,
  CATEGORIES_ENDPOINT,
  BRANDS_ENDPOINT,
} from "../ApiUtils/ApiEndpoints";
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

  useEffect(() => {
    if (!hasLoaded) {
      const loadProduct = async () => {
        try {
          const data = await get(`${PRODUCTS_ENDPOINT}${productId}/`);
          setName(data.name);
          setSku(data.sku);
          setDescription(data.description || "");
          const activePrice = data.price?.find((p) => p.end_date === null);
          setPrice(activePrice?.price || "");
          const currency_code = activePrice?.currency?.code || "";
          const currency_name = activePrice?.currency?.name || "";
          setSelectedCurrency({ value: currency_code, label: currency_name });
          const activeInventory = data.inventory?.reduce((total, inv) => total + inv.stock, 0) || 0;
          setStock(activeInventory || 1);
          setCategoryName({ value: data.category?.name, label: data.category?.name });
          setBrandName({ value: data.brand?.name, label: data.brand?.name });
          setTagsText(data.tags?.map((t) => t.name).join(", ") || "");
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
      fieldType: "select",
      fieldLabel: "Currency",
      fieldValue: selectedCurrency,
      setFieldValue: setSelectedCurrency,
      selectOptions: currencies,
    },
    {
      fieldType: "number",
      fieldLabel: "Inventory (Stock)",
      fieldValue: stock,
      setFieldValue: setStock,
    },
    {
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
          </div>
        </div>
      ),
      fieldValue: categoryName,
      setFieldValue: setCategoryName,
      ...(isNewCategory ? {} : { selectOptions: categories }),
    },
    {
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
        </div>
      ),
      fieldValue: brandName,
      setFieldValue: setBrandName,
      ...(isNewBrand ? {} : { selectOptions: brands }),
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
    formData.append("currency", selectedCurrency.value);
    formData.append("stock", stock);
    formData.append("category_name", isNewCategory ? categoryName : categoryName.value);
    formData.append("brand_name", isNewBrand ? brandName : brandName.value);
    formData.append("tags", tagsText);
    if (image) formData.append("image", image);

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
