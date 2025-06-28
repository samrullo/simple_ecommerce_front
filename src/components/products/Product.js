import React, { useEffect, useState, useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import DataTable from "../GenericDataComponents/DataTable";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { PRODUCTS_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const Product = () => {
  const { get } = useApi();
  const navigate = useNavigate();
  const { state = {} } = useLocation();
  const { timestamp } = state ?? {};
  const [products, setProducts] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const { userInfo } = useContext(AppContext);
  const isStaff = userInfo?.is_staff || userInfo?.is_superuser;

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await get(PRODUCTS_ENDPOINT, false);
        setProducts(
          data.map((product) => {
            const activePrice = product.price?.find((p) => p.end_date === null);
            const activeInventory = product.inventory?.reduce((total, inv) => total + inv.stock, 0) || 0;

            return {
              ...product,
              category: product.category?.name || "",
              brand: product.brand?.name || "",
              tags: product.tags?.map((tag) => tag.name).join(", ") || "",
              price: activePrice?.price || "",
              currency: activePrice?.currency?.code || "",
              inventory: activeInventory || "",
            };
          })
        );
      } catch (error) {
        console.log(`Error while fetching products: ${error}`);
      }
    };

    getProducts();
  }, [timestamp]);

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
    { field: "name", headerName: "Product Name" },
    { field: "sku", headerName: "SKU" },
    { field: "category", headerName: "Category" },
    { field: "brand", headerName: "Brand" },
    { field: "tags", headerName: "Tags" },
    { field: "price", headerName: "Price" },
    { field: "currency", headerName: "Currency" },
    { field: "inventory", headerName: "Stock" },

  ];

  const columns = isStaff
    ? [...baseColumns,
    { field: "created_at", headerName: "Created At", fieldType: "datetime" },
    { field: "updated_at", headerName: "Updated At", fieldType: "datetime" },
    { field: "is_active", headerName: "Active", fieldType: "datetime" }
    ]
    : baseColumns;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Products</h1>
        {isStaff && (
          <div className="form-check form-switch">
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
      </div>

      {isStaff && (<div>
        <Link className="btn btn-primary" to="/products/new">New Product</Link>
        <Link className="btn btn-primary" style={{ marginLeft: "1em" }} to="/product-create-update-from-csv">Products From CSV file</Link>
      </div>
      )}

      <Outlet />

      {products.length === 0 ? (
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