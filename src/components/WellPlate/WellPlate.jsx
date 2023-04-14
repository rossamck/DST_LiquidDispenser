// WellPlate.jsx 
import React, { useState, useEffect, useCallback } from 'react';


const Well = ({ selected, highlighted, label, volume, onMouseDown, onMouseEnter }) => {
  let backgroundColor = 'bg-white';
  if (selected) {
    backgroundColor = 'bg-green-300';
  } else if (highlighted) {
    backgroundColor = 'bg-blue-200';
  }

  return (
    <div
      className={`w-12 h-12 border border-gray-300 flex flex-col justify-center items-center m-0 select-none rounded-full shadow ${backgroundColor}`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
    >
      {label}
      {volume && <span className="text-xs">{volume} μL</span>}
    </div>
  );
};

const WellPlate = ({
  currentAction,
  actionVersion,
  onActionComplete,
  actionVolume,
  allSelectedWells,
  setAllSelectedWells,
  onWellPlateUpdate,
  setCompletedWells,
  setDispensingWell,
  
}) => {

  const [highlightedWells, setHighlightedWells] = useState(new Set());
  const [isMouseDown, setIsMouseDown] = useState(false);

  const [selectedWells, setSelectedWells] = useState(new Set());
  // const [selectedWellLabels, setSelectedWellLabels] = useState([]);
  const [selectedVolumes, setSelectedVolumes] = useState({});

  const selectWells = useCallback(() => {
    if (!actionVolume) {
      alert('Please enter a volume before selecting wells.');
      return;
    }
  
    setSelectedWells((prev) => {
      const newSelected = new Set(prev);
      highlightedWells.forEach((well) => newSelected.add(well));
      return newSelected;
    });
  
    setSelectedVolumes((prev) => {
      const newSelectedVolumes = { ...prev };
      highlightedWells.forEach((well) => (newSelectedVolumes[well] = actionVolume));
      return newSelectedVolumes;
    });
  
    setAllSelectedWells((prev) => {
      const newSelectedWells = Array.from(highlightedWells).map((well) => ({
        wellId: well,
        volume: selectedVolumes[well] || actionVolume,
      }));
    
      const mergedWells = [...prev, ...newSelectedWells];
      const deduplicatedWells = mergedWells.filter(
        (well, index, self) =>
          index === self.findIndex((w) => w.wellId === well.wellId)
      );
    
      // Sort the deduplicatedWells array alphanumerically
      const sortedWells = deduplicatedWells.sort((a, b) => {
        const rowA = a.wellId.charAt(0);
        const rowB = b.wellId.charAt(0);
        const colA = parseInt(a.wellId.slice(1), 10);
        const colB = parseInt(b.wellId.slice(1), 10);
    
        if (rowA === rowB) {
          return colA - colB;
        }
        return rowA.localeCompare(rowB);
      });
    
      return sortedWells;
    });
    
  
    setHighlightedWells(new Set());
  }, [actionVolume, highlightedWells, selectedVolumes, setAllSelectedWells]);
  


  const clearWells = useCallback(() => {
    setSelectedWells(new Set());
    setAllSelectedWells([]);

    setHighlightedWells(new Set());
    setSelectedVolumes({});
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
        case 'selectWellsButton':
          selectWells();
          break;
        case 'clearWellsButton':
          clearWells();
          break;
        case 'action3':
          console.log('Executing action3 tasks');
          break;
        default:
          console.log('Unknown action:', currentAction);
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

  const rows = 'ABCDEFGH';
  const cols = 12;

  return (
    <div
      className="flex flex-col items-center font-sans"
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div className="grid grid-cols-12 gap-0">
        {rows.split('').map((row) =>
          Array.from({ length: cols }, (_, i) => {
            const label = `${row}${i + 1}`;
            const selected = selectedWells.has(label);
            const highlighted = highlightedWells.has(label);
            const volume = selectedVolumes[label];
            return (
              <Well
                key={label}
                label={label}
                selected={selected}
                highlighted={highlighted}
                volume={volume}
                onMouseDown={() => onMouseDown(label)}
                onMouseEnter={() => onMouseEnter(label)}
              />
            );
          }),
        )}
      </div>
      <div>
      <div>

</div>


      </div>
    </div>
  );
};

export default WellPlate;
