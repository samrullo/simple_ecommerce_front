
export  const handleAddToCart = (product,quantity,navigate) => {
        const cart = JSON.parse(localStorage.getItem("shopping_cart")) || [];

        const existingItemIndex = cart.findIndex((item) => item.id === product.id);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += Number(quantity);
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                currency: product.currency,
                image: product.image,
                quantity: Number(quantity),
            });
        }

        localStorage.setItem("shopping_cart", JSON.stringify(cart));
        navigate("/shopping-cart"); 
    };