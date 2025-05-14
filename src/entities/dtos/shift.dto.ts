import { IsNumber, IsString } from 'class-validator';
import { AbsenceTypes, GeneralParams } from '../enums/api.enums';

export class CreateShiftCheckinDto {
  @IsString()
  shiftDate: string;
  @IsString()
  shiftTimestamp: string;
  @IsString()
  shiftType: GeneralParams.ClockIn | GeneralParams.ClockOut;
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
