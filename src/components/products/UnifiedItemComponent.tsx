import React, { forwardRef } from 'react';
import ListaCompraItem from './ShoppingListItem';
import DespensaItem from './StockItem';
import {
  ShoppingListProductI,
  StockProductI,
} from '@/entities/types/home-management.entity';
import { ProductsEnum } from './entities/products.enum';

interface UnifiedItemComponentProps {
  producto: ShoppingListProductI | StockProductI;
  handleEliminar: (id: number) => void;
  handleAmount: (id: number, amount: number) => void;
  handleMover: (id: number) => void;
  addOrRemoveTag: (
    tagID: number,
    producto: ShoppingListProductI | StockProductI
  ) => void;
}

const UnifiedItemComponent = forwardRef<
  HTMLDivElement,
  UnifiedItemComponentProps
>(
  (
    { producto, handleEliminar, handleAmount, handleMover, addOrRemoveTag },
    ref
  ) => {
    if (ProductsEnum.listaCompraID in producto) {
      return (
        <ListaCompraItem
          ref={ref}
          producto={producto}
          handleEliminar={handleEliminar}
          handleAmount={handleAmount}
          handleMover={() => handleMover(producto.shoppingListProductID)}
          addOrRemoveTag={(tagID) => addOrRemoveTag(tagID, producto)}
        />
      );
    } else {
      return (
        <DespensaItem
          ref={ref}
          producto={producto}
          handleEliminar={handleEliminar}
          handleAmount={handleAmount}
          handleMover={() => handleMover(producto.stockProductID)}
          addOrRemoveTag={(tagID) => addOrRemoveTag(tagID, producto)}
        />
      );
    }
  }
);

UnifiedItemComponent.displayName = 'UnifiedItemComponent';

export default UnifiedItemComponent;
