import React from 'react';
import { MdHome, MdBuild, MdStar } from 'react-icons/md';
import { FaRegObjectUngroup } from "react-icons/fa";


function SidebarIcons({ sidebarOpen, handleButtonClick }) {
  return (
    <div
      className={`fixed top-16 left-0.5 mt-11 mb-2 z-20 transition-all duration-500 ${
        sidebarOpen ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', marginLeft: '10px' }}
    >
      <button
        className={`text-gray-400 block hover:text-white`}
        onClick={() => handleButtonClick('Layout1')}
        title="Home"
      >
        <MdHome className="inline" size={36} />
      </button>
      <button
        className={`text-gray-400 block hover:text-white`}
        onClick={() => handleButtonClick('Layout2')}
        title="Option 2"
      >
        <FaRegObjectUngroup className="inline" size={36} />
      </button>
      <button
        className={`text-gray-400 block hover:text-white`}
        onClick={() => handleButtonClick('Layout3')}
        title="Option 3"
      >
        <MdStar className="inline" size={36} />
      </button>
      <button
        className={`text-gray-400 block hover:text-white`}
        onClick={() => handleButtonClick('DevLayout')}
        title="Developer Tools"
      >
        <MdBuild className="inline" size={36} />
      </button>
    </div>
  );
}

export default SidebarIcons;
