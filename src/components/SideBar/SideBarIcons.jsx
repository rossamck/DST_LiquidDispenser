import React from "react";
import { MdHome, MdBuild, MdRefresh } from "react-icons/md";
import { FaRegObjectUngroup, FaTasks } from "react-icons/fa";

function SidebarIcons({ sidebarOpen, handleButtonClick, activeLayout }) {
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
          className={`text-gray-400 block ${
            activeLayout === "DevLayout" ? "text-green-500" : "hover:text-white"
          } mb-7`}
          onClick={() => handleButtonClick("DevLayout")}
          title="Developer Tools"
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
