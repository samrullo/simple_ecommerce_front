const API_HOSTNAME = window.REACT_APP_API_HOSTNAME || "http://localhost:8000";

export const LOGIN_ENDPOINT = `${API_HOSTNAME}/auth/login/`;
export const LOGOUT_ENDPOINT = `${API_HOSTNAME}/auth/logout/`;
