import React from "react";
import { useContext } from "react";
import AppContext from "../../AppContext";
import DataViewTable from "../GenericDataComponents/DataViewTable";

const Profile = () => {
  const { isAuthenticated, userInfo } = useContext(AppContext);

  console.log(`user info is ${JSON.stringify(userInfo)}`);

  if (!userInfo) {
    return <p>Loading...</p>; // Prevents access errors while userInfo is null/undefined
  }

  const customer = userInfo.customer || {}; // Prevents "Cannot read properties of undefined"
  const addresses = customer.addresses || []; // Ensures addresses is always an array

  const data = [
    { Field: "Email", Value: userInfo.email },
    { Field: "First Name", Value: userInfo.first_name },
    { Field: "Last Name", Value: userInfo.last_name },
    { Field: "Phone", Value: customer.phone || "N/A" }, // Prevents undefined access
  ];

  return (
    <>
      <h1>Profile</h1>
      {isAuthenticated ? (
        <>
          <DataViewTable data={data} hiddenColumns={["id"]} width_pct={100} />

          <h2>Addresses</h2>

          {addresses.length > 0 ? (
            <DataViewTable
              data={addresses} // Ensure it's wrapped as an array for AgGrid
              hiddenColumns={["id"]}
              width_pct={100}
            />
          ) : (
            <p>No addresses available</p>
          )}
        </>
      ) : (
        <>You are not authenticated</>
      )}
    </>
  );
};

export default Profile;
