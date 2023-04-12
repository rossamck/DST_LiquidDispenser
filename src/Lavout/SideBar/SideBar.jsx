// Sidebar.jsx

import React from "react";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const openNav = () => {
    setSidebarOpen(true);
  };

  const closeNav = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <div
        id="mySidebar"
        className={`bg-black h-full fixed z-10 top-0 left-0 overflow-x-hidden pt-60 transition-all duration-500 ${
          sidebarOpen ? "w-64" : "w-0"
        }`}
      >
        <button onClick={closeNav} className="absolute top-0 right-0 m-4 text-white text-xl">
          &times;
        </button>
        <button className="text-gray-400 block py-2 px-4 hover:text-white">
          About
        </button>
        <button className="text-gray-400 block py-2 px-4 hover:text-white">
          Services
        </button>
        <button className="text-gray-400 block py-2 px-4 hover:text-white">
          Clients
        </button>
        <button className="text-gray-400 block py-2 px-4 hover:text-white">
          Contact
        </button>
      </div>

      <div id="main">
        <button
          className="bg-black text-white py-2 px-4 fixed top-0 left-0 m-4 z-20"
          onClick={openNav}
        >
          &#9776; Open Sidebar
        </button>
      </div>
    </>
  );
}

export default Sidebar;
