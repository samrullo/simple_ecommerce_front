import { useContext } from "react";
import axios from "axios";
import AppContext from "../../AppContext";
import { REFRESH_TOKEN_ENDPOINT } from "../ApiUtils/ApiEndpoints";

export const useApi = () => {
  const { logoutUser } = useContext(AppContext);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      logoutUser();
      return null;
    }

    try {
      const response = await axios.post(REFRESH_TOKEN_ENDPOINT, {
        refresh: refreshToken,
      });

      const newAccessToken = response.data.access;
      localStorage.setItem("access_token", newAccessToken);
      return newAccessToken;
    } catch (err) {
      console.error("Token refresh failed", err);
      logoutUser();
      return null;
    }
  };

  const request = async (method, url, data = null, needsAuth = true) => {
    const isFormData = data instanceof FormData;
    const makeRequest = async (tokenOverride = null) => {
      const headers = {
        ...(needsAuth ? { Authorization: `Bearer ${tokenOverride || localStorage.getItem("access_token")}` } : {}),
        ...(isFormData ? {} : { "Content-Type": "application/json" }), // ❗ Don't manually set for FormData
      };

      return axios({ method, url, data, headers });
    };

    try {
      const response = await makeRequest();
      return response.data;
    } catch (error) {
      if (needsAuth && error.response?.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          try {
            const retryResponse = await makeRequest(newToken);
            return retryResponse.data;
          } catch (retryError) {
            throw retryError;
          }
        }
      }

      throw error;
    }
  };

  return {
    get: (url, needsAuth = true) => request("get", url, null, needsAuth),
    post: (url, data, needsAuth = true) => request("post", url, data, needsAuth),
    put: (url, data, needsAuth = true) => request("put", url, data, needsAuth),
    patch: (url, data, needsAuth = true) => request("patch", url, data, needsAuth),
    del: (url, needsAuth = true) => request("delete", url, null, needsAuth),
  };
};
