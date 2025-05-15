import { IsString } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  storeName: string;
}
