import React from "react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import DataTable from "../DataTable";

const Product = () => {
  const navigate = useNavigate();
  let { state = {} } = useLocation();
  let { timestamp } = state ?? {};
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetch("data/products.json");
      const data = await response.json();
      await setProducts(data);
      localStorage.setItem("products", JSON.stringify(products));
    };

    if (localStorage.getItem("products") !== undefined && localStorage.getItem("products") !== null) {
      console.log(`will set products from local storage`);
      const productsInStorage = JSON.parse(localStorage.getItem("products"));
      setProducts(productsInStorage);
    } else {
      console.log(`will set product from json file`);
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
      {products==null || products.length === 0 ? (
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
