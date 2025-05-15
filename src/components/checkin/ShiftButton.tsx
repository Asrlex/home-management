import { ApiEndpoints, FichajesEndpoints } from '@/config/apiconfig';
import { CreateShiftCheckinDto } from '@/entities/dtos/shift.dto';
import { GeneralParams } from '@/entities/enums/api.enums';
import { HttpEnum } from '@/entities/enums/http.enum';
import { axiosRequest } from '@/hooks/axiosRequest';
import React from 'react';
import toast from 'react-hot-toast';

interface ShiftButtonProps {
  checkinType: GeneralParams.ClockIn | GeneralParams.ClockOut;
  icon: React.ReactNode;
  fetchShifts: () => Promise<void>;
}

const ShiftButton: React.FC<ShiftButtonProps> = ({
  checkinType,
  icon,
  fetchShifts,
}) => {
  const handleCLockIn = async (
    type: GeneralParams.ClockIn | GeneralParams.ClockOut
  ) => {
    const today = new Date();
    const day = today.getDay();
    if (day === 0 || day === 6) {
      toast.error('No se puede fichar en fin de semana');
      return;
    }
    const shift: CreateShiftCheckinDto = {
      shiftDate: new Date().toISOString().split('T')[0],
      shiftTimestamp: new Date().toISOString(),
      shiftType: type,
    };
    await axiosRequest(
      HttpEnum.POST,
      ApiEndpoints.hm_url + FichajesEndpoints.base,
      {},
      shift
    )
      .then(() => {
        toast.success('Fichaje realizado correctamente');
        fetchShifts();
      })
      .catch((error) => {
        console.error('Error creating task:', error);
        toast.error('Error al realizar el fichaje');
      });
  };

  return (
    <button
      onClick={() => handleCLockIn(checkinType)}
      className="clockInButton"
    >
      {icon}
    </button>
  );
};

export default ShiftButton;
