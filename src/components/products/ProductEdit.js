import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GenericEditData from "../GenericDataComponents/GenericEditData";

const ProductEdit = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [newProductName, setNewProductName] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [newProductPrice, setNewProductPrice] = useState(0);

  const [nonTargetProducts, setNonTargetProducts] = useState([]);
  const [targetProduct, setTargetProduct] = useState(null);

  useEffect(() => {
    const fetchAndSetTargetNonTargetProduct = async () => {
      console.log(
        `will set non target and target products based on productId ${productId}`
      );
      // extract the product with the productId
      const products = JSON.parse(localStorage.getItem("products"));
      const non_target_products = products.filter(
        (item) => item.id !== parseInt(productId)
      );
      console.log(
        `there are ${non_target_products.length} non target products`
      );
      await setNonTargetProducts(non_target_products);
      const target_products = products.filter(
        (item) => item.id === parseInt(productId)
      );
      console.log(`we found ${target_products.length} target products`);
      const product = target_products.length > 0 ? target_products[0] : null;
      await setTargetProduct(product);
      console.log(`product is ${product}, target product is ${targetProduct}`);
    };
    fetchAndSetTargetNonTargetProduct();
  }, [productId]);

  useEffect(() => {
    if (targetProduct) {
      console.log(
        `targetProduct is not null so will set new produt name ${targetProduct.name}`
      );
      setNewProductName(targetProduct.name);
      setNewProductCategory({
        value: targetProduct.category,
        label: targetProduct.category,
      });
      setNewProductPrice(targetProduct.price);
    } else {
      console.log("targetProduct is null");
    }
  }, [targetProduct]);

  const categories = ["Electronics", "Food", "Clothes"];
  const categorySelectOptions = categories.map((category) => {
    return { value: category, label: category };
  });

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

  const handleEdit = (e) => {
    e.preventDefault();
    nonTargetProducts.push({
      id: parseInt(productId),
      name: newProductName,
      category: newProductCategory.value,
      price: newProductPrice,
    });
    localStorage.setItem("products", JSON.stringify(nonTargetProducts));
    console.log(
      `finished editing product id ${productId} name ${newProductName}`
    );
    navigate("/products", {
      replace: true,
      state: { timestamp: new Date().getTime() },
    });
  };

  const handleDelete = () => {
    localStorage.setItem("products", JSON.stringify(nonTargetProducts));
    console.log(
      `finished deleting product id ${productId} name ${newProductName}`
    );
    navigate("/products", {
      replace: true,
      state: { timestamp: new Date().getTime() },
    });
  };

  return (
    <>
      <GenericEditData
        title={`Edit product id ${productId}`}
        formFields={formFields}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default ProductEdit;
