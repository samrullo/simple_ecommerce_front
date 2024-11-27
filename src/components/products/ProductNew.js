import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GenericNewData from "../GenericDataComponents/GenericNewData";

const ProductNew = () => {
  const navigate = useNavigate();
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [newProductPrice, setNewProductPrice] = useState(0);

  const categories = ["Electronics", "Food", "Clothes"];
  const categorySelectOptions = categories.map((category) => {
    return { value: category, label: category };
  });

  const handleNewData = (e) => {
    e.preventDefault();
    const products = JSON.parse(localStorage.getItem("products"));
    products.push({
      id: products.length,
      name: newProductName,
      category: newProductCategory.value,
      price: newProductPrice,
    });

    localStorage.setItem("products", JSON.stringify(products));
    navigate("/products", {
      replace: true,
      state: { timestamp: new Date().getTime() },
    });
  };

  const formFields = [
    {
      fieldType: "text",
      fieldLabel: "Name",
      fieldValue: newProductName,
      setFieldValue: setNewProductName,
    },
    {
      fieldType: "select",
      fieldLabel: "Category",
      fieldValue: newProductCategory,
      setFieldValue: setNewProductCategory,
      selectOptions: categorySelectOptions,
    },
    {
      fieldType: "number",
      fieldLabel: "Price",
      fieldValue: newProductPrice,
      setFieldValue: setNewProductPrice,
    },
  ];

  return (
    <div>
      <GenericNewData
        title="New Product"
        formFields={formFields}
        handleNewData={handleNewData}
      />
    </div>
  );
};

export default ProductNew;
