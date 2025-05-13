import { IsNumber, IsString } from 'class-validator';
import { GeneralParams } from '../enums/api.enums';

export class GetShiftCheckinDto {
  @IsNumber()
  shiftID: number;
  @IsString()
  shiftDate: string;
  @IsString()
  shiftTimestamp: string;
  @IsString()
  shiftType: GeneralParams.ClockIn | GeneralParams.ClockOut;
}

export class CreateShiftCheckinDto {
  @IsString()
  shiftDate: string;
  @IsString()
  shiftTimestamp: string;
  @IsString()
  shiftType: GeneralParams.ClockIn | GeneralParams.ClockOut;
}
