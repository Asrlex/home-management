import { CustomBaseException } from './base.exception';
import { RecipeExceptionNames } from './entities/enums/recipe-exception.enum';

export class FetchRecipesException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = RecipeExceptionNames.FetchRecipesException;
  }
}

export class AddRecipeException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = RecipeExceptionNames.AddRecipeException;
  }
}

export class UpdateRecipeException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = RecipeExceptionNames.UpdateRecipeException;
  }
}

export class DeleteRecipeException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = RecipeExceptionNames.DeleteRecipeException;
  }
}
