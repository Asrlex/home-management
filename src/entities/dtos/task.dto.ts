import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { CarTaskTypes } from '../enums/api.enums';

export class CreateTaskDto {
  @IsNumber()
  @IsOptional()
  taskID: number;
  @IsString()
  taskTitle: string;
  @IsString()
  taskDescription: string;
  @IsBoolean()
  @IsOptional()
  taskCompleted: boolean;
}

export class CreateHouseTaskDto {
  @IsNumber()
  @IsOptional()
  houseTaskID?: number;
  @IsString()
  houseTaskName: string;
}

export class CreateCarTaskDto {
  @IsNumber()
  @IsOptional()
  carTaskID?: number;
  @IsString()
  carTaskName: CarTaskTypes;
  @IsString()
  carTaskDetails: string;
  @IsNumber()
  carTaskCost: number;
  @IsString()
  carTaskDate: string;
}
