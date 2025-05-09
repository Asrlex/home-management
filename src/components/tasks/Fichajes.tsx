import React, { useState, useEffect, useRef } from 'react';
import { axiosRequest } from '../../common/services/AxiosRequest';
import toast from 'react-hot-toast';
import { HttpEnum } from '@/entities/enums/http.enum';
import { ApiEndpoints, FichajesEndpoints, TareasEndpoints } from '@/config/apiconfig';
import { ShiftI } from '@/entities/types/home-management.entity';
import { LuAlarmClockCheck, LuAlarmClockOff } from 'react-icons/lu';
import { CreateShiftCheckinDto } from '@/entities/dtos/shift.dto';
import { motion } from 'framer-motion';
import { MdOutlineExpandMore } from 'react-icons/md';
import { CiLogin, CiLogout } from 'react-icons/ci';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import LiveClock from './LiveClock';


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


  const handleCLockIn = async (type: 'CLOCK_IN' | 'CLOCK_OUT') => {
    const shift: CreateShiftCheckinDto = {
      shiftDate: new Date().toISOString().split('T')[0],
      shiftTimestamp: new Date().toISOString(),
      shiftType: type,
    };
    await axiosRequest(HttpEnum.POST, ApiEndpoints.hm_url + FichajesEndpoints.base, {}, shift)
      .then(() => {
        toast.success('Fichaje realizado correctamente');
        fetchShiftsForMonth(selectedMonth);
      })
      .catch((error) => {
        console.error('Error creating task:', error);
        toast.error('Error al realizar el fichaje');
      });
  };


  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedMonth = event.target.value;
    setSelectedMonth(selectedMonth);
  };


  const changeMonth = (direction: 'prev' | 'next') => {
    const currentMonth = new Date(selectedMonth);
    const newMonth = new Date(
      currentMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1))
    )
      .toISOString()
      .slice(0, 7);
    setSelectedMonth(newMonth);
  };


  const fetchShiftsForMonth = async (month: string) => {
    axiosRequest(
      HttpEnum.GET,
      `${ApiEndpoints.hm_url + FichajesEndpoints.byMonth}${month}`
    )
      .then((response: ShiftI[]) => setShifts(response))
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
          <button
            onClick={() => handleCLockIn('CLOCK_IN')}
            className='clockInButton'
          >
            <LuAlarmClockCheck className='clockInIcon' />
          </button>
          <LiveClock />
          <button
            onClick={() => handleCLockIn('CLOCK_OUT')}
            className='clockInButton'
          >
            <LuAlarmClockOff className='clockInIcon' />
          </button>
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
        <div className='shiftList'>
          {Array.from({ length: new Date(parseInt(selectedMonth.split('-')[0]), parseInt(selectedMonth.split('-')[1]), 0).getDate() }, (_, day) => {
            const date = new Date(selectedMonth);
            date.setDate(day + 1);
            const formattedDate = date.toISOString().split('T')[0];
            const shift: ShiftI = shifts?.find((s: ShiftI) => s.shiftDate === formattedDate);

            return (
              <div
                key={formattedDate}
                className={`shiftListItem ${shift ? '' : 'noShift'} ${expandedTask === shift?.shiftID ? 'highlighted' : ''}`}
              >
                <div className='shiftListItemInfo'>
                  <div className='shiftListItemDate'>
                    {formattedDate}
                  </div>
                  <div className='shiftListItemTime'>
                    {shift
                      ? formatShiftTime(shift.shiftTime)
                      : new Date(formattedDate).getDay() === 0 || new Date(formattedDate).getDay() === 6
                        ? 'Fin de semana'
                        : 'Sin fichaje'}
                  </div>
                  {shift && (
                    <button
                      onClick={() => setExpandedTask(expandedTask === shift.shiftID ? null : shift.shiftID)}
                      className='expandButton'
                    >
                      <motion.div
                        animate={{ rotate: expandedTask === shift.shiftID ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MdOutlineExpandMore className='shiftListItemExpand' />
                      </motion.div>
                    </button>
                  )}
                </div>
                {shift && expandedTask === shift.shiftID && (
                  <div className='shiftListItemDetails'>
                    {shift.shiftCheckins.map((checkin) => (
                      <motion.div
                        key={checkin.shiftCheckinID}
                        className='shiftCheckin'
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className='shiftCheckinType'>
                          {checkin.shiftCheckinType === 'CLOCK_IN' ? (
                            <CiLogin className='shiftListItemExpand' />
                          ) : (
                            <CiLogout className='shiftListItemExpand' />
                          )}
                        </div>
                        <div className='shiftCheckinTime'>
                          {new Date(checkin.shiftCheckinTimestamp)
                            .toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Fichajes;
