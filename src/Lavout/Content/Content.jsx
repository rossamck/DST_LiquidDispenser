import React from 'react';
import WellPlate from '../../components/WellPlate/WellPlate';

const Content = ({ currentAction, actionVersion, onActionComplete }) => {
    return (
        <div
            id="content"
            className="col-span-8 bg-blue-300 h-[calc(100vh-3.75rem)] p-4" 
        >
            Content
            <WellPlate currentAction={currentAction} actionVersion={actionVersion} onActionComplete={onActionComplete} />
        </div>
    );
};

export default Content;
