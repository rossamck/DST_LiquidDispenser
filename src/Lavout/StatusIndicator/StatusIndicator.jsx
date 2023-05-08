import React, { useContext, useState, useEffect } from 'react';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineExclamationCircle } from 'react-icons/ai';
import { WebSocketContext } from '../../components/WebSocketContext/WebSocketContext';

const StatusIndicator = ({ sidebarOpen }) => {
  const { status } = useContext(WebSocketContext);
  const [ipAddress, setIpAddress] = useState(() => {
    return localStorage.getItem('userWebSocketIP') || null;
  });

  useEffect(() => {
    const onStorageChange = (event) => {
      if (event.key === 'userWebSocketIP') {
        setIpAddress(event.newValue);
      }
    };

    window.addEventListener('storage', onStorageChange);

    return () => {
      window.removeEventListener('storage', onStorageChange);
    };
  }, []);

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
    <div
      className="bg-gray-900 p-2 h-8 w-full fixed bottom-0 left-0 flex items-center justify-between"
      style={{
        marginLeft: sidebarOpen ? '16rem' : '0',
        paddingLeft: sidebarOpen ? '1rem' : '5rem', // Adjust the padding-left based on the sidebarOpen prop
        transition: 'margin-left 500ms ease, padding-left 500ms ease',
      }}
    >
      {getStatusIndicator()}
      {ipAddress && (
        <div className="text-white">
          IP Address: {ipAddress}
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;
