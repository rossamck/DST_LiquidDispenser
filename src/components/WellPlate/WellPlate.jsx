// WellPlate.jsx
import React, { useState, useEffect, useCallback, useContext } from "react";
import ConfigContext from '../../context/ModuleConfigContext';

// import config from "../../configuration/ModuleConfig.json";


const Well = ({
  selected,
  highlighted,
  label,
  volume,
  onMouseDown,
  onMouseEnter,
  colourIndexPairs,
  allSelectedWells,
  sourceIndexHighlight,
  width,
}) => {
  let backgroundColor = "bg-white";

  const wellObj = allSelectedWells.find((well) => well.wellId === label);
  const sourceIndex = wellObj ? wellObj.sourceIndex : null;

  if (selected) {
    const colorObj = colourIndexPairs.find(
      (pair) => pair.index === sourceIndex
    );
    backgroundColor = colorObj ? `${colorObj.color}` : "bg-green-300";
  } else if (highlighted) {
    const colorObj = colourIndexPairs.find(
      (pair) => pair.index === sourceIndexHighlight
    );
    backgroundColor = colorObj ? `${colorObj.highlightedColor}` : "bg-blue-200";
  }

  return (
    <div
      style={{
        width: width,
        paddingTop: width,
        position: "relative",
      }}
      className={`border border-gray-300 m-0 select-none rounded-full ${backgroundColor}`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {label}
        {volume && <span className="text-xs">{volume} μL</span>}
      </div>
    </div>
  );
};

const WellPlate = ({
  activeWellPlate,
  currentAction,
  actionVersion,
  onActionComplete,
  actionVolume,
  allSelectedWells,
  setAllSelectedWells,
  onWellPlateUpdate,
  setCompletedWells,
  setDispensingWell,
  selectedColorIndex,
  colourIndexPairs,
  selectedPlateId,
}) => {
  const [highlightedWells, setHighlightedWells] = useState(new Set());
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectedSourceIndices, setSelectedSourceIndices] = useState({});

  const [selectedWells, setSelectedWells] = useState(new Set());
  // const [selectedWellLabels, setSelectedWellLabels] = useState([]);
  const [selectedVolumes, setSelectedVolumes] = useState({});
  const config = useContext(ConfigContext);

  const [plateConfig, setPlateConfig] = useState({});

  useEffect(() => {
    for (let plateType in config.data) {
      if (config.data[plateType].moduleId === activeWellPlate) {
        setPlateConfig(config.data[plateType]);
        console.log("Setting this plate: ", config.data[plateType]);
        break;
      }
    }
  }, [activeWellPlate, config]);
  

  const generateRows = (rowCount) => {
    const rowLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return rowLetters.slice(0, rowCount).split("");
  };

  const selectWells = useCallback(() => {
    if (!actionVolume) {
      alert("Please enter a volume before selecting wells.");
      return;
    }

    setSelectedWells((prev) => {
      const newSelected = new Set(prev);
      highlightedWells.forEach((well) => {
        newSelected.add(well);
        if (!selectedSourceIndices[well]) {
          setSelectedSourceIndices((prev) => ({
            ...prev,
            [well]: selectedColorIndex?.index,
          }));
        }
      });

      return newSelected;
    });

    setSelectedVolumes((prev) => {
      const newSelectedVolumes = { ...prev };
      highlightedWells.forEach(
        (well) => (newSelectedVolumes[well] = actionVolume)
      );
      return newSelectedVolumes;
    });

    setAllSelectedWells((prev) => {
      const newSelectedWells = Array.from(highlightedWells).map((well) => {
        // Compute the relative coordinates
        let relY = well.charCodeAt(0) - "A".charCodeAt(0); // Converting A, B, C, etc. to 0, 1, 2, etc.
        let relX = parseInt(well.slice(1)) - 1; // Converting 1, 2, 3, etc. to 0, 1, 2, etc.

        const stepSize = plateConfig.stepSize;

        // Apply the step size
        relX *= stepSize;
        relY *= stepSize;

        // If the plate is rotated, swap X and Y coordinates
        console.log("Selected PLATE ID");
        console.log(selectedPlateId);
        console.log("Source index = ", selectedColorIndex?.index)
        if (selectedPlateId === 2 || selectedPlateId === 3) {
          [relX, relY] = [relY, relX];
        }

        // Return the well object with the new properties
        return {
          wellId: well,
          volume: selectedVolumes[well] || actionVolume,
          sourceIndex: selectedColorIndex?.index,
          xCoord: relX,
          yCoord: relY,
        };
      });

      const mergedWells = [...prev, ...newSelectedWells];
      const deduplicatedWells = mergedWells.filter(
        (well, index, self) =>
          index === self.findIndex((w) => w.wellId === well.wellId)
      );

      // Sort the deduplicatedWells array alphanumerically
      const groupBySourceIndex = (array) => {
        return array.reduce((acc, well) => {
          if (!acc[well.sourceIndex]) {
            acc[well.sourceIndex] = [];
          }
          acc[well.sourceIndex].push(well);
          return acc;
        }, {});
      };

      const sortAlphanumerically = (a, b) => {
        const rowA = a.wellId.charAt(0);
        const rowB = b.wellId.charAt(0);
        const colA = parseInt(a.wellId.slice(1), 10);
        const colB = parseInt(b.wellId.slice(1), 10);

        if (rowA === rowB) {
          return colA - colB;
        }
        return rowA.localeCompare(rowB);
      };

      const groupedWells = groupBySourceIndex(deduplicatedWells);
      const sortedWells = [];

      Object.values(groupedWells).forEach((group) => {
        const sortedGroup = group.sort(sortAlphanumerically);
        sortedWells.push(...sortedGroup);
      });

      return sortedWells;
    });

    setHighlightedWells(new Set());
  }, [
    actionVolume,
    highlightedWells,
    selectedVolumes,
    setAllSelectedWells,
    selectedColorIndex,
    selectedSourceIndices,
    selectedPlateId,
    plateConfig.stepSize,
  ]);

  const clearWells = useCallback(() => {
    setSelectedWells(new Set());
    setAllSelectedWells([]);

    setHighlightedWells(new Set());
    setSelectedVolumes({});
    setSelectedSourceIndices({}); // Add this line to clear the selectedSourceIndices
    setCompletedWells([]);
    setDispensingWell(null);
  }, [setAllSelectedWells, setCompletedWells, setDispensingWell]);

  // Add this useEffect block
  useEffect(() => {
    onWellPlateUpdate(selectedWells);
  }, [selectedWells, onWellPlateUpdate]);

  useEffect(() => {
    const newSelectedWells = new Set();
    const newSelectedVolumes = {};

    allSelectedWells.forEach((well) => {
      newSelectedWells.add(well.wellId);
      newSelectedVolumes[well.wellId] = well.volume;
    });

    setSelectedWells(newSelectedWells);
    setSelectedVolumes(newSelectedVolumes);
  }, [allSelectedWells]);

  useEffect(() => {
    if (currentAction) {
      switch (currentAction) {
        case "selectWellsButton":
          selectWells();
          break;
        case "clearWellsButton":
          clearWells();
          break;
        case "action3":
          console.log("Executing action3 tasks");
          break;
        default:
          console.log("Unknown action:", currentAction);
      }
      onActionComplete();
    }
  }, [currentAction, actionVersion, selectWells, clearWells, onActionComplete]);

  const onMouseDown = (label) => {
    setIsMouseDown(true);
    if (!selectedWells.has(label)) {
      setHighlightedWells((prev) => {
        const newHighlighted = new Set(prev);
        if (newHighlighted.has(label)) {
          newHighlighted.delete(label); // Unhighlight the well if it's already highlighted
        } else {
          newHighlighted.add(label); // Highlight the well if it's not highlighted
        }
        return newHighlighted;
      });
    }
  };

  const onMouseEnter = (label) => {
    if (isMouseDown && !selectedWells.has(label)) {
      setHighlightedWells((prev) => {
        const newHighlighted = new Set(prev);
        newHighlighted.add(label);
        return newHighlighted;
      });
    }
  };

  const onMouseUp = () => {
    setIsMouseDown(false);
  };
  const { rows, cols } = plateConfig;
  const MAX_WELL_WIDTH = 150; // This could be the width of wells in the 96-well plate

  const wellWidth = Math.min(600 / cols, MAX_WELL_WIDTH);

  return (
    <div
      className="flex flex-col items-center font-sans"
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: "0px", // equivalent of Tailwind's gap-0
        }}
      >
        {generateRows(rows).map((row) =>
          Array.from({ length: cols }, (_, i) => {
            const label = `${row}${i + 1}`;
            const selected = selectedWells.has(label);
            const highlighted = highlightedWells.has(label);
            const volume = selectedVolumes[label];
            const sourceIndexHighlight =
              selectedSourceIndices[label] || selectedColorIndex?.index;

            return (
              <Well
                key={label}
                label={label}
                selected={selected}
                highlighted={highlighted}
                volume={volume}
                onMouseDown={() => onMouseDown(label)}
                onMouseEnter={() => onMouseEnter(label)}
                colourIndexPairs={colourIndexPairs}
                allSelectedWells={allSelectedWells}
                sourceIndexHighlight={sourceIndexHighlight}
                width={wellWidth}
              />
            );
          })
        )}
      </div>
      <div>
        <div></div>
      </div>
    </div>
  );
};

export default WellPlate;
