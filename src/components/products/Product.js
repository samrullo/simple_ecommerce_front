import React from "react";
import { useEffect, useState, useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import DataTable from "../GenericDataComponents/DataTable";
import AppContext from "../../AppContext";
import { fetchResource } from "../ApiUtils/fetch_data";
import { PRODUCTS_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const Product = () => {
  const navigate = useNavigate();
  let { state = {} } = useLocation();
  let { timestamp } = state ?? {};
  const [products, setProducts] = useState([]);
  const { isAuthenticated } = useContext(AppContext);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchResource(PRODUCTS_ENDPOINT, "products");

        setProducts(
          data.map((product) => {
            return {
              ...product,
              category: product.category.name,
              brand: product.brand.name,
              tags: product.tags.map((tag) => tag.name).join(","),
            };
          })
        );
        console.log(`data is ${JSON.stringify(data)}`);
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
