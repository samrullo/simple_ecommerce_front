// src/components/admin_orders/AdminProductsForCustomer.js
import React, { useEffect, useState, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";
import AppContext from "../../AppContext";
import DataTable from "../GenericDataComponents/DataTable";
import { useProductData } from "../hooks/useProductData";
import AdminSelectCustomer from "./AdminSelectCustomer";

const AdminProductsForCustomer = () => {
  const { baseCurrency, adminSelectedCustomer } = useContext(AppContext);
  const { state = {} } = useLocation();
  const { timestamp } = state ?? {};

  const { products, productPrices, productInventories, fxRates, loading, convertPrice } =
    useProductData(baseCurrency, [timestamp]);

  // Enrich products with prices + inventories
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
        linkTo: row => `/admin-add-to-cart/${row.id}`,
        className: "btn btn-sm btn-success"
      }
    }
  ];

  return (
    <div className="container mt-4">
      <h2>Add Products for Customer</h2>
      <AdminSelectCustomer />
      {adminSelectedCustomer && (
        <div className="mb-3">
          <strong>Selected:</strong>{" "}
          {adminSelectedCustomer.user?.first_name}{" "}
          {adminSelectedCustomer.user?.last_name} (
          {adminSelectedCustomer.user?.email})
        </div>
      )}

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : (
        <DataTable
          data={enrichedProducts}
          columns={columns}
          hiddenColumns={["id"]}
          width_pct={100}
        />
      )}
    </div>
  );
};

export default AdminProductsForCustomer;