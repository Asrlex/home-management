import React from 'react';

interface FABProps {
  icon: React.ReactNode;
  action: () => void;
  classes?: string;
}

const FAB: React.FC<FABProps> = ({ icon, action, classes }) => {
  return (
    <button onClick={action} className={classes}>
      {icon}
    </button>
  );
};

export default FAB;
