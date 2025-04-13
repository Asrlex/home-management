import { CustomBaseException } from "./base.exception";
import { ExpenseExceptionNames } from "./entities/enums/expense-exception.enum";

export class AddExpenseException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = ExpenseExceptionNames.AddExpenseException;
  }
}

export class FetchExpensesException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = ExpenseExceptionNames.FetchExpensesException;
  }
}

export class DeleteExpenseException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = ExpenseExceptionNames.DeleteExpenseException;
  }
}
