import {
  CreateAbsenceDto,
  CreateShiftCheckinDto,
} from '@/entities/dtos/shift.dto';
import { AbsenceTypes, ShiftTypes } from '@/entities/enums/api.enums';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { StoreEnum } from '@/store/entities/enums/store.enum';
import useShiftStore from '@/store/ShiftStore';
import useUserStore from '@/store/UserStore';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsSoundwave } from 'react-icons/bs';
import { FaMicrophone } from 'react-icons/fa';

const Microphone = () => {
  const [listening, setListening] = useState(false);
  const addShift = useShiftStore((state) => state.addShift);
  const fetchShifts = useShiftStore((state) => state.fetchShifts);
  const addAbsence = useShiftStore((state) => state.addAbsence);
  const fetchAbsences = useShiftStore((state) => state.fetchAbsences);
  const validateToken = useUserStore((state) => state.validateToken);
  const loginStatus = useUserStore((state) => state.loginStatus);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const handleVoiceCommand = (command: string) => {
    setListening(false);
    if (command.toLowerCase().includes('fichaje')) {
      if (command.includes('entrada')) handleShifts(ShiftTypes.ClockIn);
      else if (command.includes('salida')) handleShifts(ShiftTypes.ClockOut);
    } else if (command.toLowerCase().includes('ausencia')) {
      if (command.includes('vacaciones')) {
        handleAbsences(AbsenceTypes.Vacaciones);
      } else if (command.includes('fichaje externo')) {
        handleAbsences(AbsenceTypes.FichajeExterno);
      } else if (command.includes('personal')) {
        if (command.includes('horas')) {
          const match = command.match(/(\d+)\s*horas/);
          const hours = match ? parseInt(match[1], 10) : NaN;
          if (!isNaN(hours)) {
            handleAbsences(AbsenceTypes.HorasPersonales, hours);
          } else {
            handleAbsences(AbsenceTypes.HorasPersonales);
          }
        } else {
          handleAbsences(AbsenceTypes.HorasPersonales);
        }
      } else if (command.includes('mudanza')) {
        handleAbsences(AbsenceTypes.Mudanza);
      }
    }
  };

  const handleShifts = async (shiftType: ShiftTypes) => {
    const shift: CreateShiftCheckinDto = {
      shiftDate: new Date().toISOString().split('T')[0],
      shiftTimestamp: new Date().toISOString(),
      shiftType,
    };
    addShift(shift)
      .then(() => {
        fetchShifts();
        toast.success('Fichaje realizado correctamente');
      })
      .catch((error) => {
        console.error('Error creating task:', error);
        toast.error('Error al realizar el fichaje');
      });
  };

  const handleAbsences = async (
    absenceType: AbsenceTypes,
    absenceHours: number = 8
  ) => {
    const absence: CreateAbsenceDto = {
      absenceDate: new Date().toISOString().split('T')[0],
      absenceType,
      absenceHours,
      absenceComment: '',
    };
    addAbsence(absence)
      .then(() => {
        fetchAbsences();
        toast.success('Ausencia creada correctamente');
      })
      .catch((error) => {
        console.error('Error creating task:', error);
        toast.error('Error al crear la ausencia');
      });
  };

  const { startRecognition, stopRecognition } =
    useSpeechRecognition(handleVoiceCommand);

  const handleVoiceCommandClick = () => {
    if (!listening) {
      setListening(true);
      startRecognition();
    } else {
      setListening(false);
      stopRecognition();
    }
  };

  return (
    loginStatus === StoreEnum.STATUS_AUTHENTICATED && (
      <button className="microphoneButton" onClick={handleVoiceCommandClick}>
        {listening ? (
          <BsSoundwave className="microphoneIcon" />
        ) : (
          <FaMicrophone className="microphoneIcon" />
        )}
      </button>
    )
  );
};

export default Microphone;
