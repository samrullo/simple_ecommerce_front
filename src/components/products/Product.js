// Product.js
import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import DataTable from "../GenericDataComponents/DataTable";
import { Spinner } from "../util_components/Spinner";
import ToggleSwitch from "../util_components/ToggleSwitch";
import AppContext from "../../AppContext";
import { useProductData } from "../hooks/useProductData";
import { useAllProductPages } from "../hooks/useAllProductPages";

const Product = () => {
  const { userInfo, baseCurrency } = useContext(AppContext);
  const navigate = useNavigate();
  const { state = {} } = useLocation();
  const { timestamp } = state ?? {};


  const [displayProducts, setDisplayProducts] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [detailedView, setDetailedView] = useState(false);

  const {
    products,
    productPrices,
    productInventories,
    fxRates,
    loading,
    convertPrice,
    productPageInfo
  } = useProductData(baseCurrency, [timestamp]);

  const { allProducts, isComplete: hasAllProducts } = useAllProductPages(
    products,
    productPageInfo,
    baseCurrency,
    [timestamp]
  );

  const enrichProducts = useCallback((items) => {
    return items.map(prod => {
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
  }, [productPrices, productInventories, baseCurrency]);

  const initialEnriched = useMemo(() => enrichProducts(products), [enrichProducts, products]);
  const fullEnriched = useMemo(() => enrichProducts(allProducts), [enrichProducts, allProducts]);

  useEffect(() => {
    if (!hasAllProducts) {
      setDisplayProducts(initialEnriched);
    }
  }, [initialEnriched, hasAllProducts]);

  useEffect(() => {
    if (hasAllProducts) {
      setDisplayProducts(fullEnriched);
    }
  }, [fullEnriched, hasAllProducts]);

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

  var baseColumns = [
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

  const purchaseColumns = [{
    field: "purchase",
    headerName: "",
    fieldType: "link",
    cellRendererParams: {
      label: "Admin Purchase",
      linkTo: row => `/purchases/new/${row.id}`,
      className: "btn btn-sm btn-info"
    }
  }]
  
  baseColumns = userInfo?.is_staff ? [...baseColumns, ...purchaseColumns] : baseColumns

  const columns = detailedView ? [...baseColumns, ...extraColumns] : baseColumns;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Products</h1>
        <ToggleSwitch id="detailView" label="Detailed View" checked={detailedView} onChange={() => setDetailedView(!detailedView)} />
      </div>

      {userInfo?.is_staff && (
        <>
          <div className="mb-3">
            <Link className="btn btn-primary me-2" to="/products/new">New Product</Link>
            <Link className="btn btn-primary" to="/product-create-update-from-csv">Products From CSV file</Link>
          </div>
          <ToggleSwitch
            id="editModeSwitch"
            label="Edit Mode"
            checked={editMode}
            onChange={() => setEditMode(!editMode)} />
        </>
      )}

      <Outlet />

      {loading ? (
        <Spinner />
      ) : displayProducts.length === 0 ? (
        <p>No products available</p>
      ) : (
        <DataTable
          data={displayProducts}
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
