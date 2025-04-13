import { CustomBaseException } from "./base.exception";
import { ErrorCodes } from "./entities/enums/exception.enum";
import { TagExceptionNames } from "./entities/enums/tag-exception.enum";

export class AddTagException extends CustomBaseException {
  constructor(message: string) {
    super(message, ErrorCodes.BadRequest);
    this.name = TagExceptionNames.AddTagException;
  }
}

export class AddItemTagException extends CustomBaseException {
  constructor(message: string) {
    super(message, ErrorCodes.BadRequest);
    this.name = TagExceptionNames.AddItemTagException;
  }
}

export class FetchTagsException extends CustomBaseException {
  constructor(message: string) {
    super(message, ErrorCodes.BadRequest);
    this.name = TagExceptionNames.FetchTagsException;
  }
}

export class DeleteTagException extends CustomBaseException {
  constructor(message: string) {
    super(message, ErrorCodes.BadRequest);
    this.name = TagExceptionNames.DeleteTagException;
  }
}

export class SetSelectedTagsException extends CustomBaseException {
  constructor(message: string) {
    super(message, ErrorCodes.BadRequest);
    this.name = TagExceptionNames.SetSelectedTagsException;
  }
}

export class AddTagToSelectedException extends CustomBaseException {
  constructor(message: string) {
    super(message, ErrorCodes.BadRequest);
    this.name = TagExceptionNames.AddTagToSelectedException;
  }
}

export class RemoveTagFromSelectedException extends CustomBaseException {
  constructor(message: string) {
    super(message, ErrorCodes.BadRequest);
    this.name = TagExceptionNames.RemoveTagFromSelectedException;
  }
}
