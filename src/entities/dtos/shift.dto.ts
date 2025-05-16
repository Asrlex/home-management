import { IsNumber, IsString } from 'class-validator';
import { AbsenceTypes, ShiftTypes } from '../enums/api.enums';

export class CreateShiftCheckinDto {
  @IsString()
  shiftDate: string;
  @IsString()
  shiftTimestamp: string;
  @IsString()
  shiftType: ShiftTypes.ClockIn | ShiftTypes.ClockOut;
}

export class CreateAbsenceDto {
  @IsString()
  absenceDate: string;
  @IsString()
  absenceType: AbsenceTypes;
  @IsString()
  absenceComment: string;
  @IsNumber()
  absenceHours: number;
}
