You can add a **loading animation** (e.g., spinner or animated dots) while your app is fetching products by introducing a `loading` state in your component.

Here’s how to do it:

---

## ✅ 1. Add a `loading` state

Just above `useEffect`:

```jsx
const [loading, setLoading] = useState(true);
```

---

## ✅ 2. Update `getProducts` useEffect

Modify your `getProducts` function:

```jsx
useEffect(() => {
  const getProducts = async () => {
    try {
      setLoading(true); // start loading
      const data = await get(PRODUCTS_WITH_IMAGES_ENDPOINT, false);
      const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL || "http://localhost:8000";

      setProducts(
        data.map((product) => {
          const activePrice = product.price?.find((p) => p.end_date === null);
          const activeInventory = product.inventory?.reduce((total, inv) => total + inv.stock, 0) || 0;
          const imagePath = product.icon_images?.[0]?.image;
          const image = imagePath ? `${imagePath}` : null;

          const base = baseCurrency;
          const converted = convertPrice(activePrice.price, activePrice.currency.code, base);

          return {
            ...product,
            category: product.category?.name || "",
            brand: product.brand?.name || "",
            tags: product.tags?.map((tag) => tag.name).join(", ") || "",
            price: activePrice?.price || "",
            currency: activePrice?.currency?.code || "",
            price_in_base_currency: converted,
            base_currency: base,
            inventory: activeInventory || "",
            image: image,
            add_to_cart: "",
            product_id: product.id,
          };
        })
      );
    } catch (error) {
      console.log(`Error while fetching products: ${error}`);
    } finally {
      setLoading(false); // stop loading regardless of success/failure
    }
  };

  getProducts();
}, [timestamp, baseCurrency, fxRates]);
```

---

## ✅ 3. Add a simple spinner animation

Add this just before the table render:

```jsx
{loading ? (
  <div className="text-center mt-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
) : products.length === 0 ? (
  <p>No products available</p>
) : (
  <DataTable
    data={products}
    columns={columns}
    hiddenColumns={["id"]}
    width_pct={100}
    onRowClick={handleRowClick}
  />
)}
```

> ✅ `spinner-border` is a built-in Bootstrap spinner. You’re already using Bootstrap styles (`btn`, `form-switch`, etc.), so this will work out-of-the-box.

---

## ✅ Final Notes

* You now show a **spinner** while loading.
* Show “No products available” only when loading is complete and no products are returned.

Let me know if you want a **custom animation** (like animated dots or SVG loaders) instead of Bootstrap’s spinner.
