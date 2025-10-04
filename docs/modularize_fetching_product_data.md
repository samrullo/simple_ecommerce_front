Perfect idea 👍 — you’re repeating the same “fetch products, prices, inventories, fx rates” logic in multiple places (`Product.js`, `AdminProductsForCustomer.js`, etc.), so pulling it out into a reusable module will simplify things a lot.

---

### ✅ Step 1: Create a utility module

Make a new file, e.g.:

`src/components/hooks/useProductData.js`

```js
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
```

---

### ✅ Step 2: Use it in `Product.js`

Replace your fetching logic with the hook:

```js
import { useProductData } from "../hooks/useProductData";

// inside component:
const { products, productPrices, productInventories, fxRates, loading, convertPrice } =
  useProductData(baseCurrency, [timestamp]);

// then use enrichedProducts as before
const enrichedProducts = useMemo(() => {
  return products.map((prod) => {
    const priceObj = productPrices.find((p) => p.product === prod.id);
    const inv = productInventories.find((i) => i.product === prod.id);

    return {
      ...prod,
      price: priceObj?.price || "",
      currency: priceObj?.currency?.code || "",
      price_in_base_currency: priceObj
        ? convertPrice(priceObj.price, priceObj.currency?.code, baseCurrency)
        : "",
      base_currency: baseCurrency,
      inventory: inv?.total_inventory ?? 0,
    };
  });
}, [products, productPrices, productInventories, fxRates, baseCurrency]);
```

Now all your fetch logic is isolated and reusable.

---

### ✅ Step 3: Reuse in other components

For example, in `AdminProductsForCustomer.js`, you can import:

```js
import { useProductData } from "../hooks/useProductData";

const { products, productPrices, productInventories, fxRates, loading, convertPrice } =
  useProductData(baseCurrency, []);
```

---

🚀 Now you have one central place (`useProductData.js`) that fetches products, prices, inventories, and FX rates — reusable anywhere.

---

Do you want me to also patch **AdminProductsForCustomer.js** with this refactor so you can see it in action in a second component?
