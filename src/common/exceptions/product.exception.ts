import { CustomBaseException } from './base.exception';
import { ProductExceptionNames } from './entities/enums/product-exception.enum';

export class FetchProductsException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = ProductExceptionNames.FetchProductsException;
  }
}

export class AddProductException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = ProductExceptionNames.AddProductException;
  }
}

export class DeleteProductException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = ProductExceptionNames.DeleteProductException;
  }
}

export class ReorderProductsException extends CustomBaseException {
  constructor(message: string) {
    super(message, 400);
    this.name = ProductExceptionNames.ReorderProductsException;
  }
}
