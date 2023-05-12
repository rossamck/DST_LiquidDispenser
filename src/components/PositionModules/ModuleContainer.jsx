import React, { useState, useEffect } from "react";
import DraggableModule from "./DraggableModule";
import DroppableSlot from "./DroppableSlot";

const ModuleContainer = ( { resetPositions, setResetPositions } ) => {
  const [modules] = useState([
    { id: 1, name: "Well Plate" },
    { id: 2, name: "Module 2" },
    { id: 3, name: "Module 3" },
    { id: 4, name: "Module 4" },
    // ...
  ]);

  const [slots, setSlots] = useState(Array(4).fill([]));

  const handleDrop = (moduleId, slotId) => {
    setSlots(prevSlots => {
      const newSlots = [...prevSlots];
      newSlots[slotId] = [{ id: moduleId, isFilled: true }];
      return newSlots;
    });
  };
  
  // Listen for changes in `resetPositions`
  useEffect(() => {
    if (resetPositions) {
      // Reset slots
      setSlots(Array(4).fill([]));
      
      // Reset the `resetPositions` state back to false
      setResetPositions(false);
    }
  }, [resetPositions, setResetPositions]);

  return (
    <div className="mx-4">
      <div className="grid grid-cols-4 gap-10">
        {modules.map((module) => (
          <DraggableModule key={module.id} {...module} />
        ))}
      </div>
      <div className="flex flex-col items-center gap-10 pt-10">
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
          {/* Add the smaller rectangle here */}
          <div className="rounded border border-gray-500 w-12 h-100px m-4"></div>
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
  );
};

export default ModuleContainer;
