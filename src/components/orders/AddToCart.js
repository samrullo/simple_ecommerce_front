import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { PRODUCTS_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import { handleAddToCart } from "./order_utils";

const AddToCart = () => {
    const { id } = useParams();
    const { get } = useApi();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await get(`${PRODUCTS_ENDPOINT}${id}/`, false);

                // Find the image object with tag === "icon"
                const iconImageObj = data.images?.find((img) => img.tag === "icon");

                // Build full image URL if icon exists
                const imageUrl = iconImageObj ? iconImageObj.image : "";
                setProduct({...data,image:imageUrl});
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        fetchProduct();
    }, [id]);


    if (!product) return <p>Loading...</p>;

    const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL || "http://localhost:8000";
    // Find the image object with tag === "icon"
    const iconImageObj = product.images?.find((img) => img.tag === "icon");

    // Build full image URL if icon exists
    const imageUrl = iconImageObj ? iconImageObj.image : "";

    return (
        <div className="container mt-4">
            <h2>Add to Cart</h2>
            <div className="card p-3">
                <div className="d-flex align-items-center">
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt={product.name}
                            style={{ width: "80px", height: "80px", objectFit: "cover", marginRight: "1rem" }}
                        />
                    )}
                    <div>
                        <h5>{product.name}</h5>
                        <p>{product.description}</p>
                        <p>
                            <strong>
                                {product.price?.[0]?.price} {product.price?.[0]?.currency?.code}
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

                <button onClick={()=>{handleAddToCart(product,quantity,navigate)}} className="btn btn-primary mt-3">
                    Add
                </button>
            </div>
        </div>
    );
};

export default AddToCart;