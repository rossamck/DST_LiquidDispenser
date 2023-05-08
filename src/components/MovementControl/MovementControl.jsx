// MovementContro.jsx

import React, { useState, useEffect, useCallback, useContext } from "react";
import { WebSocketContext } from "../WebSocketContext/WebSocketContext";

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
  onButtonPressCountsUpdate,
  onAxesNetValuesUpdate,
}) => {
  const { sendMessage } = useContext(WebSocketContext);

  const [activeButton, setActiveButton] = useState(null);
  const [customValue, setCustomValue] = useState(1);

  // Inside MovementControl component, add these new state variables
  const [buttonPressCounts, setButtonPressCounts] = useState({
    up: 0,
    down: 0,
    left: 0,
    right: 0,
    pageUp: 0,
    pageDown: 0,
  });

  const [axesNetValues, setAxesNetValues] = useState({
    X: 0,
    Y: 0,
    Z: 0,
  });

  useEffect(() => {
    onButtonPressCountsUpdate(buttonPressCounts);
  }, [buttonPressCounts, onButtonPressCountsUpdate]);

  useEffect(() => {
    onAxesNetValuesUpdate(axesNetValues);
  }, [axesNetValues, onAxesNetValuesUpdate]);

  const incrementButtonPressCount = (buttonName) => {
    setButtonPressCounts((prevCounts) => ({
      ...prevCounts,
      [buttonName]: prevCounts[buttonName] + 1,
    }));
  };

  const updateAxesNetValues = useCallback(
    (axis, delta) => {
      setAxesNetValues((prevValues) => {
        const newValue = prevValues[axis] + delta * customValue;
        sendMessage(`manualMove:${axis},${newValue}`);
        return {
          ...prevValues,
          [axis]: newValue,
        };
      });
    },
    [customValue, sendMessage]
  );

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

  const resetAxesNetValues = () => {
    setAxesNetValues({
      X: 0,
      Y: 0,
      Z: 0,
    });
  };

  const moveToLimit = (axis) => {
    // Implement the moveToLimit functionality here
    console.log("move to limit");
    console.log(axis);
    sendMessage(`moveToLimit:${axis}`);

  };

  const wrappedOnXUp = useCallback(() => {
    onXUp();
    incrementButtonPressCount("right");
    updateAxesNetValues("X", 1);
  }, [onXUp, updateAxesNetValues]);

  const wrappedOnXDown = useCallback(() => {
    onXDown();
    incrementButtonPressCount("left");
    updateAxesNetValues("X", -1);
  }, [onXDown, updateAxesNetValues]);

  const wrappedOnYUp = useCallback(() => {
    onYUp();
    incrementButtonPressCount("up");
    updateAxesNetValues("Y", 1);
  }, [onYUp, updateAxesNetValues]);

  const wrappedOnYDown = useCallback(() => {
    onYDown();
    incrementButtonPressCount("down");
    updateAxesNetValues("Y", -1);
  }, [onYDown, updateAxesNetValues]);

  const wrappedOnZUp = useCallback(() => {
    onZUp();
    incrementButtonPressCount("pageUp");
    updateAxesNetValues("Z", 1);
  }, [onZUp, updateAxesNetValues]);

  const wrappedOnZDown = useCallback(() => {
    onZDown();
    incrementButtonPressCount("pageDown");
    updateAxesNetValues("Z", -1);
  }, [onZDown, updateAxesNetValues]);

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
  }, [
    wrappedOnXUp,
    wrappedOnXDown,
    wrappedOnYUp,
    wrappedOnYDown,
    wrappedOnZUp,
    wrappedOnZDown,
  ]);

  const getButtonClassName = (name) => {
    const baseClassName =
      "rounded-full p-2 bg-gray-300 hover:bg-gray-400 active:bg-gray-500 focus:outline-none flex justify-center items-center";
    if (name === activeButton) {
      return `${baseClassName} bg-gray-500 text-gray-100`;
    }
    return `${baseClassName} text-gray-800`;
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <div className="grid grid-cols-3 grid-rows-2 gap-4 mb-4">
        <button
          title="Y Increase"
          className={getButtonClassName("up") + " col-start-2 row-start-1"}
          onClick={wrappedOnYUp}
        >
          <FiArrowUp className="text-gray-800" size={24} />
        </button>
        <button
          title="X Decrease"
          className={getButtonClassName("left") + " col-start-1 row-start-2"}
          onClick={wrappedOnXDown}
        >
          <FiArrowLeft className="text-gray-800" size={24} />
        </button>
        <button
          title="Y Decrease"
          className={getButtonClassName("down") + " col-start-2 row-start-2"}
          onClick={wrappedOnYDown}
        >
          <FiArrowDown className="text-gray-800" size={24} />
        </button>
        <button
          title="X Increase"
          className={getButtonClassName("right") + " col-start-3 row-start-2"}
          onClick={wrappedOnXUp}
        >
          <FiArrowRight className="text-gray-800" size={24} />
        </button>
        <button
          title="Move Up (Z-axis)"
          className={getButtonClassName("page-up")}
          onClick={wrappedOnZUp}
        >
          Up
        </button>
        <button
          title="Move Down (Z-axis)"
          className={getButtonClassName("page-down")}
          onClick={wrappedOnZDown}
        >
          Down
        </button>
      </div>
      <div className="mt-4">
        <div className="mb-4">
          <label htmlFor="customValue" className="mr-2 text-white">
            Multiplier:
          </label>
          <input
            type="number"
            id="customValue"
            value={customValue}
            onChange={(e) => setCustomValue(parseInt(e.target.value) || 1)}
            onKeyDown={(e) => {
              if (
                e.key === "ArrowUp" ||
                e.key === "ArrowDown" ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight"
              ) {
                e.preventDefault();
              }
            }}
            className="border border-gray-300 p-1 rounded"
          />
        </div>
        <div className="flex justify-center">
          <button
            className="mt-4 p-2 w-24 rounded bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 focus:outline-none reset-button"
            onClick={() => {
              resetButtonPressCounts();
              resetAxesNetValues();
            }}
          >
            Reset
          </button>
        </div>
        <div className="text-center mt-4">
          <h2 className="text-white mb-2">Move to limit</h2>
          <div className="flex justify-center space-x-4">
            <button
              className="p-2 w-12 rounded bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 focus:outline-none"
              onClick={() => moveToLimit("X")}
            >
              X
            </button>
            <button
              className="p-2 w-12 rounded bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 focus:outline-none"
              onClick={() => moveToLimit("Y")}
            >
              Y
            </button>
            <button
              className="p-2 w-12 rounded bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 focus:outline-none"
              onClick={() => moveToLimit("Z")}
            >
              Z
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovementControl;
