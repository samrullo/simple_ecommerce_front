// Product.js
import React, { useEffect, useState, useContext, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import DataTable from "../GenericDataComponents/DataTable";
import { Spinner } from "../util_components/Spinner";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { useProductData } from "../hooks/useProductData";

const Product = () => {
  const { userInfo, baseCurrency } = useContext(AppContext);
  const navigate = useNavigate();
  const { state = {} } = useLocation();
  const { timestamp } = state ?? {};

  
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [detailedView, setDetailedView] = useState(false);
  

  const { products, productPrices, productInventories, fxRates, loading, convertPrice } =
  useProductData(baseCurrency, [timestamp]);
  
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
  
  // Handle edit mode navigation
  useEffect(() => {
    if (editMode && selectedRowData && (userInfo?.is_staff || userInfo?.is_superuser)) {
      navigate(`/products/edit/${selectedRowData.id}`);
      setSelectedRowData(null);
    }
  }, [selectedRowData, editMode, userInfo, navigate]);

  const handleRowClick = event => {
    if (editMode && (userInfo?.is_staff || userInfo?.is_superuser)) {
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
        linkTo: row => `/add-product-to-cart/${row.id}`,
        className: "btn btn-sm btn-success"
      }
    },
    {
      field: "view_detail",
      headerName: "",
      fieldType: "link",
      cellRendererParams: {
        label: "View Details",
        linkTo: row => `/products/detail/${row.id}`,
        className: "btn btn-sm btn-info"
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
    { field: "is_active", headerName: "Active" },
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

      {userInfo?.is_staff && (
        <>
          <div className="mb-3">
            <Link className="btn btn-primary me-2" to="/products/new">New Product</Link>
            <Link className="btn btn-primary" to="/product-create-update-from-csv">Products From CSV file</Link>
          </div>

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
        </>
      )}

      <Outlet />

      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <DataTable
          data={enrichedProducts}
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