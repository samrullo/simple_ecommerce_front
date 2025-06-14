import React, { useEffect, useState, useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import DataTable from "../GenericDataComponents/DataTable";
import AppContext from "../../AppContext";
import { fetchResource } from "../ApiUtils/fetch_data";
import { PRODUCTS_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import { useApi } from "../hooks/useApi";

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
            const activeInventory = product.inventory?.[0]; // first inventory entry for now

            return {

              ...product,
              category: product.category?.name || "",
              brand: product.brand?.name || "",
              tags: product.tags?.map((tag) => tag.name).join(", ") || "",
              price: activePrice?.price || "",
              inventory: activeInventory?.stock || ""
            }
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

      {isStaff && (
        <Link className="btn btn-primary my-3" to="/products/new">
          New Product
        </Link>
      )}

      <Outlet />

      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <DataTable
          data={products}
          hiddenColumns={["id"]}
          width_pct={100}
          onRowClick={handleRowClick}
        />
      )}
    </div>
  );
};

export default Product;
