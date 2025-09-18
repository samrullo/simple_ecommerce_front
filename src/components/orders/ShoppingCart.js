import React, { useEffect, useState, useContext } from "react";
import { useNavigate,Link } from "react-router-dom";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { FXRATES_ENDPOINT,CREATE_ORDER_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const ShoppingCart = () => {
  const { baseCurrency,flashMessages,setFlashMessages } = useContext(AppContext);
  const { get, post } = useApi();

  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [submitting, setSubmitting] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const [fxRates, setFxRates] = useState([]);

  // Load cart and fetch fx rates
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("shopping_cart")) || [];
    setCartItems(storedCart);

    const fetchFxRates = async () => {
      try {
        const data = await get(FXRATES_ENDPOINT, false);
        const simplified = data.map((rate) => ({
          currency_from: rate.currency_from.code,
          currency_to: rate.currency_to.code,
          rate: parseFloat(rate.rate),
        }));
        setFxRates(simplified);
      } catch (err) {
        console.error("Failed to fetch FX rates", err);
      }
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

  const updateQuantity = (index, newQty) => {
    const updated = [...cartItems];
    updated[index].quantity = newQty;
    setCartItems(updated);
    localStorage.setItem("shopping_cart", JSON.stringify(updated));
  };

  const removeItem = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
    localStorage.setItem("shopping_cart", JSON.stringify(updated));
  };

  const subtotalInBaseCurrency = (item) =>
    convertPrice(item.price, item.currency, baseCurrency) * item.quantity;

  const total = cartItems.reduce(
    (sum, item) => sum + subtotalInBaseCurrency(item),
    0
  );

  const handleBuy = async () => {
    if (cartItems.length === 0) return;
  
    const payload = {
      payment_method: paymentMethod,
      base_currency:baseCurrency,
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };
  
    try {
      setSubmitting(true);
      const response = await post(CREATE_ORDER_ENDPOINT, payload, true);
      console.log(`response from creating order is ${JSON.stringify(response)}`)
      const orderId = response.order_id;
  
      localStorage.removeItem("shopping_cart");
      setCartItems([]);
  
      setFlashMessages([{ category: "success", message: "Order created successfully!" }]);
      navigate(`/order-summary/${orderId}`);
    } catch (error) {
      console.error("Failed to create order:", error);
      setFlashMessages([{ category: "danger", message: "Failed to create order. Try again." }]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Subtotal ({baseCurrency})</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={item.id}>
                <td>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  )}
                </td>
                <td>{item.name}</td>
                <td>
                  {item.price.toLocaleString()} {item.currency}
                </td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    onChange={(e) =>
                      updateQuantity(index, parseInt(e.target.value, 10) || 1)
                    }
                    className="form-control"
                    style={{ width: "80px" }}
                  />
                </td>
                <td>
                  {subtotalInBaseCurrency(item).toLocaleString()} {baseCurrency}
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="4" className="text-end fw-bold">
                Total:
              </td>
              <td colSpan="2" className="fw-bold">
                {total.toLocaleString()} {baseCurrency}
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <div className="mt-4 d-flex align-items-center gap-3">
        <label htmlFor="paymentMethod" className="form-label fw-bold mb-0">Payment Method:</label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="form-select"
          style={{ maxWidth: "300px" }}
        >
          <option value="cash_on_delivery">Cash on Delivery</option>
          <option value="credit_card">Credit Card</option>
          {/* Add more if needed */}
        </select>

        <button
          className="btn btn-success"
          onClick={handleBuy}
          disabled={submitting}
        >
          {submitting ? "Processing..." : "Buy"}
        </button>
        <Link to="/products" className="btn btn-secondary">Continue shopping</Link>
      </div>
    </div>
  );
};

export default ShoppingCart;