import React from "react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Product = () => {
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

    if (localStorage.getItem("products") !== undefined) {
      console.log(`will set products from local storage`);
      const productsInStorage = JSON.parse(localStorage.getItem("products"));
      setProducts(productsInStorage);
    } else {
      console.log(`will set product from json file`);
      getProducts();
    }
  }, [timestamp]);

  return (
    <>
      <h1>Products</h1>
      <Link className="btn btn-primary" to="/products/new">
        New
      </Link>
      <Outlet />
      {products.map((product) => {
        return (
          <p key={product.id}>
            {product.name} {product.category} {product.price}
          </p>
        );
      })}
    </>
  );
};

export default Product;
