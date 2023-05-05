import React from "react";

const LiquidSource = ({ onSelect, colourIndexPairs, wellPlateWidth, selectedColorIndex }) => {
    return (
      <div className="flex justify-around" style={{ width: wellPlateWidth }}>
        {colourIndexPairs.map(({ color, index }) => (
          <button
            key={index}
            className={`w-12 h-12 rounded-full shadow ${
              selectedColorIndex?.index === index ? "border-4 border-black" : ""
            } ${color}`}
            onClick={() => onSelect(index)}
          >
            <span className="text-black font-bold">{index}</span>
          </button>
        ))}
      </div>
    );
  };
  
  

export default LiquidSource;