import React, { useContext } from 'react';
import { ConnectionContext } from '../../store/ConnectionContext';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConnectionStatusIcon = () => {
  const { isConnected } = useContext(ConnectionContext);

  if (isConnected) return null;

  return (
    <div className="connection-status-icon">
      <FaExclamationTriangle color="red" />
      <span>Connection issue</span>
    </div>
  );
};

export default ConnectionStatusIcon;