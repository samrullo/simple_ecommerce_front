const API_HOSTNAME = process.env.REACT_APP_API_HOSTNAME || "https://simple-ecommerce-djrest.onrender.com";

export const LOGIN_ENDPOINT = `${API_HOSTNAME}/auth/login/`;
export const LOGOUT_ENDPOINT = `${API_HOSTNAME}/auth/logout/`;
export const REGISTER_ENDPOINT = `${API_HOSTNAME}/auth/register/`;
export const RESEND_EMAIL_VERIFICATION = `${API_HOSTNAME}/auth/resend-email-verification/`;
export const VERIFY_EMAIL_ENDPOINT = `${API_HOSTNAME}/auth/registration/account-confirm-email/`
export const USER_INFO_ENDPOINT = `${API_HOSTNAME}/auth/user-info/`;
export const PASSWORD_RESET_REQUEST_ENDPOINT = `${API_HOSTNAME}/auth/password/reset/`;
export const PASSWORD_RESET_CONFIRM = `${API_HOSTNAME}/auth/password/reset/confirm/`;
export const REFRESH_TOKEN_ENDPOINT = `${API_HOSTNAME}/auth/token/refresh/`

export const CURRENCIES_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/currencies/`;
export const FXRATES_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/fxrates/`;
export const ACTIVE_FXRATES_ENDPOINT=`${API_HOSTNAME}/ecommerce/v1/active-fxrates/`;
export const FXRATES_AGAINST_PRIMARY_CURRENCY_ENDPOINT=`${API_HOSTNAME}/ecommerce/v1/active-fxrates-against-primary-currency/`;
export const CREATE_UPDATE_FXRATES_ENDPOINT=`${API_HOSTNAME}/ecommerce/v1/create-or-update-fxrates/`;
export const PRODUCTS_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/products/`;
export const PRODUCTS_WITH_IMAGES_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/products-with-images/`;
export const PRODUCTS_WITH_ICON_IMAGE_ENDPOINT=`${API_HOSTNAME}/ecommerce/v1/products-with-icon-image/`;
export const MINIMAL_PRODUCTS_ENDPOINT=`${API_HOSTNAME}/ecommerce/v1/minimal-products/`;
export const LAST_PURCHASE_PRICES_ENDPOINT=`${API_HOSTNAME}/ecommerce/v1/last-purchase-prices`;
export const PRODUCT_TOTAL_INVENTORIES_ENDPOINT=`${API_HOSTNAME}/ecommerce/v1/product-total-inventories/`;
export const ACTIVE_PRODUCT_PRICES_ENDPOINT=`${API_HOSTNAME}/ecommerce/v1/active-product-prices/`;
export const CREATE_PRODUCT_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/create-product/`;
export const UPDATE_PRODUCT_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/update-product/`;
export const CREATE_UPDATE_PRODUCTS_FROM_CSV_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/create-update-products-from-csv/`;
export const CATEGORIES_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/categories/`;
export const BRANDS_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/brands/`;

export const PURCHASES_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/purchases/`;
export const PURCHASES_BY_DATE_SUMMARY_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/purchases-summary-by-date/`;
export const PURCHASES_BY_DATE_DETAIL_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/purchases-by-date/`;
export const PURCHASE_CREATE_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/create-purchase/`;
export const UPDATE_PURCHASE_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/update-purchase/`;
export const CREATE_UPDATE_PURCHASES_FROM_CSV_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/create-update-purchases-from-csv/`;
export const CREATE_ORDER_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/create-order/`
export const ORDERS_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/orders/`

export const CUSTOMERS_BY_ADMIN_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/admin-customers/`;
export const ADMIN_ORDERS_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/admin-orders/`;
export const CREATE_ORDER_BY_ADMIN_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/admin-create-order/`;