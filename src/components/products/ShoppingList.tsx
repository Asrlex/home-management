import React from 'react';
import GestorProductos from './ProductSection';
import { ProductTypes } from './entities/products.enum';

export default function ListaCompra() {
  return <GestorProductos type={ProductTypes.ShoppingList} />;
}
