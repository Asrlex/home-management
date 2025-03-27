import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import api_config from '../config/apiconfig';

export const ConnectionContext = createContext();

export const ConnectionProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await axios.get(api_config.health_check_url);
        setIsConnected(true);
      } catch (error) {
        console.error('Connection is down:', error.message);
        setIsConnected(false);
      }
    };

    checkConnection();
    const intervalId = setInterval(checkConnection, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <ConnectionContext.Provider value={{ isConnected }}>
      {children}
    </ConnectionContext.Provider>
  );
};