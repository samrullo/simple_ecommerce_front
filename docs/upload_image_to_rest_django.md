# How do I upload image to Django REST backend?

Since you're using **React**, the frontend should send the image file in a `multipart/form-data` request when creating a product. Below is the correct way to **design a React form to upload an image** and send the data to your Django API.

---

## **1. Update Django Backend**
Make sure your **Django REST Framework (DRF) backend** is set up to handle image uploads.

### ✅ **Ensure `ProductSerializer` Allows Image Uploads**
Modify your `ProductSerializer`:
```python
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)  # Allow image uploads

    class Meta:
        model = Product
        fields = '__all__'
```

### ✅ **Ensure `ProductViewSet` Accepts File Uploads**
Modify `ProductViewSet` to support `multipart/form-data`:
```python
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import viewsets, permissions
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # Required for image upload
```

---

## **2. Configure Django to Serve Media Files**
Ensure Django is set up to **serve uploaded images**.

### ✅ **Add This to `settings.py`**
```python
import os

MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
```

### ✅ **Modify `urls.py` to Serve Media**
```python
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

---

## **3. React Frontend: Upload Image & Create Product**
Now, let's create a **React form** to **upload an image** and submit product data.

### ✅ **Install Axios for API Requests**
Run:
```sh
npm install axios
```

---

### ✅ **Create a React Component for Product Upload**
#### 📂 `src/components/ProductForm.js`
```jsx
import React, { useState } from "react";
import axios from "axios";

const ProductForm = () => {
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        sku: "",
        image: null,  // Holds the uploaded image
    });

    const [message, setMessage] = useState("");

    // Handle text input changes
    const handleChange = (e) => {
        setProductData({
            ...productData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle file input change
    const handleFileChange = (e) => {
        setProductData({
            ...productData,
            image: e.target.files[0], // Save selected file
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", productData.name);
        formData.append("description", productData.description);
        formData.append("sku", productData.sku);
        if (productData.image) {
            formData.append("image", productData.image);
        }

        try {
            const response = await axios.post("http://localhost:8000/api/products/", formData, {
                headers: {
                    "Authorization": `Bearer YOUR_ACCESS_TOKEN`, // Replace with actual token
                    "Content-Type": "multipart/form-data",
                },
            });

            setMessage("Product created successfully!");
            console.log("Response:", response.data);
        } catch (error) {
            setMessage("Error creating product.");
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <h2>Create Product</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label>Product Name:</label>
                <input type="text" name="name" value={productData.name} onChange={handleChange} required />

                <label>Description:</label>
                <textarea name="description" value={productData.description} onChange={handleChange} />

                <label>SKU:</label>
                <input type="text" name="sku" value={productData.sku} onChange={handleChange} required />

                <label>Upload Image:</label>
                <input type="file" name="image" onChange={handleFileChange} accept="image/*" />

                <button type="submit">Create Product</button>
            </form>
        </div>
    );
};

export default ProductForm;
```

---

## **4. Use `ProductForm` in Your React App**
In your `App.js` or wherever you want to display the product form:

#### 📂 `src/App.js`
```jsx
import React from "react";
import ProductForm from "./components/ProductForm";

function App() {
    return (
        <div className="App">
            <h1>Product Management</h1>
            <ProductForm />
        </div>
    );
}

export default App;
```

---

## **5. Run React and Django**
✅ **Start Django server**:
```sh
python manage.py runserver
```
✅ **Start React frontend**:
```sh
npm start
```

---

## **6. Test Product Creation**
- Open **http://localhost:3000/**
- Fill in **Product Name, Description, SKU, and choose an image**.
- Click **Create Product**.
- Check **Django Admin** or **Database** to see if the product was created.

---

## **7. Serve Images in React**
After uploading, your product images will be saved in Django's `media/products/` directory.

To display them in React, you need to **fetch products from the API** and include the `image` URL.

### ✅ **Example: Display Product Images**
```jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/products/")
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    return (
        <div>
            <h2>Product List</h2>
            {products.map((product) => (
                <div key={product.id}>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p><strong>SKU:</strong> {product.sku}</p>
                    {product.image && <img src={`http://localhost:8000${product.image}`} alt={product.name} width="200" />}
                </div>
            ))}
        </div>
    );
};

export default ProductList;
```

---

## **Final Summary**
✔ **Django Backend**: Updated serializer, viewset, and media settings.  
✔ **React Frontend**: Created a **React form to upload images**.  
✔ **API Calls**: Used `FormData` to send image and text data to Django.  
✔ **Displayed Uploaded Images**: Used Django’s media URL in React.

### **Now you can upload and display product images successfully! 🎉🚀**