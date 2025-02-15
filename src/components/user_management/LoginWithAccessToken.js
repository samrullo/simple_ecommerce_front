import { useEffect, useContext } from "react";
import AppContext from "../../AppContext";
import { fetchResource } from "../ApiUtils/fetch_data";
import { USER_INFO_ENDPOINT } from "../ApiUtils/ApiEndpoints";

const LoginWithAccessToken = () => {
  const { setIsAuthenticated, setUserInfo } = useContext(AppContext);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (localStorage.getItem("access_token")) {
        const user = await fetchResource(USER_INFO_ENDPOINT, "user_info");
        if (user) {
          console.log(`User info: ${JSON.stringify(user)}`);
          setUserInfo(user);
          setIsAuthenticated(true);
        }
      }
    };
    fetchUserInfo();
  }, [setIsAuthenticated, setUserInfo]); // Dependencies to avoid re-running

  return null;
};

export default LoginWithAccessToken;
