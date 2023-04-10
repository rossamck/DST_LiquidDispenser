import React from 'react';
import WellPlate from '../../components/WellPlate/WellPlate';

const Content = ({ sidebarOpen, currentAction, actionVersion, onActionComplete }) => {
    const contentStyle = {
        marginLeft: sidebarOpen ? '16rem' : '0',
        width: sidebarOpen ? 'calc(100% - 16rem)' : '100%',
        transition: 'margin-left 500ms ease, width 500ms ease',
    };

    return (
        <div
            id="content"
            className="col-span-9 bg-blue-300 h-[calc(100vh-3.75rem)] p-4"
            style={contentStyle}
        >
            Content
            <WellPlate currentAction={currentAction} actionVersion={actionVersion} onActionComplete={onActionComplete} />
        </div>
    );
};

export default Content;
