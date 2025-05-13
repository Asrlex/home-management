import React from 'react';
import { motion } from 'framer-motion';
import { MdOutlineExpandMore } from 'react-icons/md';
import { CiLogin, CiLogout } from 'react-icons/ci';
import { ShiftI } from '@/entities/types/home-management.entity';
import { GeneralParams } from '@/entities/enums/api.enums';

interface ShiftListProps {
  shifts: ShiftI[];
  selectedMonth: string;
  expandedTask: number | null;
  setExpandedTask: (taskId: number | null) => void;
  formatShiftTime: (shiftTime: number) => string;
}

const ShiftList: React.FC<ShiftListProps> = ({
  shifts,
  selectedMonth,
  expandedTask,
  setExpandedTask,
  formatShiftTime,
}) => {
  return (
    <div className='shiftList'>
      {Array.from(
        { length: new Date(parseInt(selectedMonth.split('-')[0]), parseInt(selectedMonth.split('-')[1]), 0).getDate() },
        (_, day) => {
          const year = parseInt(selectedMonth.split('-')[0]);
          const month = parseInt(selectedMonth.split('-')[1]) - 1;
          const date = new Date(Date.UTC(year, month, day + 1));
          const formattedDate = date.toISOString().split('T')[0];
          const shift: ShiftI = shifts?.find((s: ShiftI) => s.shiftDate === formattedDate);

          return (
            <div
              key={formattedDate}
              className={`shiftListItem ${shift ? '' : 'noShift'} ${expandedTask === shift?.shiftID ? 'highlighted' : ''}`}
            >
              <div className='shiftListItemInfo'>
                <div className='shiftListItemDate'>{formattedDate}</div>
                <div className='shiftListItemTime'>
                  {shift
                    ? formatShiftTime(shift.shiftTime)
                    : date.getUTCDay() === 0 || date.getUTCDay() === 6
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
                        {checkin.shiftCheckinType === GeneralParams.ClockIn ? (
                          <CiLogin className='shiftListItemExpand' />
                        ) : (
                          <CiLogout className='shiftListItemExpand' />
                        )}
                      </div>
                      <div className='shiftCheckinTime'>
                        {new Date(checkin.shiftCheckinTimestamp).toLocaleTimeString('en-GB', {
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
        }
      )}
    </div>
  );
};

export default ShiftList;