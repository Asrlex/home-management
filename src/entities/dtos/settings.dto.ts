import { IsNumber, IsString } from 'class-validator';

export class CreateSettingsDto {
  @IsString()
  settings: string;
  @IsNumber()
  settingsUserID: number;
}
