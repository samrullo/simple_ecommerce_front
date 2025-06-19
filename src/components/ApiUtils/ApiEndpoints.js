const API_HOSTNAME = window.REACT_APP_API_HOSTNAME || "http://localhost:8000";

export const LOGIN_ENDPOINT = `${API_HOSTNAME}/auth/login/`;
export const LOGOUT_ENDPOINT = `${API_HOSTNAME}/auth/logout/`;
export const REGISTER_ENDPOINT = `${API_HOSTNAME}/auth/register/`;
export const RESEND_EMAIL_VERIFICATION = `${API_HOSTNAME}/auth/resend-email-verification/`;
export const USER_INFO_ENDPOINT = `${API_HOSTNAME}/auth/user-info/`;
export const PASSWORD_RESET_REQUEST_ENDPOINT = `${API_HOSTNAME}/auth/password/reset/`;
export const PASSWORD_RESET_CONFIRM = `${API_HOSTNAME}/auth/password/reset/confirm/`;
export const REFRESH_TOKEN_ENDPOINT = `${API_HOSTNAME}/auth/token/refresh/`

export const PRODUCTS_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/products/`;
export const CREATE_PRODUCT_ENDPOINT =`${API_HOSTNAME}/ecommerce/v1/create-product/`;
export const UPDATE_PRODUCT_ENDPOINT =`${API_HOSTNAME}/ecommerce/v1/update-product/`;

export const PURCHASES_ENDPOINT=`${API_HOSTNAME}/ecommerce/v1/purchases/`;
export const PURCHASE_CREATE_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/create-purchase/`;
export const UPDATE_PURCHASE_ENDPOINT=`${API_HOSTNAME}/ecommerce/v1/update-purchase/`;