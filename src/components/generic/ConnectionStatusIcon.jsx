import useConnectionStore from '../../store/ConnectionContext';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConnectionStatusIcon = () => {
  const isConnected = useConnectionStore((state) => state.isConnected);

  if (isConnected) return null;

  return (
    <div className="connectionStatusIcon">
      <FaExclamationTriangle color="red" />
      <span>Connection issue</span>
    </div>
  );
};

export default ConnectionStatusIcon;