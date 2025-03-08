import React, { useState, useEffect, useRef } from 'react';
import CartButton from "../generic/CartButton";
import { RiDeleteBinLine, RiSubtractLine, RiAddLine } from "react-icons/ri";

export default function ContadorProducto({ producto, handleEliminar, handleAmount, handleMover, icono }) {
  const [inputValue, setInputValue] = useState(producto.shoppingListProductAmount ? producto.shoppingListProductAmount : producto.stockProductAmount);
  const isMounted = useRef(false);
  const previousValue = useRef(inputValue);
  const amount = producto.shoppingListProductAmount ? producto.shoppingListProductAmount : producto.stockProductAmount;
  const id = producto.shoppingListProductID ? producto.shoppingListProductID : producto.stockProductID;
  const fontSize = amount > 9999 ? '8px' : amount > 999 ? '9px' : amount > 99 ? '11px' : '14px';

  useEffect(() => {
    if (isMounted.current) {
      if (previousValue.current !== inputValue) {
        const handler = setTimeout(() => {
          if (inputValue < 1) {
            handleEliminar(id);
          } else {
            handleAmount(id, parseInt(inputValue));
          }
          previousValue.current = inputValue;
        }, 500);

        return () => {
          clearTimeout(handler);
        };
      }
    } else {
      isMounted.current = true;
    }
  }, [inputValue, id, handleEliminar, handleAmount]);

  return (
    <div className="contador" data-no-dnd="true">
      <CartButton
        onClick={() => {
          if (amount === 1) {
            handleEliminar(id);
            return;
          }
          handleAmount(id, amount - 1)
        }}
      >
        {amount === 1 ?
          <RiDeleteBinLine className="botonContador botonRemove" /> :
          <RiSubtractLine className="botonContador botonRemove" />
        }
      </CartButton>
      <div>
        <input
          className="amount"
          type="number"
          value={inputValue}
          style={{ fontSize }}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <CartButton
        onClick={() => handleAmount(id, amount + 1)}
      >
        <RiAddLine className="botonContador botonAdd" />
      </CartButton>
      <CartButton
        onClick={() => handleMover(id)}
      >
        {icono}
      </CartButton>
    </div>
  )
}