import axios from "axios";
import { refreshAccessToken } from "./token_utils";

const makeAuthorizedRequest = async (method, url, resourceName, needsAuth = true) => {
  try {
    const config = {};

    if (needsAuth) {
      config.headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      };
    }

    const response = await axios({ method, url, ...config });
    console.log(`Successfully fetched ${resourceName}:`, response.data);
    return response.data;

  } catch (error) {
    if (needsAuth && error.response && error.response.status === 401) {
      // Try refreshing the token
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        try {
          const retryConfig = {
            headers: { Authorization: `Bearer ${newAccessToken}` },
          };
          const retryResponse = await axios({ method, url, ...retryConfig });
          console.log(`Retried and fetched ${resourceName}:`, retryResponse.data);
          return retryResponse.data;
        } catch (retryError) {
          console.error(`Retry failed for ${resourceName}:`, retryError);
        }
      }
    }

    console.error(`Error fetching ${resourceName} from ${url}:`, error);
    return null;
  }
};

export const fetchResource = (apiEndPoint, resourceName, needsAuth = true) => {
  return makeAuthorizedRequest("get", apiEndPoint, resourceName, needsAuth);
};

export const fetchSingleResource = (apiEndpoint, resourceName, needsAuth = true) => {
  return makeAuthorizedRequest("get", apiEndpoint, resourceName, needsAuth);
};
