import React from 'react';

const WellStatusTable = ({ selectedWells }) => {
  return (
    <table className="table-auto border-collapse border border-gray-300 rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
          <th className="py-3 px-2 border-b border-gray-200 font-semibold text-left">Well ID</th>
          <th className="py-3 px-2 border-b border-gray-200 font-semibold text-left">Volume</th>
          <th className="py-3 px-2 border-b border-gray-200 font-semibold text-left">Status</th>
        </tr>
      </thead>
      <tbody className="text-gray-600 text-sm font-light">
        {selectedWells.map((well, index) => (
          <tr key={well.wellId} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
            <td className="py-2 px-2 border-b border-gray-200">{well.wellId}</td>
            <td className="py-2 px-2 border-b border-gray-200">{well.volume} μL</td>
            <td className="py-2 px-2 border-b border-gray-200">{well.status || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WellStatusTable;
