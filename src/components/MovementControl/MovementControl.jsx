import React, { useState, useEffect } from "react";
import {
  FiArrowUp,
  FiArrowDown,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";

const MovementControl = ({
  onXUp,
  onXDown,
  onYUp,
  onYDown,
  onZUp,
  onZDown,
}) => {
  const [activeButton, setActiveButton] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowUp":
          onYUp();
          setActiveButton("up");
          break;
        case "ArrowDown":
          onYDown();
          setActiveButton("down");
          break;
        case "ArrowLeft":
          onXDown();
          setActiveButton("left");
          break;
        case "ArrowRight":
          onXUp();
          setActiveButton("right");
          break;
        case "PageUp":
          onZUp();
          setActiveButton("page-up");
          break;
        case "PageDown":
          onZDown();
          setActiveButton("page-down");
          break;
        default:
          break;
      }
    };

    const handleKeyUp = () => {
      setActiveButton(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [onXUp, onXDown, onYUp, onYDown, onZUp, onZDown]);

  const getButtonClassName = (name) => {
    const baseClassName =
      "rounded-full p-2 bg-gray-300 hover:bg-gray-400 active:bg-gray-500 focus:outline-none";
    if (name === activeButton) {
      return `${baseClassName} bg-gray-500 text-gray-100`;
    }
    return `${baseClassName} text-gray-800`;
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <div className="grid grid-cols-3 grid-rows-2 gap-4 mb-4">
        <button
          className={getButtonClassName("up") + " col-start-2 row-start-1"}
          onClick={onYUp}
        >
          <FiArrowUp className="text-gray-800" size={24} />
        </button>
        <button
          className={getButtonClassName("left") + " col-start-1 row-start-2"}
          onClick={onXDown}
        >
          <FiArrowLeft className="text-gray-800" size={24} />
        </button>
        <button
          className={getButtonClassName("down") + " col-start-2 row-start-2"}
          onClick={onYDown}
        >
          <FiArrowDown className="text-gray-800" size={24} />
        </button>
        <button
          className={getButtonClassName("right") + " col-start-3 row-start-2"}
          onClick={onXUp}
        >
          <FiArrowRight className="text-gray-800" size={24} />
        </button>
      </div>
      <div className="flex justify-center items-center space-x-4 mb-4">
        <button className={getButtonClassName("page-up")} onClick={onZUp}>
          Up
        </button>
        <button className={getButtonClassName("page-down")} onClick={onZDown}>
          Down
        </button>
      </div>
    </div>
  );
};

export default MovementControl;
