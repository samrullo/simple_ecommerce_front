import { useEffect, useState } from "react";
import {
  PRODUCTS_WITH_ICON_IMAGE_ENDPOINT,
  ACTIVE_PRODUCT_PRICES_ENDPOINT,
  PRODUCT_TOTAL_INVENTORIES_ENDPOINT,
  ACTIVE_FXRATES_ENDPOINT,
} from "../ApiUtils/ApiEndpoints";
import { useApi } from "./useApi";

// Hook to fetch products with prices, inventories, fx
export const useProductData = (baseCurrency, deps = []) => {
  const { get } = useApi();

  const [products, setProducts] = useState([]);
  const [productPrices, setProductPrices] = useState([]);
  const [productInventories, setProductInventories] = useState([]);
  const [fxRates, setFxRates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products with icon image
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await get(PRODUCTS_WITH_ICON_IMAGE_ENDPOINT, false);
        setProducts(
          data.map((product) => ({
            ...product,
            category: product.category?.name || "",
            brand: product.brand?.name || "",
            tags: product.tags?.map((tag) => tag.name).join(", ") || "",
            image: product.icon_image?.image || null,
            // placeholders
            price: "",
            currency: "",
            price_in_base_currency: "",
            inventory: "",
            base_currency: baseCurrency,
            product_id: product.id,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, deps); // re-run when deps change

  // Fetch supporting data (prices, inventories, fx)
  useEffect(() => {
    const fetchSupportData = async () => {
      try {
        const [prices, inventories, rates] = await Promise.all([
          get(ACTIVE_PRODUCT_PRICES_ENDPOINT, false),
          get(PRODUCT_TOTAL_INVENTORIES_ENDPOINT, false),
          get(ACTIVE_FXRATES_ENDPOINT, false),
        ]);
        setProductPrices(prices);
        setProductInventories(inventories);
        setFxRates(
          rates.map((rate) => ({
            currency_from: rate.currency_from.code,
            currency_to: rate.currency_to.code,
            rate: parseFloat(rate.rate),
          }))
        );
      } catch (err) {
        console.error("Failed to fetch product support data:", err);
        setProductPrices([]);
        setProductInventories([]);
        setFxRates([]);
      }
    };
    fetchSupportData();
  }, deps);

  // Helper for price conversion
  const convertPrice = (price, from, to) => {
    if (!price) return "";
    if (from === to) return price;
    const fx = fxRates.find(
      (r) => r.currency_from === from && r.currency_to === to
    );
    return fx ? price * fx.rate : price;
  };

  return {
    products,
    productPrices,
    productInventories,
    fxRates,
    loading,
    convertPrice,
  };
};
