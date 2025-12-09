import { useState, useEffect, useRef, useCallback } from 'react';
import * as React from 'react';
import { LuAlarmClockCheck, LuAlarmClockOff } from 'react-icons/lu';
import { FaPlus } from 'react-icons/fa';
import LiveClock from './LiveClock';
import { AbsenceTypes, ShiftTypes } from '@/entities/enums/api.enums';
import ShiftButton from './ShiftButton';
import ShiftList from './ShiftList';
import MonthSelector from '../generic/MonthSelector';
import FAB from '../generic/FloatingButton';
import Modal from '../generic/Modal';
import { customStyles } from '@/styles/SelectStyles';
import Select from 'react-select';
import { CreateAbsenceDto } from '@/entities/dtos/shift.dto';
import toast from 'react-hot-toast';
import { AbsenceI, ShiftI } from '@/entities/types/home-management.entity';
import useShiftStore from '@/store/ShiftStore';

const Fichajes = () => {
  const shifts: ShiftI[] = useShiftStore((state) => state.shifts);
  const absences: AbsenceI[] = useShiftStore((state) => state.absences);
  const fetchShiftsForMonth = useShiftStore(
    (state) => state.fetchShiftsForMonth
  );
  const fetchAbsences = useShiftStore((state) => state.fetchAbsences);
  const addAbsence = useShiftStore((state) => state.addAbsence);
  const [expandedTask, setExpandedTask] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const dialogRef = useRef(null);
  const [selectedType, setSelectedType] = useState(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const hoursRef = useRef(null);
  const commentRef = useRef(null);

  const selectOptions = [
    { value: AbsenceTypes.Vacaciones, label: AbsenceTypes.Vacaciones },
    { value: AbsenceTypes.FichajeExterno, label: AbsenceTypes.FichajeExterno },
    {
      value: AbsenceTypes.HorasPersonales,
      label: AbsenceTypes.HorasPersonales,
    },
    { value: AbsenceTypes.Mudanza, label: AbsenceTypes.Mudanza },
  ];

  const fetchMonth = useCallback(
    async (month: string = selectedMonth) => fetchShiftsForMonth(month),
    [fetchShiftsForMonth, selectedMonth]
  );

  useEffect(() => {
    fetchMonth(selectedMonth);
    fetchAbsences();

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [fetchAbsences, fetchMonth, selectedMonth]);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedType) {
      alert('Por favor, selecciona un tipo de ausencia.');
      return;
    }
    if (!startDateRef.current || !endDateRef.current) {
      alert('Por favor, selecciona un rango de fechas.');
      return;
    }

    const startDate = new Date(startDateRef.current.value);
    const endDate = new Date(endDateRef.current.value);
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const absence: CreateAbsenceDto = {
        absenceType: selectedType.value,
        absenceDate: currentDate.toISOString().split('T')[0],
        absenceComment: commentRef.current.value || '',
        absenceHours:
          selectedType.value === AbsenceTypes.Vacaciones
            ? 0
            : parseInt(hoursRef.current.value, 10) || 0,
      };

      try {
        await addAbsence(absence);
        toast.success(`Ausencia creada para ${absence.absenceDate}`);
      } catch (error) {
        console.error(
          `Error creando ausencia para ${absence.absenceDate}:`,
          error
        );
        toast.error(`Error creando ausencia para ${absence.absenceDate}`);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    fetchAbsences();
    dialogRef.current.close();
  };

  const popup = (
    <Modal ref={dialogRef}>
      <h2 className="modalTitulo">Añadir ausencia</h2>
      <form className="modalForm" onSubmit={handleSubmit}>
        <Select
          options={selectOptions}
          onChange={setSelectedType}
          placeholder="Seleccionar tipo"
          className="modalSelect"
          styles={customStyles}
          isSearchable
        />
        <div
          className="modalSection"
          style={{ marginTop: '1rem', display: 'flex', flexDirection: 'row' }}
        >
          <input
            type="date"
            id="startDate"
            ref={startDateRef}
            className="modalInput"
            required
          />
          <input
            type="date"
            id="endDate"
            ref={endDateRef}
            className="modalInput"
            required
          />
        </div>
        <textarea
          id="comment"
          ref={commentRef}
          className="modalInput modalTextArea"
          placeholder="Comentario"
        />
        <input
          type="number"
          id="hours"
          ref={hoursRef}
          className="modalInput"
          placeholder="Horas"
          required={selectedType?.value !== AbsenceTypes.Vacaciones}
        />
        <button type="submit" className="modalBoton">
          Crear
        </button>
      </form>
    </Modal>
  );

  return (
    <>
      {popup}
      <div className="shifts">
        <div className="shiftButtons">
          <ShiftButton
            checkinType={ShiftTypes.ClockIn}
            icon={<LuAlarmClockCheck className="clockInIcon" />}
            fetchShifts={fetchMonth}
          />
          <LiveClock />
          <ShiftButton
            checkinType={ShiftTypes.ClockOut}
            icon={<LuAlarmClockOff className="clockInIcon" />}
            fetchShifts={fetchMonth}
          />
        </div>
        <hr className="hrSeccion" />
        <MonthSelector onMonthChange={handleMonthChange} />
        <ShiftList
          shifts={shifts}
          absences={absences}
          selectedMonth={selectedMonth}
          expandedTask={expandedTask}
          setExpandedTask={setExpandedTask}
          formatShiftTime={formatShiftTime}
        />
      </div>
      <div className="seccionBotones">
        <FAB
          icon={<FaPlus />}
          action={() => dialogRef.current.open()}
          classes="floatingButton"
        />
      </div>
    </>
  );
};

export default Fichajes;
