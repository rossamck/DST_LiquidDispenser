// Sidebar.jsx
import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div
        id="mySidebar"
        className={`bg-black h-full fixed z-10 top-0 left-0 overflow-x-hidden pt-16 transition-all duration-500 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <h3 className={`text-white text-center mb-4 ${sidebarOpen ? "block" : "hidden"}`}>
          Sidebar
        </h3>
        <button className={`text-gray-400 block py-2 px-4 hover:text-white ${sidebarOpen ? "block" : "hidden"}`}>
          About
        </button>
        <button className={`text-gray-400 block py-2 px-4 hover:text-white ${sidebarOpen ? "block" : "hidden"}`}>
          Services
        </button>
        <button className={`text-gray-400 block py-2 px-4 hover:text-white ${sidebarOpen ? "block" : "hidden"}`}>
          Clients
        </button>
        <button className={`text-gray-400 block py-2 px-4 hover:text-white ${sidebarOpen ? "block" : "hidden"}`}>
          Contact
        </button>
      </div>

      <div id="main">
        <button
          className="bg-black text-white py-2 px-4 fixed top-0 left-0 mt-2 mb-2 z-20 flex items-center justify-center"
          onClick={toggleSidebar}
          style={{
            width: "3rem",
            height: "3rem",
            borderRadius: "50%",
            left: sidebarOpen ? "calc(4rem - 1.5rem)" : "calc(2rem - 1.5rem)",
            transition: "left 500ms ease",
          }}
        >
          <GiHamburgerMenu size={24} />
        </button>
      </div>
    </>
  );
}

export default Sidebar;
