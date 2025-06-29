import React, { useEffect, useState } from "react";

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("shopping_cart")) || [];
    setCartItems(storedCart);
  }, []);

  // Update quantity of a specific item
  const updateQuantity = (index, newQty) => {
    const updated = [...cartItems];
    updated[index].quantity = newQty;
    setCartItems(updated);
    localStorage.setItem("shopping_cart", JSON.stringify(updated));
  };

  // Remove an item
  const removeItem = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
    localStorage.setItem("shopping_cart", JSON.stringify(updated));
  };

  // Total cost
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
              <th>Subtotal</th>
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
                  {(item.price * item.quantity).toLocaleString()} {item.currency}
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
                {total.toLocaleString()} {cartItems[0]?.currency}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShoppingCart;