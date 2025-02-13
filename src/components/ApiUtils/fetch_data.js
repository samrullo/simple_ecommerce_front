import axios from "axios";

export const fetchResource = async (apiEndPoint, resourceName) => {
  try {
    const response = await axios.get(apiEndPoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    const resourceData = await response.data;
    console.log(
      `successfully fetched ${resourceName} ${JSON.stringify(resourceData)}`
    );
    return resourceData;
  } catch (error) {
    console.log(
      `error while fetching ${resourceName} resources for api EndPoint ${apiEndPoint} : ${error}`
    );
  }
};
