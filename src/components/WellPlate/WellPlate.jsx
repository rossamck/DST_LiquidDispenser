import React, { useState, useEffect, useCallback } from 'react';


const Well = ({ selected, highlighted, label, onMouseDown, onMouseEnter }) => {
    let backgroundColor = 'bg-white';
    if (selected) {
      backgroundColor = 'bg-green-500';
    } else if (highlighted) {
      backgroundColor = 'bg-blue-200';
    }
  
    return (
      <div
        className={`w-10 h-10 border border-gray-300 flex justify-center items-center m-0 select-none ${backgroundColor}`}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
      >
        {label}
      </div>
    );
  };

  const WellPlate = ({ currentAction, actionVersion, onActionComplete }) => {
    const [highlightedWells, setHighlightedWells] = useState(new Set());
    const [selectedWells, setSelectedWells] = useState(new Set());
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [selectedWellLabels, setSelectedWellLabels] = useState([]);
  
    const selectWells = useCallback(() => {
      console.log("Test");
      setSelectedWells((prev) => {
        const newSelected = new Set(prev);
        highlightedWells.forEach((well) => newSelected.add(well));
        return newSelected;
      });
  
      const allSelectedWells = Array.from(selectedWells).concat(Array.from(highlightedWells));
  
      const sortedSelectedWells = allSelectedWells.sort((a, b) => {
        const rowA = a.charAt(0);
        const rowB = b.charAt(0);
        const colA = parseInt(a.slice(1), 10);
        const colB = parseInt(b.slice(1), 10);
  
        if (rowA === rowB) {
          return colA - colB;
        }
        return rowA.localeCompare(rowB);
      });
  
      setSelectedWellLabels(sortedSelectedWells);
      setHighlightedWells(new Set());
    }, [highlightedWells, selectedWells]);
  
    const clearWells = useCallback(() => {
      setSelectedWells(new Set());
      setSelectedWellLabels([]);
      setHighlightedWells(new Set());
    }, []);
  
    useEffect(() => {
        if (currentAction) {
          switch (currentAction) {
            case 'selectWellsButton':
              console.log('Executing selectwells tasks');
              selectWells();
              break;
            case 'clearWellsButton':
              console.log('Executing clearWellsButton tasks');
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
          newHighlighted.add(label);
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
        className="flex flex-col items-center"
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div className="grid grid-cols-12 gap-0">
          {rows.split('').map((row) =>
            Array.from({ length: cols }, (_, i) => {
              const label = `${row}${i + 1}`;
              const selected = selectedWells.has(label);
              const highlighted = highlightedWells.has(label);
              return (
                <Well
                  key={label}
                  label={label}
                  selected={selected}
                  highlighted={highlighted}
                  onMouseDown={() => onMouseDown(label)}
                  onMouseEnter={() => onMouseEnter(label)}
                />
              );
            }),
          )}
        </div>
        <div>
          <p>Selected
   wells: {selectedWellLabels.join(', ')}</p>
      </div>
    </div>
  );
};

export default WellPlate;