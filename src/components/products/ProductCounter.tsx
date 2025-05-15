import {
  ShoppingListProductI,
  StockProductI,
} from '@/entities/types/home-management.entity';
import React, { useState, useEffect, useRef } from 'react';
import { RiDeleteBinLine, RiSubtractLine, RiAddLine } from 'react-icons/ri';

interface ContadorProductoProps {
  producto: ShoppingListProductI | StockProductI;
  handleEliminar: (id: number) => void;
  handleAmount: (id: number, amount: number) => void;
  handleMover: (id: number) => void;
  icono: React.ReactNode;
}

const ContadorProducto: React.FC<ContadorProductoProps> = ({
  producto,
  handleEliminar,
  handleAmount,
  handleMover,
  icono,
}) => {
  const idName = Object.hasOwnProperty.call(producto, 'shoppingListProductID')
    ? 'shoppingListProductID'
    : 'stockProductID';
  const idAmount = Object.hasOwnProperty.call(
    producto,
    'shoppingListProductAmount'
  )
    ? 'shoppingListProductAmount'
    : 'stockProductAmount';
  const [inputValue, setInputValue] = useState(producto[idAmount] || 1);
  const isMounted = useRef(false);
  const previousValue = useRef(inputValue);
  const id = producto[idName];
  const amount = producto[idAmount];
  const fontSize =
    amount > 9999
      ? '8px'
      : amount > 999
        ? '9px'
        : amount > 99
          ? '11px'
          : '14px';

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
        }, 200);

        return () => {
          clearTimeout(handler);
        };
      }
    } else {
      isMounted.current = true;
    }
  }, [inputValue, id, handleEliminar, handleAmount]);

  useEffect(() => {
    setInputValue(amount);
  }, [amount]);

  const handleDecrement = () => {
    if (amount === 1) {
      handleEliminar(id);
      return;
    }
    setInputValue(amount - 1);
  };

  const handleIncrement = () => {
    setInputValue(amount + 1);
  };

  return (
    <div className="contador" data-no-dnd="true">
      <button onClick={handleDecrement} className="botonContador">
        {amount === 1 ? (
          <RiDeleteBinLine className="botonContadorIcono botonRemoveIcono" />
        ) : (
          <RiSubtractLine className="botonContadorIcono botonRemoveIcono" />
        )}
      </button>
      <div>
        <input
          className="amount"
          type="number"
          value={inputValue}
          style={{ fontSize }}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <button onClick={handleIncrement} className="botonContador">
        <RiAddLine className="botonContadorIcono botonAdd" />
      </button>
      <button onClick={() => handleMover(id)} className="botonContador">
        {icono}
      </button>
    </div>
  );
};

export default ContadorProducto;
