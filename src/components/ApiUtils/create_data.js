import axios from "axios";

export const createResourceWithoutAuth = async (
  apiEndpoint,
  payload,
  resource_name
) => {
  try {
    const response = await axios.post(apiEndpoint, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const posted_data = await response.data;
    console.log(
      `successfully created new resource ${resource_name} ${JSON.stringify(
        posted_data
      )}`
    );
    return posted_data;
  } catch (error) {
    console.log(
      `error while creating new resource ${resource_name} with payload ${JSON.stringify(
        payload
      )}, error message : ${error}`
    );
  }
};

export const createResource = async (apiEndpoint, payload, resource_name) => {
  try {
    const response = await axios.post(apiEndpoint, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    const posted_data = await response.data;
    console.log(
      `successfully created new resource ${resource_name} ${JSON.stringify(
        posted_data
      )}`
    );
    return posted_data;
  } catch (error) {
    console.log(
      `error while creating new resource ${resource_name} with payload ${JSON.stringify(
        payload
      )}, error message : ${error}`
    );
  }
};

export const updateResource = async (apiEndpoint, payload, resource_name) => {
  try {
    const response = await axios.put(apiEndpoint, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    const updated_data = await response.data;
    console.log(
      `successfully updated resource ${resource_name} ${JSON.stringify(
        updated_data
      )}`
    );
    return updated_data;
  } catch (error) {
    console.log(
      `error while updating resource ${resource_name} with payload ${JSON.stringify(
        payload
      )}, error message : ${error}`
    );
  }
};

export const updatePatchResource = async (
  apiEndpoint,
  payload,
  resource_name
) => {
  try {
    const response = await axios.patch(apiEndpoint, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    const updated_data = await response.data;
    console.log(
      `successfully updated resource with PATCH ${resource_name} ${JSON.stringify(
        updated_data
      )}`
    );
    return updated_data;
  } catch (error) {
    console.log(
      `error while updating resource with PATCH ${resource_name} with payload ${JSON.stringify(
        payload
      )}, error message : ${error}`
    );
  }
};

export const deleteResource = async (apiEndpoint, resource_name) => {
  try {
    const response = await axios.delete(apiEndpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    const deleted_data = await response.data;
    console.log(
      `successfully deleted resource ${resource_name} ${JSON.stringify(
        deleted_data
      )}`
    );
    return deleted_data;
  } catch (error) {
    console.log(
      `error while deleting resource ${resource_name}, error message : ${error}`
    );
  }
};
