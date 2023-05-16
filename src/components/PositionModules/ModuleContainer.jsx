import React, { useState, useEffect, useContext } from "react";
import DraggableModule from "./DraggableModule";
import DroppableSlot from "./DroppableSlot";
import PositionsContext from "../../context/PositionsContext";
import ConfigContext from "../../context/ModuleConfigContext";


const ModuleContainer = ({
  resetPositions,
  setResetPositions,
  savePositions,
  setSavePositions,
}) => {
  const config = useContext(ConfigContext);

  const [modules, setModules] = useState([]);


  const [slots, setSlots] = useState(() => {
    const savedSlots = localStorage.getItem("slots");
    return savedSlots ? JSON.parse(savedSlots) : Array(4).fill([]);
  });

  const { setSavedPositions } = useContext(PositionsContext);

  useEffect(() => {
    const savedPositionsData = localStorage.getItem("savedPositions");
    if (savedPositionsData) {
      const savedPositions = JSON.parse(savedPositionsData);
      setSavedPositions(savedPositions);
    }
  }, [setSavedPositions]);

  
  useEffect(() => {
    // Set modules state from the ModuleConfig.json data
    setModules(Object.entries(config).filter(([name, moduleData]) => moduleData.showModule)
        .map(([name, moduleData]) => ({
      id: moduleData.moduleId,
      name: name,
      isWellPlate: moduleData.isWellPlate,
      // add any other properties you need from moduleData
    })));
  }, [config]);


  const handleDrop = (moduleId, slotId) => {
    setSlots((prevSlots) => {
      const newSlots = [...prevSlots];
      newSlots[slotId] = [{ id: moduleId, isFilled: true }];
      localStorage.setItem("slots", JSON.stringify(newSlots)); // save to localStorage
      return newSlots;
    });
  };

  useEffect(() => {
    if (resetPositions) {
      // Reset slots
      const emptySlots = Array(4).fill([]);
      setSlots(emptySlots);

      // Clear the slots from localStorage
      localStorage.setItem("slots", JSON.stringify(emptySlots));

      // Reset the `resetPositions` state back to false
      setResetPositions(false);

      // Reset savedPositions
      const emptySavedPositions = Array(4).fill({
        slotId: null,
        moduleId: null,
      });
      setSavedPositions(emptySavedPositions);
      localStorage.setItem(
        "savedPositions",
        JSON.stringify(emptySavedPositions)
      );
    }
  }, [resetPositions, setResetPositions, setSavedPositions]);

  useEffect(() => {
    if (savePositions) {
      const newSavedPositions = slots.map((slot, slotId) => {
        const moduleId = slot.length > 0 ? slot[0].id : null;
        return { slotId, moduleId };
      });

      setSavedPositions(newSavedPositions);
      localStorage.setItem("savedPositions", JSON.stringify(newSavedPositions)); // save to localStorage
      setSavePositions(false);
    }
  }, [savePositions, setSavePositions, setSavedPositions, slots]);

  return (
    <div className="mx-4 flex">
      <div style={{ width: "25%" }}>
      <h2 className="text-center">Modules</h2>

        {modules.map((module) => (
          
          <DraggableModule key={module.id} {...module} />
        ))}
      </div>
      <div style={{ width: "75%" }}>
        <div className="flex flex-col items-center gap-10 mt-10 -rotate-90">
          <div className="flex flex-row justify-center gap-x-4">
            {slots.slice(0, 1).map((slot, i) => (
              <DroppableSlot
                key={i}
                id={i}
                onDrop={handleDrop}
                isFilled={slot.length > 0}
                className={i === 1 ? "ml-auto" : ""}
              >
                {slot.map(({ id: moduleId }) => {
                  const module = modules.find((m) => m.id === moduleId);
                  return (
                    <DraggableModule
                      key={moduleId}
                      isDropped={true}
                      {...module}
                    />
                  );
                })}
              </DroppableSlot>
            ))}
            <div>
              <div>
                <div
                  className="m-2 w-6 ml mt-6 h-36 bg-gray-200 rounded border border-black"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0, 0, 0, 0.2) 10px, rgba(0, 0, 0, 0.2) 20px)",
                  }}
                ></div>
              </div>
            </div>
            {slots.slice(1, 2).map((slot, i) => (
              <DroppableSlot
                key={i + 1}
                id={i + 1}
                onDrop={handleDrop}
                isFilled={slot.length > 0}
                className={i === 1 ? "ml-auto" : ""}
              >
                {slot.map(({ id: moduleId }) => {
                  const module = modules.find((m) => m.id === moduleId);
                  return (
                    <DraggableModule
                      key={moduleId}
                      isDropped={true}
                      {...module}
                    />
                  );
                })}
              </DroppableSlot>
            ))}
          </div>
          <div className="flex flex-row justify-center gap-x-4">
            {slots.slice(2).map((slot, i) => (
              <DroppableSlot
                key={i + 2}
                id={i + 2}
                onDrop={handleDrop}
                isFilled={slot.length > 0}
              >
                {slot.map(({ id: moduleId }) => {
                  const module = modules.find((m) => m.id === moduleId);
                  return (
                    <DraggableModule
                      key={moduleId}
                      isDropped={true}
                      {...module}
                    />
                  );
                })}
              </DroppableSlot>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleContainer;
