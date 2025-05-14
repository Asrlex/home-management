import { IsNumber, IsString } from 'class-validator';

export class CreateStockProductDto {
  @IsNumber()
  stockProductID: number;
  @IsNumber()
  stockProductAmount: number;
}
