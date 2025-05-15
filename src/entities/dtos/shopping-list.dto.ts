import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateShoppingListProductDto {
  @IsNumber()
  @IsNotEmpty()
  readonly shoppingListProductID: number;

  @IsNumber()
  @IsNotEmpty()
  readonly shoppingListAmount: number;

  @IsNumber()
  storeID: string;
}
