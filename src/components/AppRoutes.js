import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Dashboard from "./Dashboard";
import Product from "./products/Product";
import ProductNew from "./products/ProductNew";
import ProductEdit from "./products/ProductEdit";
import ProductDetail from "./products/ProductDetail";
import Contact from "./contacts/Contact";
import ContactNew from "./contacts/ContactNew";
import ContactEdit from "./contacts/ContactEdit";
import Purchase from "./purchases/Purchase";
import PurchaseByDateSummary from "./purchases/PurchaseByDateSummary";
import PurchaseByDateDetail from "./purchases/PurchaseByDateDetails";
import PurchaseNew from "./purchases/PurchaseNew";
import PurchaseEdit from "./purchases/PurchaseEdit";
import PurchaseNewByProduct from "./purchases/PurchaseNewByProduct";
import PurchaseByDateDetailCreate from "./purchases/PurchaseByDateDetailCreate";
import PurchaseByDateDetailEdit from "./purchases/PurchaseByDateDetailEdit";
import CustomerByAdmin from "./admin_customer_management/CustomerByAdmin";
import CustomerByAdminNew from "./admin_customer_management/CustomerByAdminNew";
import CustomerByAdminEdit from "./admin_customer_management/CustomerByAdminEdit";
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
import AdminPurchaseOrderFromCSV from "./purchases/AdminPurchaseOrderFromCSV";
import AddToCart from "./orders/AddToCart";
import ShoppingCart from "./orders/ShoppingCart";
import OrderSummary from "./orders/OrderSummary";
import OrderHistory from "./orders/OrderHistory";
import AdminOrderList from "./admin_orders/AdminOrderList";
import AdminOrderSummary from "./admin_orders/AdminOrderSummary";
import AdminProductsForCustomer from "./admin_orders/AdminProductsForCustomer";
import AdminAddToCartForCustomer from "./admin_orders/AdminAddToCartForCustomer";
import AdminShoppingCart from "./admin_orders/AdminShoppingCart";
import AdminOrderSubmit from "./admin_orders/AdminOrderSubmit";
import TotalsAccountingDateRangeFilter from "./admin_accounting/TotalsAccountingDateRangeFilter";
import PurchaseOrderIncomeSpendingTotal from "./admin_accounting/PurchaseOrderIncomeSpendingTotal";

// FX Rate Components
import FXRate from "./fxrates/FXRate";
import FXRateEdit from "./fxrates/FXRateEdit";
import FXRateNew from "./fxrates/FXRateNew";
// (later: import FXRateNew from "./fx/FXRateNew";)

// Weight Cost components
import WeightCost from "./weight_costs/WeightCost";
import WeightCostNew from "./weight_costs/WeightCostNew";
import WeightCostEdit from "./weight_costs/WeightCostEdit";

// profit rate components
import ProfitRate from "./profit_rates/ProfitRate";
import ProfitRateNew from "./profit_rates/ProfitRateNew";
import ProfitRateEdit from "./profit_rates/ProfitRateEdit";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route index element={<Dashboard />} />

        {/* Products */}
        <Route path="/products" element={<Product />}>
          <Route path="new" element={<ProductNew />} />
          <Route path="edit/:productId" element={<ProductEdit />} />
        </Route>
        <Route path="/products/detail/:productId" element={<ProductDetail />} />

        {/* FX Rates */}
        <Route path="/fxrates" element={<FXRate />}>
          <Route path="new" element={<FXRateNew />} />
          <Route path="edit/:fxRateId" element={<FXRateEdit />} />
          {/* <Route path="new" element={<FXRateNew />} /> */}
        </Route>

        {/* Purchases */}
        <Route path="/purchases" element={<Purchase />}>
          <Route path="new" element={<PurchaseNew />} />
          <Route path="edit/:purchaseId" element={<PurchaseEdit />} />
        </Route>
        <Route path="/purchases/new/:productId" element={<PurchaseNewByProduct />} />
        <Route
          path="/purchases-by-date-detail/:purchaseDate"
          element={<PurchaseByDateDetail />}
        >
          <Route path="new" element={<PurchaseByDateDetailCreate />} />
          <Route path="edit/:purchaseId" element={<PurchaseByDateDetailEdit />} />
        </Route>

        {/* Admin Customer Management */}
        <Route path="/admin-customers" element={<CustomerByAdmin />}>
          <Route path="new" element={<CustomerByAdminNew />} />
          <Route path="edit/:customerId" element={<CustomerByAdminEdit />} />
        </Route>

        {/* Admin Orders */}
        <Route path="/admin-orders" element={<AdminOrderList />} />
        <Route path="/admin-order-summary/:orderId" element={<AdminOrderSummary />} />
        <Route path="/admin-products-for-customer" element={<AdminProductsForCustomer />} />
        <Route path="/admin-add-to-cart/:productId" element={<AdminAddToCartForCustomer />} />
        <Route path="/admin-shopping-cart" element={<AdminShoppingCart />} />
        <Route path="/admin-order-submit" element={<AdminOrderSubmit />} />

        {/* Weight costs */}
        <Route path="/weight-costs" element={<WeightCost />} />
        <Route path="/weight-costs/new" element={<WeightCostNew />} />
        <Route path="/weight-costs/edit/active" element={<WeightCostEdit />} />

        {/* Profit rates */}
        <Route path="/profit-rates" element={<ProfitRate />} />
        <Route path="/profit-rates/new" element={<ProfitRateNew />} />
        <Route path="/profit-rates/edit/active" element={<ProfitRateEdit />} />

        {/* Contacts */}
        <Route path="/contacts" element={<Contact />}>
          <Route path="new" element={<ContactNew />} />
          <Route path="edit/:contactId" element={<ContactEdit />} />
        </Route>
      </Route>

      {/* Standalone Routes */}
      <Route path="/product-create-update-from-csv" element={<ProductCreateUpdateFromCSV />} />
      <Route path="/purchase-create-update-from-csv" element={<PurchaseCreateUpdateFromCSV />} />
      <Route path="/create-purchase-order-from-csv" element={<AdminPurchaseOrderFromCSV />} />
      <Route path="/purchases-by-date-summary" element={<PurchaseByDateSummary />} />
      <Route path="/add-product-to-cart/:productId" element={<AddToCart />} />
      <Route path="/shopping-cart" element={<ShoppingCart />} />
      <Route path="/order-summary/:orderId" element={<OrderSummary />} />
      <Route path="/order-history" element={<OrderHistory />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/email_unverified" element={<EmailNotVerified />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password-confirm/:uid/:token" element={<ResetPasswordConfirm />} />
      <Route path="/verify-email/:key" element={<EmailVerification />} />
      <Route
        path="/totals-accounting-date-range-filter"
        element={<TotalsAccountingDateRangeFilter />}
      />
      <Route path="/purchase-order-income-spending-total" element={<PurchaseOrderIncomeSpendingTotal />} />
    </Routes>
  );
};

export default AppRoutes;