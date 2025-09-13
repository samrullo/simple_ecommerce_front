import React, { useEffect, useState, useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import DataTable from "../GenericDataComponents/DataTable";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { PRODUCTS_WITH_IMAGES_ENDPOINT, FXRATES_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const Product = () => {
  const { userInfo, baseCurrency, setBaseCurrency } = useContext(AppContext);
  const { get } = useApi();
  const navigate = useNavigate();
  const { state = {} } = useLocation();
  const { timestamp } = state ?? {};
  const [products, setProducts] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [fxRates, setFxRates] = useState([]);
  const [detailedView, setDetailedView] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFxRates = async () => {
      const rates = await get(FXRATES_ENDPOINT, false);
      const simplified = rates.map(rate => ({
        currency_from: rate.currency_from.code,
        currency_to: rate.currency_to.code,
        rate: parseFloat(rate.rate)
      }));
      setFxRates(simplified);
    };
    fetchFxRates();
  }, []);

  const convertPrice = (price, from, to) => {
    if (from === to) return price;
    const fx = fxRates.find(fx => fx.currency_from === from && fx.currency_to === to);
    return fx ? price * fx.rate : price;
  };

  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true); // start loading
        const data = await get(PRODUCTS_WITH_IMAGES_ENDPOINT, false);

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
              product_id: product.id
            };
          })
        );
      } catch (error) {
        console.log(`Error while fetching products: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [timestamp, baseCurrency, fxRates]);

  useEffect(() => {
    if (editMode && selectedRowData && isStaff) {
      navigate(`/products/edit/${selectedRowData.id}`);
      setSelectedRowData(null);
    }
  }, [selectedRowData, editMode, isStaff, navigate]);

  const handleRowClick = (event) => {
    if (editMode && isStaff) {
      setSelectedRowData(event.data);
    }
  };

  const baseColumns = [
    { field: "image", headerName: "Image", fieldType: "image" },
    { field: "name", headerName: "Product Name", tooltipField: "name" },
    { field: "category", headerName: "Category" },
    { field: "price", headerName: "Price" },
    { field: "currency", headerName: "Currency" },
    { field: "inventory", headerName: "Stock" },
    {
      field: "add_to_cart",
      headerName: "",
      fieldType: "link",
      cellRendererParams: {
        label: "Add To Cart",
        linkTo: (row) => `/add-product-to-cart/${row.id}`,
        className: "btn btn-sm btn-success"
      }
    }
  ];

  const extraColumns = [
    { field: "sku", headerName: "SKU" },
    { field: "brand", headerName: "Brand" },
    { field: "tags", headerName: "Tags" },
    { field: "price_in_base_currency", headerName: "Price in Base Currency" },
    { field: "base_currency", headerName: "Base Currency" },
    { field: "created_at", headerName: "Created At", fieldType: "datetime" },
    { field: "updated_at", headerName: "Updated At", fieldType: "datetime" },
    { field: "is_active", headerName: "Active", fieldType: "datetime" },
    { field: "product_id", headerName: "Product Id", fieldType: "text" }
  ];

  const columns = detailedView ? [...baseColumns, ...extraColumns] : baseColumns;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Products</h1>
        <div className="form-check form-switch">
          <input
            type="checkbox"
            className="form-check-input"
            id="detailedViewSwitch"
            checked={detailedView}
            onChange={() => setDetailedView(!detailedView)}
          />
          <label className="form-check-label" htmlFor="detailedViewSwitch">
            Detailed View
          </label>
        </div>
      </div>

      {isStaff && (
        <div className="mb-3">
          <Link className="btn btn-primary me-2" to="/products/new">New Product</Link>
          <Link className="btn btn-primary" to="/product-create-update-from-csv">Products From CSV file</Link>
        </div>
      )}

      {isStaff && (
        <div className="form-check form-switch mb-2">
          <input
            type="checkbox"
            className="form-check-input"
            id="editModeSwitch"
            checked={editMode}
            onChange={() => setEditMode(!editMode)}
          />
          <label className="form-check-label" htmlFor="editModeSwitch">
            Edit Mode
          </label>
        </div>
      )}

      <Outlet />

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
    </div>
  );
};

export default Product;
