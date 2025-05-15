import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MdOutlineExpandMore } from 'react-icons/md';
import { CiLogin, CiLogout } from 'react-icons/ci';
import { AbsenceI, ShiftI } from '@/entities/types/home-management.entity';
import { GeneralParams, AbsenceTypes } from '@/entities/enums/api.enums';

interface ShiftListProps {
  shifts: ShiftI[];
  absences: AbsenceI[];
  selectedMonth: string;
  expandedTask: number | null;
  setExpandedTask: (taskId: number | null) => void;
  formatShiftTime: (shiftTime: number) => string;
}

const ShiftList: React.FC<ShiftListProps> = ({
  shifts,
  absences,
  selectedMonth,
  expandedTask,
  setExpandedTask,
  formatShiftTime,
}) => {
  const calculateTimeDifference = useMemo(() => {
    const targetMinutesPerDay = 465;
    const currentDate = new Date();
    const selectedYear = parseInt(selectedMonth.split('-')[0]);
    const selectedMonthIndex = parseInt(selectedMonth.split('-')[1]) - 1;
    const daysInMonth = new Date(
      selectedYear,
      selectedMonthIndex + 1,
      0
    ).getDate();

    if (
      selectedYear > currentDate.getFullYear() ||
      (selectedYear === currentDate.getFullYear() &&
        selectedMonthIndex > currentDate.getMonth())
    ) {
      return null;
    }

    let totalTargetMinutes = 0;
    let totalWorkedMinutes = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(Date.UTC(selectedYear, selectedMonthIndex, day));
      const formattedDate = date.toISOString().split('T')[0];
      const isWorkDay =
        date.getUTCDay() !== 0 &&
        date.getUTCDay() !== 6 &&
        !absences?.some(
          (a) =>
            a.absenceDate === formattedDate &&
            [AbsenceTypes.Festivo, AbsenceTypes.Vacaciones].includes(
              a.absenceType
            )
        );

      if (
        selectedYear === currentDate.getFullYear() &&
        selectedMonthIndex === currentDate.getMonth() &&
        day > currentDate.getDate()
      ) {
        break;
      }

      const shift = shifts?.find((s) => s.shiftDate === formattedDate);
      const absence = absences?.find((a) => a.absenceDate === formattedDate);

      if (isWorkDay) {
        totalTargetMinutes += targetMinutesPerDay;
      }

      if (shift) {
        totalWorkedMinutes += shift.shiftTime / 60;
      }

      if (absence?.absenceType === AbsenceTypes.HorasPersonales) {
        totalWorkedMinutes += absence.absenceHours * 60;
      }

      if (absence?.absenceType === AbsenceTypes.FichajeExterno) {
        totalWorkedMinutes += targetMinutesPerDay;
      }
    }

    const difference = totalWorkedMinutes - totalTargetMinutes;
    const hours = Math.floor(Math.abs(difference) / 60);
    const minutes = Math.abs(Math.floor(difference) % 60);

    return `${difference > 0 ? '+' : '-'}${hours}h ${minutes}m`;
  }, [shifts, absences, selectedMonth]);

  return (
    <div className="monthShifts">
      <div className="shiftList">
        {Array.from(
          {
            length: new Date(
              parseInt(selectedMonth.split('-')[0]),
              parseInt(selectedMonth.split('-')[1]),
              0
            ).getDate(),
          },
          (_, day) => {
            const year = parseInt(selectedMonth.split('-')[0]);
            const month = parseInt(selectedMonth.split('-')[1]) - 1;
            const date = new Date(Date.UTC(year, month, day + 1));
            const formattedDate = date.toISOString().split('T')[0];
            const shift: ShiftI = shifts?.find(
              (s: ShiftI) => s.shiftDate === formattedDate
            );
            const absence: AbsenceI = absences?.find(
              (a: AbsenceI) => a.absenceDate === formattedDate
            );

            return (
              <div
                key={formattedDate}
                className={`shiftListItem
                  ${shift || absence ? '' : 'noShift'}
                  ${expandedTask === shift?.shiftID ? 'highlighted' : ''}
                  ${date.getUTCDay() === 0 || date.getUTCDay() === 6 ? 'weekend' : ''}
                  ${absence?.absenceType === AbsenceTypes.Festivo ? 'holiday' : ''}
                  ${formattedDate === new Date().toISOString().split('T')[0] ? 'currentDay' : ''}
                  `}
              >
                <div className="shiftListItemInfo">
                  <div className="shiftListItemDate">{formattedDate}</div>
                  <div className="shiftListItemTime">
                    {shift
                      ? `${formatShiftTime(shift.shiftTime + (absence?.absenceType === AbsenceTypes.HorasPersonales ? absence.absenceHours * 3600 : 0))}`
                      : absence
                        ? absence.absenceType === AbsenceTypes.HorasPersonales
                          ? `${absence.absenceHours}h Horas Personales`
                          : absence.absenceType
                        : date.getUTCDay() === 0 || date.getUTCDay() === 6
                          ? 'Fin de semana'
                          : 'Sin fichaje'}
                  </div>
                  {shift && (
                    <button
                      onClick={() =>
                        setExpandedTask(
                          expandedTask === shift.shiftID ? null : shift.shiftID
                        )
                      }
                      className="expandButton"
                    >
                      <motion.div
                        animate={{
                          rotate: expandedTask === shift.shiftID ? 180 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <MdOutlineExpandMore className="shiftListItemExpand" />
                      </motion.div>
                    </button>
                  )}
                </div>
                {shift && expandedTask === shift.shiftID && (
                  <div className="shiftListItemDetails">
                    {shift.shiftCheckins.map((checkin) => (
                      <motion.div
                        key={checkin.shiftCheckinID}
                        className="shiftCheckin"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="shiftCheckinType">
                          {checkin.shiftCheckinType ===
                          GeneralParams.ClockIn ? (
                            <CiLogin className="shiftListItemExpand" />
                          ) : (
                            <CiLogout className="shiftListItemExpand" />
                          )}
                        </div>
                        <div className="shiftCheckinTime">
                          {new Date(
                            checkin.shiftCheckinTimestamp
                          ).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </div>
                      </motion.div>
                    ))}
                    {absence?.absenceType === AbsenceTypes.HorasPersonales && (
                      <motion.div
                        className="shiftCheckin"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="shiftCheckinType">Horas Personales</div>
                        <div className="shiftCheckinTime">{`${absence.absenceHours}h`}</div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
      {calculateTimeDifference !== null && (
        <div className="timeDifference">
          <strong>Horas:</strong> {calculateTimeDifference}
        </div>
      )}
    </div>
  );
};

export default ShiftList;
