import { CustomBaseException } from './base.exception';
import { UserExceptionNames } from './entities/enums/user-exception.enum';

export class LoginException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = UserExceptionNames.LoginException;
  }
}

export class SignupException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = UserExceptionNames.SignupException;
  }
}

export class TokenValidationException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = UserExceptionNames.TokenValidationException;
  }
}

export class TokenExpiredOrInvalidException extends CustomBaseException {
  constructor(message: string) {
    super(message, 401);
    this.name = UserExceptionNames.TokenExpiredOrInvalid;
  }
}
