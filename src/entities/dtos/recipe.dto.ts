import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRecipeDto {
  @IsNumber()
  @IsOptional()
  recipeID?: number;
  @IsString()
  recipeName: string;
  @IsString()
  recipeDescription: string;

  @IsOptional()
  @IsArray()
  steps: CreateStepDto[];
  @IsOptional()
  @IsArray()
  ingredients: CreateIngredientDto[];
}

export class CreateIngredientDto {
  @IsNumber()
  @IsOptional()
  recipeIngredientID: number;
  @IsNumber()
  recipeID: number;
  @IsObject()
  product: {
    productID: number;
    productName: string;
  };
  @IsNumber()
  recipeIngredientAmount: number;
  @IsString()
  recipeIngredientUnit: string;
  @IsBoolean()
  recipeIngredientIsOptional: boolean;
}

export class CreateStepDto {
  @IsNumber()
  @IsOptional()
  recipeStepID: number;
  @IsNumber()
  recipeID: number;
  @IsString()
  recipeStepName: string;
  @IsString()
  recipeStepDescription: string;
  @IsNumber()
  recipeStepOrder: number;
  @IsBoolean()
  recipeStepIsOptional: boolean;
}
