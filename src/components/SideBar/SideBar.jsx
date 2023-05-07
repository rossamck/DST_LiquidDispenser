import React, { useEffect, useRef } from "react";
import BurgerMenu from "../../components/BurgerMenu/BurgerMenu";
import SidebarIcons from "./SideBarIcons";

function Sidebar({ sidebarOpen, setSidebarOpen, setActiveLayout }) {
  const toggleSidebar = (event) => {
    event.stopPropagation(); // stop the event propagation
    setSidebarOpen(!sidebarOpen);
  };

  const handleButtonClick = (layout) => {
    console.log("Setting layout");
    setActiveLayout(layout);
  };

  // Use useRef to create a reference to the sidebar element
  const sidebarRef = useRef(null);

  useEffect(() => {
    // Add an event listener to detect clicks outside of the sidebar
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [sidebarRef, setSidebarOpen]);

  return (
    <>
      <div
        ref={sidebarRef}
        id="mySidebar"
        className={`bg-black h-full fixed z-10 top-0 left-0 overflow-x-hidden pt-16 transition-all duration-500 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <h3
          className={`text-white text-center transition-all duration-500 mb-4 ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          Sidebar
        </h3>
        <div
          className={`absolute left-4 space-y-6 transition-all duration-500 ${
            sidebarOpen
              ? "opacity-100 transform-none"
              : "opacity-0 -translate-x-4"
          }`}
        >
          <button
            className={`text-gray-400 block py-2 px-4 hover:text-white`}
            onClick={() => handleButtonClick("Layout1")}
          >
            Home
          </button>
          <button
            className={`text-gray-400 block py-2 px-4 hover:text-white`}
            onClick={() => handleButtonClick("Layout2")}
          >
            Option 2
          </button>
          <button
            className={`text-gray-400 block py-2 px-4 hover:text-white`}
            onClick={() => handleButtonClick("Layout3")}
          >
            Option 3
          </button>
          <button
            className={`text-gray-400 block py-2 px-4 hover:text-white`}
            onClick={() => handleButtonClick("DevLayout")}
          >
            Dev Tools
          </button>
        </div>
      </div>
      
      <SidebarIcons sidebarOpen={sidebarOpen} handleButtonClick={handleButtonClick} />


      <div className="fixed top-0 left-1.5 mt-2 mb-2 z-20">
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
