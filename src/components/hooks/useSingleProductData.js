import { useEffect, useState } from "react";
import {
  PRODUCTS_WITH_ICON_IMAGE_ENDPOINT,
  ACTIVE_PRODUCT_PRICES_ENDPOINT,
  PRODUCT_TOTAL_INVENTORIES_ENDPOINT,
  ACTIVE_FXRATES_ENDPOINT,
  PRODUCT_IMAGES_ENDPOINT,
} from "../ApiUtils/ApiEndpoints";
import { useApi } from "./useApi";

// Hook to fetch a single product with prices, inventories, fx, images
export const useSingleProductData = (productId, baseCurrency, deps = []) => {
  const { get } = useApi();

  const [product, setProduct] = useState(null);
  const [productPrice, setProductPrice] = useState(null);
  const [productInventory, setProductInventory] = useState(null);
  const [fxRates, setFxRates] = useState([]);
  const [productImages, setProductImages] = useState([]);   // 👈 new state
  const [loading, setLoading] = useState(true);

  // Fetch single product with icon image
  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await get(
          `${PRODUCTS_WITH_ICON_IMAGE_ENDPOINT}?product_id=${productId}`,
          false
        );
        if (Array.isArray(data) && data.length > 0) {
          const p = data[0];
          setProduct({
            ...p,
            category: p.category?.name || "",
            brand: p.brand?.name || "",
            tags: p.tags?.map((tag) => tag.name).join(", ") || "",
            image: p.icon_image?.image || null,
            price: "",
            currency: "",
            price_in_base_currency: "",
            inventory: "",
            base_currency: baseCurrency,
            product_id: p.id,
          });
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, ...deps]);

  // Fetch supporting data (active price, inventory, fx, images)
  useEffect(() => {
    if (!productId) return;
    const fetchSupportData = async () => {
      try {
        const [prices, inventories, rates, images] = await Promise.all([
          get(`${ACTIVE_PRODUCT_PRICES_ENDPOINT}?product_id=${productId}`, false),
          get(`${PRODUCT_TOTAL_INVENTORIES_ENDPOINT}?product_id=${productId}`, false),
          get(ACTIVE_FXRATES_ENDPOINT, false),
          get(`${PRODUCT_IMAGES_ENDPOINT}?product_id=${productId}`, false),
        ]);

        setProductPrice(prices?.[0] || null);
        setProductInventory(inventories?.[0] || null);
        setFxRates(
          rates.map((rate) => ({
            currency_from: rate.currency_from.code,
            currency_to: rate.currency_to.code,
            rate: parseFloat(rate.rate),
          }))
        );
        setProductImages(Array.isArray(images) ? images : []); // 👈 set images
      } catch (err) {
        console.error("Failed to fetch product support data:", err);
        setProductPrice(null);
        setProductInventory(null);
        setFxRates([]);
        setProductImages([]);
      }
    };
    fetchSupportData();
  }, [productId, ...deps]);

  // Helper for price conversion
  const convertPrice = (price, from, to) => {
    if (!price) return "";
    if (from === to) return price;
    const fx = fxRates.find(
      (r) => r.currency_from === from && r.currency_to === to
    );
    return fx ? price * fx.rate : price;
  };

  // Enriched single product with price and inventory
  const enrichedProduct = product
    ? {
        ...product,
        price: productPrice?.price || "",
        currency: productPrice?.currency?.code || "",
        price_in_base_currency: productPrice
          ? convertPrice(productPrice.price, productPrice.currency?.code, baseCurrency)
          : "",
        inventory: productInventory?.total_inventory ?? 0,
        images: productImages,   // 👈 include all images
      }
    : null;

  return {
    product: enrichedProduct,
    productPrice,
    productInventory,
    productImages,   // 👈 also return raw images
    fxRates,
    loading,
    convertPrice,
  };
};
