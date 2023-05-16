import React from "react";
import "./SourceColours.css"

const LiquidSource = ({ onSelect, colourIndexPairs, wellPlateWidth, selectedColorIndex, rows, cols }) => {
  const sourceButtons = colourIndexPairs.map(({ color, index }) => (
    <button
      key={index}
      className={`w-12 h-12 rounded-full shadow ${
        selectedColorIndex?.index === index ? "border-4 border-black" : ""
      } ${color}`}
      onClick={() => onSelect(index)}
    >
      <span className="text-black font-bold">{index}</span>
    </button>
  ));

  const sourceGrid = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const index = i * cols + j;
      if (index < sourceButtons.length) {
        row.push(sourceButtons[index]);
      }
    }
    sourceGrid.push(<div key={i} className="flex justify-center">{row}</div>);
  }

  return (
    <div className="flex flex-col justify-around" style={{ width: wellPlateWidth }}>
      {sourceGrid}
    </div>
  );
};

export default LiquidSource;
