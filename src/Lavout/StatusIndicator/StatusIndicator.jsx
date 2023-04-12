// StatusIndicator.jsx

import React, { useContext } from 'react';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineExclamationCircle } from 'react-icons/ai';
import { WebSocketContext } from '../../components/WebSocketContext/WebSocketContext';

const StatusIndicator = () => {
    const { status } = useContext(WebSocketContext);

    const getStatusIndicator = () => {
        switch (status) {
            case 'connected':
                return (
                    <div className="flex items-center text-green-500">
                        <AiOutlineCheckCircle className="mr-2" />
                        Connected
                    </div>
                );
            case 'not_connected':
                return (
                    <div className="flex items-center text-red-500">
                        <AiOutlineCloseCircle className="mr-2" />
                        Not Connected
                    </div>
                );
            case 'error':
                return (
                    <div className="flex items-center text-orange-500">
                        <AiOutlineExclamationCircle className="mr-2" />
                        Error
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-900 p-2 h-8 w-full fixed bottom-0 left-0 flex items-center justify-left">
            {getStatusIndicator()}
        </div>
    );
};

export default StatusIndicator;