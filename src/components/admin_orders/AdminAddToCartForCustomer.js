import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { PRODUCTS_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const AdminAddToCartForCustomer = () => {
  const { productId } = useParams();
  const { adminSelectedCustomer } = useContext(AppContext);
  const customerId = adminSelectedCustomer?.id;
  const { get } = useApi();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      try {
        const data = await get(`${PRODUCTS_ENDPOINT}${productId}/`, false);
        const iconImageObj = data.images?.find((img) => img.tag === "icon");
        const imageUrl = iconImageObj ? iconImageObj.image : "";
        setProduct({ ...data, image: imageUrl });
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [productId, get]);

  const handleAddToCart = () => {
    if (!customerId) {
      alert("No customer selected.");
      return;
    }

    const cartKey = `admin_cart_${customerId}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingItemIndex = cart.findIndex((item) => item.id === product.id);
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += Number(quantity);
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price?.[0]?.price,
        currency: product.price?.[0]?.currency?.code,
        image: product.image,
        quantity: Number(quantity),
      });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    navigate("/admin-shopping-cart");
  };

  if (!adminSelectedCustomer) {
    return <p>Please select a customer first.</p>;
  }

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>
        Add Product to Cart for {adminSelectedCustomer?.first_name}{" "}
        {adminSelectedCustomer?.last_name} (
        {adminSelectedCustomer?.email})
      </h2>
      <div className="card p-3">
        <div className="d-flex align-items-center">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                marginRight: "1rem",
              }}
            />
          )}
          <div>
            <h5>{product.name}</h5>
            <p>{product.description}</p>
            <p>
              <strong>
                {product.price?.[0]?.price}{" "}
                {product.price?.[0]?.currency?.code}
              </strong>
            </p>
          </div>
        </div>

        <div className="mt-3">
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min={1}
            className="form-control"
            style={{ maxWidth: "100px" }}
          />
        </div>

        <button onClick={handleAddToCart} className="btn btn-primary mt-3">
          Add
        </button>
      </div>
    </div>
  );
};

export default AdminAddToCartForCustomer;