import { ExceptionNames } from "./entities/enums/exception.enum";

export class CustomBaseException extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = ExceptionNames.CustomBaseException;
    this.statusCode = statusCode;
  }
}
