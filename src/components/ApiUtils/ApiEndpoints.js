const API_HOSTNAME = window.REACT_APP_API_HOSTNAME || "http://localhost:8000";

export const LOGIN_ENDPOINT = `${API_HOSTNAME}/auth/login/`;
export const LOGOUT_ENDPOINT = `${API_HOSTNAME}/auth/logout/`;
export const REGISTER_ENDPOINT = `${API_HOSTNAME}/auth/register/`;
export const RESEND_EMAIL_VERIFICATION = `${API_HOSTNAME}/auth/resend-email-verification/`;
export const USER_INFO_ENDPOINT = `${API_HOSTNAME}/auth/user-info/`;
export const PASSWORD_RESET_REQUEST_ENDPOINT = `${API_HOSTNAME}/auth/password/reset/`;

export const PRODUCTS_ENDPOINT = `${API_HOSTNAME}/ecommerce/v1/ecommerce/products/`;
