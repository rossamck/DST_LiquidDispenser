import React from 'react';
import packageJson from '../../../package.json';

const Navbar = ({ sidebarOpen }) => {
  const navbarStyle = {
    marginLeft: sidebarOpen ? '16rem' : '4rem',
    width: sidebarOpen ? 'calc(100% - 16rem)' : 'calc(100% - 4rem)',
    transition: 'margin-left 500ms ease, width 500ms ease',
  };

  const versionNumber = packageJson.version;

  return (
    <div
      id="navbar"
      className="col-span-12 h-[3.75rem] bg-gray-700 px-4 flex items-center"
      style={navbarStyle}
    >
      <Title versionNumber={versionNumber} />
    </div>
  );
};

const Title = ({ versionNumber }) => (
  <h5 className="title-text text-white">
    Liquid Dispenser Client <span className="version-number">({versionNumber})</span>
  </h5>
);

export default Navbar;
