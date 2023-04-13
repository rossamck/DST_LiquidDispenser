// BurgerMenu.jsx
import React from "react";

function BurgerMenu({ open }) {
    return (
        <div className="relative w-7 h-7">
          <span
            className={`absolute left-0 w-full h-0.5 bg-white rounded transition-all duration-300 ${
              open ? "top-3 w-0 opacity-0" : "top-0"
            }`}
          ></span>
          <span
            className={`absolute left-0 w-full h-0.5 bg-white rounded transition-all duration-300 ${
              open ? "top-3 transform rotate-45" : "top-2 "
            }`}
          ></span>
          <span
            className={`absolute left-0 w-full h-0.5 bg-white rounded transition-all duration-300 ${
              open ? "top-3 transform -rotate-45" : "top-4"
            }`}
          ></span>
        </div>
      );
    }
export default BurgerMenu;
