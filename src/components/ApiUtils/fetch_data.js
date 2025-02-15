import axios from "axios";

export const fetchResource = async (apiEndPoint, resourceName) => {
  try {
    const response = await axios.get(apiEndPoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    console.log(`Successfully fetched ${resourceName}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${resourceName} from ${apiEndPoint}:`, error);
    return null;
  }
};
