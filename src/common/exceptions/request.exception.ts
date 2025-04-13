import { CustomBaseException } from "./base.exception";
import { ExceptionNames } from "./entities/enums/exception.enum";

export class RequestException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = ExceptionNames.RequestException;
  }
}
