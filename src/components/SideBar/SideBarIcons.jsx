import React, { useContext } from "react";
import { MdHome, MdBuild, MdRefresh } from "react-icons/md";
import { FaRegObjectUngroup, FaTasks } from "react-icons/fa";
import { WebSocketContext } from "../WebSocketContext/WebSocketContext";

function SidebarIcons({ sidebarOpen, handleButtonClick, activeLayout }) {
  // Get the WebSocket status from the context
  const { status } = useContext(WebSocketContext);

  // Determine if the Developer Tools button should be disabled
  const isDevToolsDisabled = status !== "connected";

  // Define the tooltip for the Developer Tools button
  const devToolsTooltip = isDevToolsDisabled
    ? "Please connect before accessing Developer Tools"
    : "Developer Tools";

  // Define the class for the Developer Tools button
  const devToolsClass = `text-gray-400 block ${
    activeLayout === "DevLayout" ? "text-green-500" : "hover:text-white"
  } mb-7 ${isDevToolsDisabled ? "text-gray-700" : ""}`;

  const handleDevToolsClick = () => {
    if (!isDevToolsDisabled) {
      handleButtonClick("DevLayout");
    }
  };

  return (
    <div
      className={`fixed top-16 left-0.5 mt-11 mb-2 z-20 transition-all duration-500 ${
        sidebarOpen ? "opacity-0" : "opacity-100"
      }`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2.8rem",
        marginLeft: "10px",
        justifyContent: "space-between",
        alignItems: "flex-start",
        position: "absolute",
        bottom: "0",
      }}
    >
      <div>
        <button
          className={`text-gray-400 block ${
            activeLayout === "Home" ? "text-green-500" : "hover:text-white"
          } mb-7`}
          onClick={() => handleButtonClick("Home")}
          title="Home"
        >
          <MdHome className="inline" size={36} />
        </button>
        <button
          className={`text-gray-400 block ${
            activeLayout === "PositionalLayout" ? "text-green-500" : "hover:text-white"
          } mb-7`}
          onClick={() => handleButtonClick("PositionalLayout")}
          title="Positional Layout"
        >
          <FaRegObjectUngroup className="inline" size={36} />
        </button>
        <button
          className={`text-gray-400 block ${
            activeLayout === "JobLayout" ? "text-green-500" : "hover:text-white"
          } mb-7`}
          onClick={() => handleButtonClick("JobLayout")}
          title="Option 3"
        >
          <FaTasks className="inline" size={36} />
        </button>
        <button
          className={devToolsClass}
          onClick={handleDevToolsClick}
          title={devToolsTooltip}
        >
          <MdBuild className="inline" size={36} />
        </button>
      </div>
      <div>
        <button
          className={`text-gray-400 block hover:text-white`}
          onClick={() => handleButtonClick("reset")}
          title="Refresh"
        >
          <MdRefresh className="inline" size={36} />
        </button>
      </div>
    </div>
  );
}

export default SidebarIcons;
