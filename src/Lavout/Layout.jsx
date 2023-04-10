import React, { useState } from 'react';
import Navbar from './Navbar/Navbar';
import SidePanel from './SidePanel/SidePanel';
import Content from './Content/Content';
import InfoPanel from './InfoPanel/InfoPanel';
import StatusIndicator from './StatusIndicator/StatusIndicator';

const Layout = ({ onButtonClick, currentAction, actionVersion, onActionComplete }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="relative h-full">
            <div className="flex flex-col h-full">
                <div className="grid grid-cols-12 gap-2 w-full flex-grow bg-red-300">
                    <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
                    <Content sidebarOpen={sidebarOpen} currentAction={currentAction} actionVersion={actionVersion} onActionComplete={onActionComplete} />
                    <div className="col-span-3">
                        <SidePanel onButtonClick={onButtonClick} />
                        <InfoPanel />
                    </div>
                </div>
            </div>
            <StatusIndicator />
        </div>
    )
}

export default Layout;
