import React from 'react';
import clsx from 'clsx';

const Tabs = ({ tabs, activeTab, handleTabSelect }) => {
  return (
    <>
      <div className="flex mx-2 mt-2 rounded-md bg-gray-800 relative tabs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabSelect(index)}
            className={clsx(
              "tabs-item custom-tab-width relative z-10 flex items-center justify-center py-1 my-2 text-center rounded-md text-sm cursor-pointer select-none focus:outline-none text-white",
              {
                active: activeTab === index,
                [tab.margin]: true,
              }
            )}
          >
            {tab.label}
          </button>
        ))}
        <div className={clsx("tab-item-animate", { active: activeTab !== -1 })}></div>
      </div>

      <div className="mt-2">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={clsx("tab-content", {
                hidden: activeTab !== index,
              })}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </>
  );
};

export default Tabs;
