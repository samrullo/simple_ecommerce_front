import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useApi } from "../hooks/useApi";
import AppContext from "../../AppContext";
import { useSingleProductData } from "../hooks/useSingleProductData";
import { PRODUCTS_ENDPOINT } from "../ApiUtils/ApiEndpoints";
import { handleAddToCart } from "./order_utils";
import { Spinner } from "../util_components/Spinner";

const AddToCart = () => {
    const { productId } = useParams();
    // console.log(`productId extracted from useParams is ${productId}`)
    const { get } = useApi();
    const navigate = useNavigate();
    const { userInfo, baseCurrency } = useContext(AppContext);

    const [quantity, setQuantity] = useState(1);

    const { product,
        productPrice,
        productInventory,
        fxRates,
        loading,
        convertPrice } = useSingleProductData(productId, baseCurrency,[baseCurrency])
    // console.log(`fetched single product with useSingleProductData is ${JSON.stringify(product)}`)


    return <>
        {loading ? (<Spinner />) : (<div className="container mt-4">
            <h2>Add to Cart</h2>
            <div className="card p-3">
                <div className="d-flex align-items-center">
                    {product.image && (
                        <img
                            src={product.image}
                            alt={product.name}
                            style={{ width: "80px", height: "80px", objectFit: "cover", marginRight: "1rem" }}
                        />
                    )}
                    <div>
                        <h5>{product.name}</h5>
                        <ReactMarkdown>{product.description}</ReactMarkdown>
                        <p>
                            <strong>
                                {product.price} {product.currency}
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
                <button onClick={() => { handleAddToCart(product, quantity, navigate) }} className="btn btn-primary mt-3">
                    Add
                </button>
            </div>
        </div>

        )}
    </>
};

export default AddToCart;