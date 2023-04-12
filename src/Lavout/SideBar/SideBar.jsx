// Sidebar.jsx
import React from "react";
import BurgerMenu from "../../components/BurgerMenu/BurgerMenu";

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

      <div className="fixed top-0 left-1 mt-2 mb-2 z-20">
        <button
          className="bg-black text-white py-2 px-4 flex items-center justify-center"
          onClick={toggleSidebar}
          style={{
            width: "3rem",
            height: "3rem",
            borderRadius: "50%",
          }}
        >
          <BurgerMenu open={sidebarOpen} />
        </button>
      </div>
    </>
  );
}

export default Sidebar;