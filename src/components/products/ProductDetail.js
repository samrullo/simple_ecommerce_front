// src/components/products/ProductDetail.js
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppContext from "../../AppContext";
import { useApi } from "../hooks/useApi";
import { PRODUCTS_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import { handleAddToCart } from "../orders/order_utils";

const ProductDetail = () => {
    const { productId } = useParams();
    const { get } = useApi();
    const navigate = useNavigate();
    const { baseCurrency, setFlashMessages } = useContext(AppContext);

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await get(`${PRODUCTS_ENDPOINT}${productId}/`, false);
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
                setFlashMessages([{ category: "danger", message: "Failed to load product details." }]);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);



    if (loading) return <p>Loading product...</p>;
    if (!product) return <p>Product not found.</p>;

    const activePrice = product.price?.find((p) => p.end_date === null);
    const iconImage = product.images?.find((img) => img.tag === "icon")?.image;
    const otherImages = product.images?.filter((img) => img.tag !== "icon");

    const stock = product.inventory?.reduce((sum, inv) => sum + inv.stock, 0) || 0;

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
                    <p>{product.description}</p>
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