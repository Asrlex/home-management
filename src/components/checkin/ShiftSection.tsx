import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { HttpEnum } from '@/entities/enums/http.enum';
import { ApiEndpoints, FichajesEndpoints, TareasEndpoints } from '@/config/apiconfig';
import { LuAlarmClockCheck, LuAlarmClockOff } from 'react-icons/lu';
import { CreateShiftCheckinDto } from '@/entities/dtos/shift.dto';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import LiveClock from './LiveClock';
import { GeneralParams } from '@/entities/enums/api.enums';
import ShiftButton from './ShiftButton';
import ShiftList from './ShiftList';
import { axiosRequest } from '@/hooks/axiosRequest';


const Fichajes = () => {
  const [shifts, setShifts] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));


  useEffect(() => {
    fetchShiftsForMonth(selectedMonth);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedMonth]);


  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMonth = event.target.value;
    setSelectedMonth(selectedMonth);
  };


  const changeMonth = (direction: 'prev' | 'next') => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const newDate = new Date(Date.UTC(year, month - 1 + (direction === 'next' ? 1 : -1), 1));
    const newMonth = newDate.toISOString().slice(0, 7);
    setSelectedMonth(newMonth);
  };


  const fetchShiftsForMonth = async (month: string = selectedMonth) => {
    axiosRequest(
      HttpEnum.GET,
      `${ApiEndpoints.hm_url + FichajesEndpoints.byMonth}${month}`
    )
      .then((response) => setShifts(response.data))
      .catch((error) => console.error('Error fetching tasks:', error));
  };


  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.shiftListItem')) {
      setExpandedTask(null);
    }
  };


  const formatShiftTime = (shiftTime: number) => {
    const hours = Math.floor(shiftTime / 3600);
    const minutes = Math.floor((shiftTime % 3600) / 60);
    const seconds = Math.floor(shiftTime % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };


  return (
    <>
      <div className='shifts'>
        <div className='shiftButtons'>
          <ShiftButton
            checkinType={GeneralParams.ClockIn}
            icon={<LuAlarmClockCheck className='clockInIcon' />}
            fetchShifts={fetchShiftsForMonth}
          />
          <LiveClock />
          <ShiftButton
            checkinType={GeneralParams.ClockOut}
            icon={<LuAlarmClockOff className='clockInIcon' />}
            fetchShifts={fetchShiftsForMonth}
          />
        </div>
        <hr className='hrSeccion' />
        <div className='shiftListTitle'>
          <button
            onClick={() => changeMonth('prev')}
          >
            <FaArrowLeft className='monthArrowButton' />
          </button>
          <input
            type='month'
            id='monthSelector'
            className='monthSelector'
            value={selectedMonth}
            onChange={handleMonthChange}
          />
          <button
            onClick={() => changeMonth('next')}
          >
            <FaArrowRight className='monthArrowButton' />
          </button>
        </div>
        <ShiftList
          shifts={shifts}
          selectedMonth={selectedMonth}
          expandedTask={expandedTask}
          setExpandedTask={setExpandedTask}
          formatShiftTime={formatShiftTime}
        />
      </div>
    </>
  );
};

export default Fichajes;
