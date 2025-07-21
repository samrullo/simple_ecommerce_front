import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppContext from "../../AppContext";
import DataTable from "../GenericDataComponents/DataTable";
import { useApi } from "../hooks/useApi";
import {
  PRODUCTS_WITH_IMAGES_ENDPOINT,
  FXRATES_ENDPOINT,
} from "../ApiUtils/ApiEndpoints";
import AdminSelectCustomer from "./AdminSelectCustomer";

const AdminCartForCustomer = () => {
  const { customerId } = useParams();
  const { baseCurrency } = useContext(AppContext);
  const { get } = useApi();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [fxRates, setFxRates] = useState([]);

  useEffect(() => {
    const fetchFxRates = async () => {
      const data = await get(FXRATES_ENDPOINT, false);
      const simplified = data.map((rate) => ({
        currency_from: rate.currency_from.code,
        currency_to: rate.currency_to.code,
        rate: parseFloat(rate.rate),
      }));
      setFxRates(simplified);
    };
    fetchFxRates();
  }, []);

  const convertPrice = (price, from, to) => {
    if (from === to) return price;
    const fx = fxRates.find(
      (r) => r.currency_from === from && r.currency_to === to
    );
    return fx ? price * fx.rate : price;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await get(PRODUCTS_WITH_IMAGES_ENDPOINT, false);
        const imageBaseUrl =
          process.env.REACT_APP_IMAGE_BASE_URL || "http://localhost:8000";

        const formatted = data.map((product) => {
          const activePrice = product.price?.find((p) => p.end_date === null);
          const iconImage = product.icon_images?.[0]?.image;
          const image = iconImage ? `${imageBaseUrl}${iconImage}` : null;
          const inventory = product.inventory?.reduce((sum, inv) => sum + inv.stock, 0);
          const converted = convertPrice(
            activePrice.price,
            activePrice.currency.code,
            baseCurrency
          );

          return {
            ...product,
            name: product.name,
            price: activePrice.price,
            currency: activePrice.currency.code,
            price_in_base: converted,
            inventory,
            image,
            add_to_cart: "",
          };
        });

        setProducts(formatted);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, [baseCurrency, fxRates]);

  const columns = [
    { field: "image", headerName: "Image", fieldType: "image" },
    { field: "name", headerName: "Product" },
    { field: "price", headerName: "Price" },
    { field: "currency", headerName: "Currency" },
    { field: "inventory", headerName: "Stock" },
    {
      field: "add_to_cart",
      headerName: "",
      fieldType: "link",
      cellRendererParams: {
        label: "Add to Cart",
        linkTo: (row) => `/admin-add-to-cart/${customerId}/${row.id}`,
        className: "btn btn-sm btn-success",
      },
    },
  ];

  return (
    <div className="container mt-4">
      <h2>Add Products for Customer ID: {customerId}</h2>
      <AdminSelectCustomer/>
      <DataTable
        data={products}
        columns={columns}
        hiddenColumns={["id"]}
        width_pct={100}
      />
    </div>
  );
};

export default AdminCartForCustomer;
