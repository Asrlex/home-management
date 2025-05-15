import { CustomBaseException } from './base.exception';
import { ShopExceptionMessages } from './entities/enums/shop-exception.enum';

export class AddShopException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = ShopExceptionMessages.AddShopException;
  }
}

export class FetchShopsException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = ShopExceptionMessages.FetchShopsException;
  }
}

export class SetSelectedShopException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = ShopExceptionMessages.SetSelectedShopException;
  }
}
