import React from "react";
import { useEffect, useState, useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import DataTable from "../DataTable";
import AppContext from "../../AppContext";

const Product = () => {
  const navigate = useNavigate();
  let { state = {} } = useLocation();
  let { timestamp } = state ?? {};
  const [products, setProducts] = useState([]);
  const { isAuthenticated } = useContext(AppContext);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          "http://localhost:8000/api/v1/api/product/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        const results = await data["results"];        

        setProducts(results);
        console.log(`data is ${data}, results is ${results}`);
        console.log(`products data is ${products}`);
      } catch (error) {
        console.log(`Error while fetching products ${error}`);
      }
    };
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      getProducts();
    }
  }, [timestamp]);

  const [selectedRowData, setSelectedRowData] = useState(null);

  useEffect(() => {
    if (selectedRowData) {
      navigate(`/products/edit/${selectedRowData.id}`);
    }
  }, [selectedRowData]);

  const handleRowClick = (event) => {
    setSelectedRowData(event.data);
  };

  return (
    <>
      <h1>Products</h1>
      <Link className="btn btn-primary" to="/products/new">
        New
      </Link>
      <Outlet />
      {products == null || products.length === 0 ? (
        <p>No products defined yet</p>
      ) : (
        <DataTable
          data={products}
          hiddenColumns={["id"]}
          width_pct={100}
          onRowClick={handleRowClick}
        />
      )}
    </>
  );
};

export default Product;
