import React from 'react';
import Navbar from './Navbar/Navbar';
import SidePanel from './SidePanel/SidePanel';
import Content from './Content/Content';

const Layout = ({ onButtonClick, currentAction, actionVersion, onActionComplete }) => {
    return (
        <div className="grid grid-cols-12 gap-2 w-full h-full bg-red-300">
            <Navbar />
            <Content currentAction={currentAction} actionVersion={actionVersion} onActionComplete={onActionComplete} />
            <SidePanel onButtonClick={onButtonClick} />
        </div>
    )
}

export default Layout;
