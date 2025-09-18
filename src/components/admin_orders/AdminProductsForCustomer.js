// src/components/admin_orders/AdminProductsForCustomer.js
import React, { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../AppContext";
import DataTable from "../GenericDataComponents/DataTable";
import { useApi } from "../hooks/useApi";
import {
  PRODUCTS_WITH_ICON_IMAGE_ENDPOINT,
  ACTIVE_PRODUCT_PRICES_ENDPOINT,
  PRODUCT_TOTAL_INVENTORIES_ENDPOINT,
  FXRATES_ENDPOINT
} from "../ApiUtils/ApiEndpoints";
import AdminSelectCustomer from "./AdminSelectCustomer";

const AdminProductsForCustomer = () => {
  const { baseCurrency, adminSelectedCustomer } = useContext(AppContext);
  const { get } = useApi();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [productPrices, setProductPrices] = useState([]);
  const [productInventories, setProductInventories] = useState([]);
  const [fxRates, setFxRates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch core products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await get(PRODUCTS_WITH_ICON_IMAGE_ENDPOINT, false);
        setProducts(
          data.map(product => ({
            ...product,
            category: product.category?.name || "",
            brand: product.brand?.name || "",
            tags: product.tags?.map(tag => tag.name).join(", ") || "",
            image: product.icon_image?.image || null,
            price: "",
            currency: "",
            price_in_base_currency: "",
            inventory: "",
            base_currency: baseCurrency,
            add_to_cart: "",
            product_id: product.id
          }))
        );
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch supporting data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prices, inventories, rates] = await Promise.all([
          get(ACTIVE_PRODUCT_PRICES_ENDPOINT, false),
          get(PRODUCT_TOTAL_INVENTORIES_ENDPOINT, false),
          get(FXRATES_ENDPOINT, false)
        ]);

        setProductPrices(prices);
        setProductInventories(inventories);
        setFxRates(
          rates.map(rate => ({
            currency_from: rate.currency_from.code,
            currency_to: rate.currency_to.code,
            rate: parseFloat(rate.rate)
          }))
        );
      } catch (err) {
        console.error("Failed to fetch supporting data", err);
      }
    };
    fetchData();
  }, []);

  // Helper to convert prices
  const convertPrice = (price, from, to) => {
    if (!price) return "";
    if (from === to) return price;
    const fx = fxRates.find(
      r => r.currency_from === from && r.currency_to === to
    );
    return fx ? price * fx.rate : price;
  };

  // Enrich products with prices + inventories
  const enrichedProducts = useMemo(() => {
    return products.map(prod => {
      const priceObj = productPrices.find(p => p.product === prod.id);
      const inv = productInventories.find(i => i.product === prod.id);

      return {
        ...prod,
        price: priceObj?.price || "",
        currency: priceObj?.currency?.code || "",
        price_in_base_currency: priceObj
          ? convertPrice(priceObj.price, priceObj.currency?.code, baseCurrency)
          : "",
        base_currency: baseCurrency,
        inventory: inv?.total_inventory ?? 0
      };
    });
  }, [products, productPrices, productInventories, fxRates, baseCurrency]);

  const columns = [
    { field: "image", headerName: "Image", fieldType: "image" },
    { field: "name", headerName: "Product" },
    { field: "price", headerName: "Price" },
    { field: "currency", headerName: "Currency" },
    { field: "inventory", headerName: "Stock" },
    {
      field: "add_to_cart",
      headerName: "",
      fieldType: "link",
      cellRendererParams: {
        label: "Add to Cart",
        linkTo: row => `/admin-add-to-cart/${row.id}`,
        className: "btn btn-sm btn-success"
      }
    }
  ];

  return (
    <div className="container mt-4">
      <h2>Add Products for Customer</h2>
      <AdminSelectCustomer />
      {adminSelectedCustomer && (
        <div className="mb-3">
          <strong>Selected:</strong>{" "}
          {adminSelectedCustomer.user?.first_name}{" "}
          {adminSelectedCustomer.user?.last_name} (
          {adminSelectedCustomer.user?.email})
        </div>
      )}

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <DataTable
          data={enrichedProducts}
          columns={columns}
          hiddenColumns={["id"]}
          width_pct={100}
        />
      )}
    </div>
  );
};

export default AdminProductsForCustomer;