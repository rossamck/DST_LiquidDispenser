// IPAddressForm.jsx
import React, { useState, useContext } from "react";
import { WebSocketContext } from "../WebSocketContext/WebSocketContext";

const IPAddressForm = () => {
  const { updateWebSocketIP } = useContext(WebSocketContext);
  const [ipAddress, setIpAddress] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();
    updateWebSocketIP(ipAddress);
    setFeedbackMessage(`IP address updated to ${ipAddress}`);
    setTimeout(() => {
      setFeedbackMessage("");
    }, 3000); // Clear feedback message after 3 seconds
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <label htmlFor="ip-address" className="text-white">
        ESP8266 IP Address:
      </label>
      <input
        type="text"
        id="ip-address"
        value={ipAddress}
        onChange={(e) => setIpAddress(e.target.value)}
        className="bg-gray-800 text-white border-2 border-gray-600 ml-2 p-1 rounded-md"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 ml-2 rounded-md"
      >
        Update
      </button>
      {feedbackMessage && (
      <p className="text-green-500 mt-2">{feedbackMessage}</p>
    )}
    </form>
  );
};

export default IPAddressForm;
