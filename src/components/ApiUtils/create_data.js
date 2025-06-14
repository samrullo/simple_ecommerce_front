import axios from "axios";
import { refreshAccessToken } from "./token_utils";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");
  return {
    Authorization: `Bearer ${token}`,
  };
};

const makeRequestWithRetry = async (method, apiEndpoint, payload, resourceName, needsAuth = true) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(needsAuth ? getAuthHeaders() : {}),
    };

    const response = await axios({
      method,
      url: apiEndpoint,
      data: payload,
      headers,
    });

    console.log(`Successfully ${method}ed ${resourceName}:`, response.data);
    return response.data;

  } catch (error) {
    if (needsAuth && error.response?.status === 401) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        try {
          const retryHeaders = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newAccessToken}`,
          };

          const retryResponse = await axios({
            method,
            url: apiEndpoint,
            data: payload,
            headers: retryHeaders,
          });

          console.log(`Retried and ${method}ed ${resourceName}:`, retryResponse.data);
          return retryResponse.data;

        } catch (retryError) {
          console.error(`Retry failed for ${resourceName}:`, retryError.response?.data || retryError.message);
          throw retryError;
        }
      }
    }

    console.error(`Error ${method}ing ${resourceName}:`, error.response?.data || error.message);
    throw error;
  }
};

export const createResource = (apiEndpoint, payload, resourceName, needsAuth = true) => {
  return makeRequestWithRetry("post", apiEndpoint, payload, resourceName, needsAuth);
};

export const createResourceWithoutAuth = (apiEndpoint, payload, resourceName) => {
  return createResource(apiEndpoint, payload, resourceName, false);
};

export const updateResource = (apiEndpoint, payload, resourceName, needsAuth = true) => {
  return makeRequestWithRetry("put", apiEndpoint, payload, resourceName, needsAuth);
};

export const updatePatchResource = (apiEndpoint, payload, resourceName, needsAuth = true) => {
  return makeRequestWithRetry("patch", apiEndpoint, payload, resourceName, needsAuth);
};

export const deleteResource = (apiEndpoint, resourceName, needsAuth = true) => {
  return makeRequestWithRetry("delete", apiEndpoint, null, resourceName, needsAuth);
};
