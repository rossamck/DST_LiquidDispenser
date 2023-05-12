// MovementContro.jsx

import React, { useState, useEffect, useCallback, useContext } from "react";
import { WebSocketContext } from "../WebSocketContext/WebSocketContext";
import "./MovementControl.css"; // Import your CSS file here
import Tabs from "./Tabs";
import LimitTab from "./LimitTab";
import AxisContext from "../../AxisContext";

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
  onPipUp,
  onPipDown,
  onButtonPressCountsUpdate,
  onAxesNetValuesUpdate,
  receivedCoords,
}) => {
  const { sendMessage } = useContext(WebSocketContext);
  const axisLimits = useContext(AxisContext);
  const [warningMessage, setWarningMessage] = useState(null);



  const [activeButton, setActiveButton] = useState(null);
  const [customValue, setCustomValue] = useState(1);
  const [isMoving, setIsMoving] = useState(false);
  const [initialCoordsReceived, setInitialCoordsReceived] = useState(false);




  // Inside MovementControl component, add these new state variables
  const [buttonPressCounts, setButtonPressCounts] = useState({
    up: 0, // y up
    down: 0, // y down
    left: 0, // x down
    right: 0, //x up
    pageUp: 0, //z down
    pageDown: 0, //z up
    pipUp: 0,
    pipDown: 0,
  });

  const [axesNetValues, setAxesNetValues] = useState({
    X: 0,
    Y: 0,
    Z: 0,
    PIP: 0,
  });

  useEffect(() => {
    onButtonPressCountsUpdate(buttonPressCounts);
  }, [buttonPressCounts, onButtonPressCountsUpdate]);

  useEffect(() => {
    onAxesNetValuesUpdate(axesNetValues);
  }, [axesNetValues, onAxesNetValuesUpdate]);


  useEffect(() => {
    if (!initialCoordsReceived && receivedCoords) {
      setAxesNetValues({
        X: receivedCoords.xPos,
        Y: receivedCoords.yPos,
        Z: receivedCoords.zPos,
        PIP: receivedCoords.pipVal,
      });
      setInitialCoordsReceived(true);
    }
  }, [initialCoordsReceived, receivedCoords]);

  useEffect(() => {
    if (
      initialCoordsReceived &&
      receivedCoords &&
      receivedCoords.xPos === axesNetValues.X &&
      receivedCoords.yPos === axesNetValues.Y &&
      receivedCoords.zPos === axesNetValues.Z &&
      receivedCoords.pipVal === axesNetValues.PIP
    ) {
      setIsMoving(false);
    }
  }, [receivedCoords, axesNetValues, initialCoordsReceived]);

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
        const axisLimit = axisLimits[axis.toLowerCase()];

        if (newValue > axisLimit.max || newValue < axisLimit.min) {
          setWarningMessage(`The new value exceeds the ${axis} axis limits.`);
          return prevValues;
        }

        setWarningMessage(null); // Clear the warning message if the value is within limits

        sendMessage(`manualMove:${axis},${newValue}`);
        setIsMoving(true);
        return {
          ...prevValues,
          [axis]: newValue,
        };
      });
    },
    [customValue, sendMessage, axisLimits]
  );


  const resetButtonPressCounts = () => {
    setButtonPressCounts({
      up: 0,
      down: 0,
      left: 0,
      right: 0,
      pageUp: 0,
      pageDown: 0,
      pipUp: 0,
      pipDown: 0,
    });
  };

  const resetCounters = () => {
    resetButtonPressCounts();
    sendMessage(`manualCoords:0,0`);  // Moves X and Y to 0
    setIsMoving(true);
    setAxesNetValues(prevValues => ({
      ...prevValues,
      X: 0,
      Y: 0,
    }));
    sendMessage("resetCounter");
  };
  

  const moveToLimit = (axis) => {
    // Implement the moveToLimit functionality here
    console.log("move to limit");
    console.log(axis);
    sendMessage(`moveToLimit:${axis}`);
  };

  const [xCoordinate, setXCoordinate] = useState(0);
  const [yCoordinate, setYCoordinate] = useState(0);

  // Implement the function to handle the submission of coordinates
  const handleCoordinateSubmit = () => {
    console.log(`Moving to coordinates X: ${xCoordinate}, Y: ${yCoordinate}`);
    sendMessage(`manualCoords:${xCoordinate},${yCoordinate}`);
    setIsMoving(true);
    // Set the axes net values directly to the submitted coordinates
    setAxesNetValues((prevValues) => ({
      ...prevValues,
      X: xCoordinate,
      Y: yCoordinate,
    }));
  };

  const [activeTab, setActiveTab] = useState(0);
  const handleTabSelect = (index) => {
    setActiveTab(index);
  };

  const tabs = [
    {
      label: "Limit",
      content: <LimitTab moveToLimit={moveToLimit} isMoving={isMoving} />,
      margin: "ml-2",
    },
    {
      label: "Co-ords",
      content: (
        <div className="text-center mt-4">
          <h2 className="text-white mb-2">Co-ordinate Entry</h2>

          <div className="flex justify-center flex-col">
            <div className="flex justify-center items-center mb-4">
              <div className="flex items-center">
                <label htmlFor="xCoordinate" className="mr-2 text-white">
                  X:
                </label>
                <input
                  type="number"
                  id="xCoordinate"
                  value={xCoordinate}
                  onChange={(e) =>
                    setXCoordinate(
                      e.target.value === "" ? "" : parseInt(e.target.value) || 0
                    )
                  }
                  disabled={isMoving}
                  className="border border-gray-300 p-1 rounded w-16"
                />
              </div>
              <div className="flex items-center ml-4">
                <label htmlFor="yCoordinate" className="mr-2 text-white">
                  Y:
                </label>
                <input
                  type="number"
                  id="yCoordinate"
                  value={yCoordinate}
                  onChange={(e) =>
                    setYCoordinate(
                      e.target.value === "" ? "" : parseInt(e.target.value) || 0
                    )
                  }
                  disabled={isMoving}
                  className="border border-gray-300 p-1 rounded w-16"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="mt-4 p-2 w-24 rounded bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 focus:outline-none"
                onClick={handleCoordinateSubmit}
                disabled={isMoving}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      ),
      margin: "mx-auto",
    },

    {
      label: "Tab 3",
      content: <div>Tab 3 content goes here</div>,
      margin: "mr-2",
    },
  ];

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
    updateAxesNetValues("Y", -1);
  }, [onYUp, updateAxesNetValues]);

  const wrappedOnYDown = useCallback(() => {
    onYDown();
    incrementButtonPressCount("down");
    updateAxesNetValues("Y", 1);
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

  const wrappedOnPIPUp = useCallback(() => {
    onPipUp();
    incrementButtonPressCount("pipUp");
    updateAxesNetValues("PIP", 1);
  }, [onPipUp, updateAxesNetValues]);

  const wrappedOnPIPDown = useCallback(() => {
    onPipDown();
    incrementButtonPressCount("pipDown");
    updateAxesNetValues("PIP", -1);
  }, [onPipDown, updateAxesNetValues]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isMoving) return; // Add this line
  
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
        case "w":
          wrappedOnPIPUp();
          setActiveButton("pip-up");
          break;
        case "s":
          wrappedOnPIPDown();
          setActiveButton("pip-down");
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
    wrappedOnPIPUp,
    wrappedOnPIPDown,
    isMoving,
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
          disabled={isMoving}
        >
          <FiArrowUp className="text-gray-800" size={24} />
        </button>
        <button
          title="X Decrease"
          className={getButtonClassName("left") + " col-start-1 row-start-2"}
          onClick={wrappedOnXDown}
          disabled={isMoving}
        >
          <FiArrowLeft className="text-gray-800" size={24} />
        </button>
        <button
          title="Y Decrease"
          className={getButtonClassName("down") + " col-start-2 row-start-2"}
          onClick={wrappedOnYDown}
          disabled={isMoving}
        >
          <FiArrowDown className="text-gray-800" size={24} />
        </button>
        <button
          title="X Increase"
          className={getButtonClassName("right") + " col-start-3 row-start-2"}
          onClick={wrappedOnXUp}
          disabled={isMoving}
        >
          <FiArrowRight className="text-gray-800" size={24} />
        </button>
        <button
          title="Move Up (Z-axis)"
          className={getButtonClassName("page-up")}
          onClick={wrappedOnZUp}
          disabled={isMoving}
        >
          Up
        </button>
        <button
          title="Move Down (Z-axis)"
          className={getButtonClassName("page-down")}
          onClick={wrappedOnZDown}
          disabled={isMoving}
        >
          Down
        </button>
        <button
          title="PIP Increase"
          className={getButtonClassName("pip-up")}
          onClick={wrappedOnPIPUp}
          disabled={isMoving}
        >
          PIP Up
        </button>
        <button
          title="PIP Decrease"
          className={getButtonClassName("pip-down")}
          onClick={wrappedOnPIPDown}
          disabled={isMoving}
        >
          PIP Down
        </button>
      </div>
      {warningMessage && (
        <div className="text-red-500">{warningMessage}</div>
      )}
      <div className="mt-4">
        <div className="mb-4">
          <label htmlFor="customValue" className="mr-2 text-white">
            Multiplier:
          </label>
          <input
            type="number"
            id="customValue"
            value={customValue}
            onChange={(e) =>
              setCustomValue(
                e.target.value === "" ? "" : parseInt(e.target.value) || 1
              )
            }
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
            disabled={isMoving}
            className="border border-gray-300 p-1 rounded"
          />
        </div>
        <div className="flex justify-center">
          <button
            className="mt-4 p-2 w-24 rounded bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 mr-2 mb-5 focus:outline-none reset-button"
            onClick={() => {
              resetCounters();
            }}
            disabled={isMoving}
          >
            Reset
          </button>
          <button
            className="mt-4 p-2 w-24 rounded bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 ml-2 mb-5 focus:outline-none"
            onClick={() => {
              sendMessage("setHome");
            }}
            disabled={isMoving}
          >
            Set Home
          </button>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          handleTabSelect={handleTabSelect}
        />
      </div>
    </div>
  );
};

export default MovementControl;
