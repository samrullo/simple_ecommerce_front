// src/components/products/ProductDetail.js
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import AppContext from "../../AppContext";
import { useSingleProductData } from "../hooks/useSingleProductData";
import { handleAddToCart } from "../orders/order_utils";
import { Spinner } from "../util_components/Spinner";

const ProductDetail = () => {
    const { productId } = useParams();

    const navigate = useNavigate();
    const { baseCurrency, setFlashMessages } = useContext(AppContext);


    const [quantity, setQuantity] = useState(1);


    const { product,
        productPrice,
        loading,
        productImages } = useSingleProductData(productId, baseCurrency, [baseCurrency])


    if (loading) return <Spinner />;
    if (!product) return <p>Product not found.</p>;

    const activePrice = productPrice
    const iconImage = product.image
    const otherImages = productImages?.filter((img) => img.tag !== "icon");

    const stock = product.inventory || 0;

    return (
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3" onClick={() => navigate("/products", { state: { timestamp: Date.now() } })}>← Back</button>

            <div className="row">
                <div className="col-md-5">
                    {iconImage && (
                        <img
                            src={iconImage}
                            alt={product.name}
                            className="img-fluid mb-3"
                            style={{ objectFit: "cover", maxHeight: "300px" }}
                        />
                    )}
                    {otherImages?.map((img, i) => (
                        <img
                            key={i}
                            src={img.image}
                            alt={`Additional ${i}`}
                            className="img-thumbnail me-2 mb-2"
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                    ))}
                </div>

                <div className="col-md-7">
                    <h2>{product.name}</h2>
                    <ReactMarkdown>{product.description}</ReactMarkdown>
                    <p><strong>Price:</strong> {activePrice?.price} {activePrice?.currency?.code}</p>
                    <p><strong>Stock:</strong> {stock}</p>

                    <div className="mt-3">
                        <label className="form-label">Quantity:</label>
                        <input
                            type="number"
                            min="1"
                            className="form-control"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            style={{ width: "100px" }}
                        />
                    </div>

                    <button className="btn btn-success mt-3" onClick={() => { handleAddToCart(product, quantity, navigate) }}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;