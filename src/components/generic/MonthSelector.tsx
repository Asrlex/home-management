import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface MonthSelectorProps {
  onMonthChange?: (month: string) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ onMonthChange }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const handleMonthInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMonth = event.target.value;
    setSelectedMonth(newMonth);
    if (onMonthChange) onMonthChange(newMonth);
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const newDate = new Date(Date.UTC(year, month - 1 + (direction === 'next' ? 1 : -1), 1));
    const newMonth = newDate.toISOString().slice(0, 7);
    setSelectedMonth(newMonth);
    if (onMonthChange) onMonthChange(newMonth);
  };

  return (
    <div className='shiftListTitle'>
      <button onClick={() => changeMonth('prev')}>
        <FaArrowLeft className='monthArrowButton' />
      </button>
      <input
        type='month'
        id='monthSelector'
        className='monthSelector'
        value={selectedMonth}
        onChange={handleMonthInputChange}
      />
      <button onClick={() => changeMonth('next')}>
        <FaArrowRight className='monthArrowButton' />
      </button>
    </div>
  );
};

export default MonthSelector;