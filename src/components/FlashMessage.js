import React, { useEffect, useContext } from "react";
import AppContext from "../AppContext";

// Get timeout from environment, fallback to 2000ms if undefined
const TIMEOUT_MS = parseInt(process.env.REACT_APP_FLASH_MESSAGE_TIMEOUT || "2000", 10);

const FlashMessage = () => {
  const { flashMessages, setFlashMessages } = useContext(AppContext);

  useEffect(() => {
    if (flashMessages.length > 0) {
      const timer = setTimeout(() => {
        setFlashMessages([]);
      }, TIMEOUT_MS);

      return () => clearTimeout(timer);
    }
  }, [flashMessages, setFlashMessages]);

  return (
    <>
      {flashMessages.length > 0 &&
        flashMessages.map(({ category, message }, index) => (
          <div key={index} className={`alert alert-${category}`}>
            <p>{message}</p>
          </div>
        ))}
    </>
  );
};

export default FlashMessage;
