import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Dashboard from "./Dashboard";
import Product from "./products/Product";
import ProductNew from "./products/ProductNew";
import ProductEdit from "./products/ProductEdit";
import Contact from "./contacts/Contact";
import ContactNew from "./contacts/ContactNew";
import ContactEdit from "./contacts/ContactEdit";
import Purchase from "./purchases/Purchase";
import PurchaseByDateSummary from "./purchases/PurchaseByDateSummary";
import PurchaseByDateNew from "./purchases/PurchaseByDateNew";
import PurchaseByDateDetail from "./purchases/PurchaseByDateDetails";
import PurchaseNew from "./purchases/PurchaseNew";
import PurchaseEdit from "./purchases/PurchaseEdit";
import PurchaseByDateDetailCreate from "./purchases/PurchaseByDateDetailCreate";
import PurchaseByDateDetailEdit from "./purchases/PurchaseByDateDetailEdit";
import AboutUs from "./AboutUs";
import Login from "./user_management/Login";
import Register from "./user_management/Register";
import EmailNotVerified from "./user_management/EmailNotVerified";
import EmailVerification from "./user_management/EmailVerification";
import Profile from "./user_management/Profile";
import ForgotPassword from "./user_management/ForgotPassword";
import ResetPasswordConfirm from "./user_management/ResetPasswordConfirm";
import ProductCreateUpdateFromCSV from "./products/ProductCreateUpdateFromCSV";
import PurchaseCreateUpdateFromCSV from "./purchases/PurchaseCreateUpdateFromCSV";
import AddToCart from "./orders/AddToCart";
import ShoppingCart from "./orders/ShoppingCart";
import OrderSummary from "./orders/OrderSummary";
import OrderHistory from "./orders/OrderHistory";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route index element={<Dashboard />} />
        <Route path="/products" element={<Product />}>
          <Route path="new" element={<ProductNew />} />
          <Route path="edit/:productId" element={<ProductEdit />} />
        </Route>

        <Route path="/purchases" element={<Purchase />}>
          <Route path="new" element={<PurchaseNew />} />
          <Route path="edit/:purchaseId" element={<PurchaseEdit />} />
        </Route>
        <Route path="/purchases-by-date-detail/:purchaseDate" element={<PurchaseByDateDetail />}>
          <Route path="new" element={<PurchaseByDateDetailCreate />} />
          <Route path="edit/:purchaseId" element={<PurchaseByDateDetailEdit />} />
        </Route>
        <Route path="/contacts" element={<Contact />}>
          <Route path="new" element={<ContactNew />} />
          <Route path="edit/:contactId" element={<ContactEdit />} />
        </Route>
      </Route>
      <Route path="/product-create-update-from-csv" element={<ProductCreateUpdateFromCSV />} />
      <Route path="/purchase-create-update-from-csv" element={<PurchaseCreateUpdateFromCSV />} />
      <Route path="/purchases-by-date-summary" element={<PurchaseByDateSummary />} />
      <Route path="/purchases-by-date-new" element={<PurchaseByDateNew />} /> 
      <Route path="/add-product-to-cart/:id" element={<AddToCart />} />
      <Route path="/shopping-cart" element={<ShoppingCart />} />
      <Route path="/order-summary/:orderId" element={<OrderSummary />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/email_unverified" element={<EmailNotVerified />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/reset-password-confirm/:uid/:token"
        element={<ResetPasswordConfirm />}
      />
      <Route path="/verify-email/:key" element={<EmailVerification />} />
    </Routes>
  );
};

export default AppRoutes;