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
        <h3 className={`text-white text-center transition-all duration-500 mb-4 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>
          Sidebar
        </h3>
        <div
className={`absolute left-4 space-y-6 transition-all duration-500 ${
  sidebarOpen ? "opacity-100 transform-none" : "opacity-0 -translate-x-4"
}`}


        >
          <button className={`text-gray-400 block py-2 px-4 hover:text-white`}>
            Option 1
          </button>
          <button className={`text-gray-400 block py-2 px-4 hover:text-white`}>
            Option 2
          </button>
          <button className={`text-gray-400 block py-2 px-4 hover:text-white`}>
            Option 3
          </button>
          <button className={`text-gray-400 block py-2 px-4 hover:text-white`}>
            Dev Tools
          </button>
        </div>
      </div>

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
