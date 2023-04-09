import React from 'react';
import ControlButtons from '../../components/ControlButtons/ControlButtons';

const SidePanel = ({ onButtonClick }) => {
    return (
        <aside
            id="content"
            className="col-span-4 bg-orange-300 p-4" 
        >
            <ControlButtons onButtonClick={onButtonClick} />
            Aside content
        </aside>
    );
};

export default SidePanel;
