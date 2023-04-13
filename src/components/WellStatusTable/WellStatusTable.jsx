// WellStatusTable.jsx


import React, { useRef, useEffect } from 'react';



const WellStatusTable = ({ selectedWells, dispensingWell, completedWells }) => {
  
  const getStatus = (well) => {
    if (completedWells.includes(well.wellId)) {
      return (
        <span className="inline-flex items-center">
          <i className="fas fa-check-circle text-green-500 mr-1"></i> Complete
        </span>
      );
    } else if (well.wellId === dispensingWell) {
      return (
        <span className="inline-flex items-center">
          <i className="fas fa-circle text-yellow-500 mr-1"></i> Dispensing
        </span>
      );
    } else {
      return "-";
    }
  };
  
const dispensingWellRef = useRef(null);

useEffect(() => {
  if (dispensingWellRef.current && dispensingWell) {
    const parentDiv = dispensingWellRef.current.parentNode.parentNode.parentNode;
    const offsetTop = dispensingWellRef.current.offsetTop;
    const parentDivHeight = parentDiv.offsetHeight;
    const rowHeight = dispensingWellRef.current.offsetHeight;

    parentDiv.scrollTop = offsetTop - parentDivHeight / 2 + rowHeight / 2;
  }
}, [dispensingWell, selectedWells, completedWells]);



  return (
    <div className='w-full h-full overflow-x-hidden overflow-y-auto'>
    <table className="w-full table-auto border-collapse border border-gray-300 rounded-lg overflow-hidden">
<thead>
  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
    <th className="py-3 px-2 border-b border-gray-200 font-semibold text-left">Well ID</th>
    <th className="py-3 px-2 border-b border-gray-200 font-semibold text-left">Volume</th>
    <th className="py-3 px-2 border-b border-gray-200 font-semibold text-left w-32">Status</th>
  </tr>
</thead>

<tbody className="table-tbody-scroll text-gray-600 text-sm font-light ">
      {selectedWells.map((well, index) => (
  <tr
    key={well.wellId}
    ref={well.wellId === dispensingWell ? dispensingWellRef : null}
    className={index % 2 === 0 ? 'bg-gray-50' : ''}
  >
    <td className="py-2 px-2 border-b border-gray-200">{well.wellId}</td>
    <td className="py-2 px-2 border-b border-gray-200">{well.volume} μL</td>
    <td className="py-2 px-2 border-b border-gray-200">{getStatus(well)}</td>
  </tr>
))}

    </tbody>
    </table>
    </div>
  );
};

export default WellStatusTable;

