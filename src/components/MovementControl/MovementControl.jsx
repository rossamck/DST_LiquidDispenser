import React, { useState, useEffect, useCallback } from "react";
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

  // Inside MovementControl component, add these new state variables
  const [buttonPressCounts, setButtonPressCounts] = useState({
    up: 0,
    down: 0,
    left: 0,
    right: 0,
    pageUp: 0,
    pageDown: 0,
  });

  const incrementButtonPressCount = (buttonName) => {
    setButtonPressCounts((prevCounts) => ({
      ...prevCounts,
      [buttonName]: prevCounts[buttonName] + 1,
    }));
  };

  const resetButtonPressCounts = () => {
    setButtonPressCounts({
      up: 0,
      down: 0,
      left: 0,
      right: 0,
      pageUp: 0,
      pageDown: 0,
    });
  };

  const wrappedOnXUp = useCallback(() => {
    onXUp();
    incrementButtonPressCount("right");
  }, [onXUp]);

  const wrappedOnXDown = useCallback(() => {
    onXDown();
    incrementButtonPressCount("left");
  }, [onXDown]);

  const wrappedOnYUp = useCallback(() => {
    onYUp();
    incrementButtonPressCount("up");
  }, [onYUp]);

  const wrappedOnYDown = useCallback(() => {
    onYDown();
    incrementButtonPressCount("down");
  }, [onYDown]);

  const wrappedOnZUp = useCallback(() => {
    onZUp();
    incrementButtonPressCount("pageUp");
  }, [onZUp]);

  const wrappedOnZDown = useCallback(() => {
    onZDown();
    incrementButtonPressCount("pageDown");
  }, [onZDown]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowUp":
          wrappedOnYUp();
          setActiveButton("up");
          break;
        case "ArrowDown":
          wrappedOnYDown();
          setActiveButton("down");
          break;
        case "ArrowLeft":
          wrappedOnXDown();
          setActiveButton("left");
          break;
        case "ArrowRight":
          wrappedOnXUp();
          setActiveButton("right");
          break;
        case "PageUp":
          wrappedOnZUp();
          setActiveButton("page-up");
          break;
        case "PageDown":
          wrappedOnZDown();
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
  }, [wrappedOnXUp, wrappedOnXDown, wrappedOnYUp, wrappedOnYDown, wrappedOnZUp, wrappedOnZDown]);

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
          onClick={wrappedOnYUp}
        >
          <FiArrowUp className="text-gray-800" size={24} />
        </button>
        <button
          className={getButtonClassName("left") + " col-start-1 row-start-2"}
          onClick={wrappedOnXDown}
        >
          <FiArrowLeft className="text-gray-800" size={24} />
        </button>
        <button
          className={getButtonClassName("down") + " col-start-2 row-start-2"}
          onClick={wrappedOnYDown}
        >
          <FiArrowDown className="text-gray-800" size={24} />
        </button>
        <button
          className={getButtonClassName("right") + " col-start-3 row-start-2"}
          onClick={wrappedOnXUp}
        >
          <FiArrowRight className="text-gray-800" size={24} />
        </button>
      </div>
      <div className="flex justify-center items-center space-x-4 mb-4">
        <button className={getButtonClassName("page-up")} onClick={wrappedOnZUp}>
          Up
        </button>
        <button className={getButtonClassName("page-down")} onClick={wrappedOnZDown}>
          Down
        </button>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Button Press Counts:</h2>
        <ul>
          {Object.entries(buttonPressCounts).map(([key, count]) => (
            <li key={key} className="list-disc ml-6">
              {key.charAt(0).toUpperCase() + key.slice(1)}: {count}
            </li>
          ))}
        </ul>
        <div className="flex justify-center">
          <button
            className="mt-4 p-2 w-24 rounded bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 focus:outline-none reset-button"
            onClick={resetButtonPressCounts}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovementControl;
