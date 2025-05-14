import { IsNumber, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  expenseDescription: string;
  @IsNumber()
  expenseAmount: number;
  @IsString()
  expenseDate: string;
  @IsNumber()
  categoryID: number;
}
