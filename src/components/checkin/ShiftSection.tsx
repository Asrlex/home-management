import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HttpEnum } from '@/entities/enums/http.enum';
import { ApiEndpoints, FichajesEndpoints } from '@/config/apiconfig';
import { LuAlarmClockCheck, LuAlarmClockOff } from 'react-icons/lu';
import { FaPlus } from 'react-icons/fa';
import LiveClock from './LiveClock';
import { AbsenceTypes, GeneralParams } from '@/entities/enums/api.enums';
import ShiftButton from './ShiftButton';
import ShiftList from './ShiftList';
import { axiosRequest } from '@/hooks/axiosRequest';
import MonthSelector from '../generic/MonthSelector';
import FAB from '../generic/FloatingButton';
import Modal from '../generic/Modal';
import { customStyles } from '@/styles/SelectStyles';
import Select from 'react-select';
import { CreateAbsenceDto } from '@/entities/dtos/shift.dto';
import toast from 'react-hot-toast';
import { AbsenceI, ShiftI } from '@/entities/types/home-management.entity';

const Fichajes = () => {
  const [shifts, setShifts] = useState<ShiftI[]>([]);
  const [absences, setAbsences] = useState<AbsenceI[]>([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const dialogRef = useRef(null);
  const [selectedType, setSelectedType] = useState(null);
  const dateRef = useRef(null);
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

  const fetchShiftsForMonth = useCallback(
    async (month: string = selectedMonth) => {
      await axiosRequest(
        HttpEnum.GET,
        `${ApiEndpoints.hm_url + FichajesEndpoints.byMonth}${month}`
      )
        .then((response) => setShifts(response.data as ShiftI[]))
        .catch((error) => console.error('Error leyendo tareas:', error));
    },
    [selectedMonth]
  );

  useEffect(() => {
    fetchShiftsForMonth(selectedMonth);
    fetchAbsences();
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [fetchShiftsForMonth, selectedMonth]);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const fetchAbsences = async () => {
    axiosRequest(HttpEnum.GET, ApiEndpoints.hm_url + FichajesEndpoints.absence)
      .then((response) => setAbsences(response.data as AbsenceI[]))
      .catch((error) => console.error('Error leyendo ausencias:', error));
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
    if (!dateRef.current) {
      alert('Por favor, selecciona fecha(s).');
      return;
    }
    const absence: CreateAbsenceDto = {
      absenceType: selectedType.value,
      absenceDate: dateRef.current.value,
      absenceComment: commentRef.current?.value || '',
      absenceHours: parseInt(hoursRef.current?.value) || 0,
    };

    await axiosRequest(
      HttpEnum.POST,
      ApiEndpoints.hm_url + FichajesEndpoints.absence,
      {},
      absence
    )
      .then(async () => {
        toast.success('Ausencia creada correctamente');
        await fetchAbsences();
        dialogRef.current.close();
      })
      .catch((error) => {
        console.error('Error creando ausencia:', error);
        toast.error('Error creando ausencia');
      });
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
        <div className="modalSection" style={{ marginTop: '1rem' }}>
          <input
            type="date"
            id="dates"
            ref={dateRef}
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
          required
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
            checkinType={GeneralParams.ClockIn}
            icon={<LuAlarmClockCheck className="clockInIcon" />}
            fetchShifts={fetchShiftsForMonth}
          />
          <LiveClock />
          <ShiftButton
            checkinType={GeneralParams.ClockOut}
            icon={<LuAlarmClockOff className="clockInIcon" />}
            fetchShifts={fetchShiftsForMonth}
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
