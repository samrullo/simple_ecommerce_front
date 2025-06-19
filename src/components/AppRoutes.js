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
import PurchaseNew from "./purchases/PurchaseNew";
import PurchaseEdit from "./purchases/PurchaseEdit";
import AboutUs from "./AboutUs";
import Login from "./user_management/Login";
import Register from "./user_management/Register";
import EmailNotVerified from "./user_management/EmailNotVerified";
import Profile from "./user_management/Profile";
import ForgotPassword from "./user_management/ForgotPassword";
import ResetPasswordConfirm from "./user_management/ResetPasswordConfirm";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route index element={<Dashboard />} />
        <Route path="/products" element={<Product />}>
          <Route path="new" element={<ProductNew />} />
          <Route path="edit/:productId" element={<ProductEdit />} />
        </Route>
        <Route path="/contacts" element={<Contact />}>
          <Route path="new" element={<ContactNew />} />
          <Route path="edit/:contactId" element={<ContactEdit />} />
        </Route>
        <Route path="/purchases" element={<Purchase />}>
          <Route path="new" element={<PurchaseNew />} />
          <Route path="edit/:purchaseId" element={<PurchaseEdit />} />
        </Route>
      </Route>
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
    </Routes>
  );
};

export default AppRoutes;