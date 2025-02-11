import React from "react";
import { useState, useEffect } from "react";
import AppContext from "../AppContext";
import { useContext } from "react";

const FlashMessage = () => {
  const { flashMessages, setFlashMessages } = useContext(AppContext);

  // Automatically remove flash messages after 3 seconds
  useEffect(() => {
    if (flashMessages.length > 0) {
      const timer = setTimeout(() => {
        setFlashMessages([]); // Clear all flash messages after 3 seconds
      }, 2000);

      return () => clearTimeout(timer); // Cleanup to avoid memory leaks
    }
  }, [flashMessages, setFlashMessages]);

  return (
    <>
      {flashMessages.length === 0 ? (
        <></>
      ) : (
        flashMessages.map(({ category, message }, index) => (
          <div key={index} className={`alert alert-${category}`}>
            <p>{message}</p>
          </div>
        ))
      )}
    </>
  );
};

export default FlashMessage;
