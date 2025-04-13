import { CustomBaseException } from "./base.exception";
import { ConnectionExceptionNames } from "./entities/enums/connection-exception.enum";

export class ConnectionException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = ConnectionExceptionNames.CreateConnectionException;
  }
}
