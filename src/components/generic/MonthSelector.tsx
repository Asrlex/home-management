import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onChangeMonth: (direction: 'prev' | 'next') => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ selectedMonth, onMonthChange, onChangeMonth }) => {
  const handleMonthInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onMonthChange(event.target.value);
  };

  return (
    <div className='shiftListTitle'>
      <button onClick={() => onChangeMonth('prev')}>
        <FaArrowLeft className='monthArrowButton' />
      </button>
      <input
        type='month'
        id='monthSelector'
        className='monthSelector'
        value={selectedMonth}
        onChange={handleMonthInputChange}
      />
      <button onClick={() => onChangeMonth('next')}>
        <FaArrowRight className='monthArrowButton' />
      </button>
    </div>
  );
};

export default MonthSelector;