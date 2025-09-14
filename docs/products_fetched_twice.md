Great, thanks for sharing your `Product` component — I can see why your API is still being called **twice** even though you removed `StrictMode`.

---

## 🔎 Why it’s fetching twice

Look at this effect:

```js
useEffect(() => {
  const getProducts = async () => {
    try {
      setLoading(true);
      const data = await get(PRODUCTS_WITH_IMAGES_ENDPOINT, false);
      ...
      setProducts(...);
    } finally {
      setLoading(false);
    }
  };

  getProducts();
}, [timestamp, baseCurrency, fxRates]);
```

* **Dependencies:**

  * `timestamp` → comes from `useLocation().state`. If you navigated here with a `timestamp` param, the effect will re-run.
  * `baseCurrency` → when you change currency, it will re-run (expected).
  * **`fxRates` → This is the issue.**

---

## 🔥 Root cause

* On initial mount:

  1. `fxRates` is `[]` (empty array).
  2. `getProducts()` runs once (fetch #1).
  3. Then your other effect fetches FX rates:

     ```js
     useEffect(() => {
       const fetchFxRates = async () => {
         const rates = await get(FXRATES_ENDPOINT, false);
         setFxRates(simplified);
       };
       fetchFxRates();
     }, []);
     ```

     → This updates `fxRates`.
  4. Because `fxRates` is in the **dependency array** of the products effect, it **triggers getProducts again** (fetch #2).

So: one fetch before FX rates are loaded, and one fetch after.

---

## ✅ Fix options

### Option 1: Only fetch products *after* fxRates are ready

You can skip the first fetch until fxRates is populated:

```js
useEffect(() => {
  if (fxRates.length === 0) return; // don’t run until rates are loaded

  const getProducts = async () => {
    ...
  };

  getProducts();
}, [timestamp, baseCurrency, fxRates]);
```

Now you’ll only fetch once after FX rates are available.

---

### Option 2: Separate concerns

Fetch products first (raw data), then enrich with FX rates in another `useEffect`:

```js
// First: just fetch products
useEffect(() => {
  const getProducts = async () => {
    const data = await get(PRODUCTS_WITH_IMAGES_ENDPOINT, false);
    setProducts(data);
  };
  getProducts();
}, [timestamp]);

// Second: when fxRates or baseCurrency change, recalc converted prices
useEffect(() => {
  if (products.length === 0 || fxRates.length === 0) return;

  const recalculated = products.map(product => {
    const activePrice = product.price?.find(p => p.end_date === null);
    ...
    const converted = convertPrice(activePrice.price, activePrice.currency.code, baseCurrency);
    return { ...product, price_in_base_currency: converted };
  });

  setProducts(recalculated);
}, [products, baseCurrency, fxRates]);
```

This way your **products API is called only once**, and recalculations happen locally when rates/currency change.

---

### Option 3: Fetch FX and products in parallel

You could even combine them in a single effect:

```js
useEffect(() => {
  const fetchData = async () => {
    const [rates, products] = await Promise.all([
      get(FXRATES_ENDPOINT, false),
      get(PRODUCTS_WITH_IMAGES_ENDPOINT, false),
    ]);
    setFxRates(...);
    setProducts(...);
  };
  fetchData();
}, [timestamp, baseCurrency]);
```

---

## 🎯 Recommendation

If your **products depend on fxRates for display**, go with **Option 1** (skip fetch until fxRates are loaded).
If you want **faster UI** and don’t mind showing raw product prices before FX conversion, use **Option 2**.

---

Do you want me to rewrite your `Product` component with **Option 1 applied** so your `/products-with-images/` is only fetched once?
