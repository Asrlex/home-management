import { CustomBaseException } from './base.exception';
import { SettingsExceptionNames } from './entities/enums/settings-exception.enum';

export class UserIDRequiredException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = SettingsExceptionNames.UserIDRequiredException;
  }
}

export class FetchSettingsException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = SettingsExceptionNames.FetchSettingsException;
  }
}

export class UpdateSettingsException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = SettingsExceptionNames.UpdateSettingsException;
  }
}
