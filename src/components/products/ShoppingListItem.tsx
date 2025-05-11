import { RiDeleteBinLine, RiShoppingCartLine } from 'react-icons/ri';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaTag } from 'react-icons/fa';
import { useRef, forwardRef } from 'react';
import { memo } from 'react';
import { ContextMenu } from 'primereact/contextmenu';
import ContadorProducto from './ProductCounter';
import useEtiquetaStore from '../../store/TagStore';
import SortableItem from '../generic/SortableItem';
import React from 'react';
import { ShoppingListProductI } from '@/entities/types/home-management.entity';

interface ListaCompraItemProps {
  producto: ShoppingListProductI;
  handleEliminar: (shoppingListProductID: string) => void;
  handleAmount: (amount: number, producto: any) => void;
  handleMover: (shoppingListProductID: string) => void;
  addOrRemoveTag: (tagID: string, producto: ShoppingListProductI) => void;
}

const ListaCompraItem = forwardRef<HTMLDivElement, ListaCompraItemProps>(
  (
    { producto, handleEliminar, handleAmount, handleMover, addOrRemoveTag },
    ref
  ) => {
    const etiquetas = useEtiquetaStore((state) => state.etiquetas);
    const cm = useRef(null);

    const contextModel = [
      {
        label: 'Eliminar',
        icon: <RiDeleteBinLine className='customContextMenuIcon' />,
        command: () => handleEliminar(producto.shoppingListProductID.toString()),
      },
      {
        label: 'Comprar',
        icon: <RiShoppingCartLine className='customContextMenuIcon' />,
        command: () => handleMover(producto.shoppingListProductID.toString()),
      },
      {
        label: 'Etiquetas',
        icon: <FaTag className='customContextMenuIcon' />,
        items: etiquetas
          .filter((etiqueta) => etiqueta.tagType === 'Product')
          .map((etiqueta) => ({
            label: producto.product.tags?.some(
              (prodEtiqueta) => prodEtiqueta.tagID === etiqueta.tagID
            )
              ? `${etiqueta.tagName} ✅`
              : `${etiqueta.tagName}`,
            icon: <FaTag className='customContextMenuIcon' />,
            command: () => addOrRemoveTag(etiqueta.tagID.toString(), producto),
          })),
      },
    ];

    return (
      <SortableItem
        key={producto.shoppingListProductID}
        id={producto.shoppingListProductID}
      >
        {(setActivatorNodeRef, attributes, listeners) => (
          <>
            <ContextMenu
              className='customContextMenu'
              model={contextModel}
              ref={cm}
            />
            <div
              className='producto'
              onContextMenu={(e) => {
                e.preventDefault();
                cm.current.show(e);
              }}
              ref={ref}
            >
              <span ref={setActivatorNodeRef} {...attributes} {...listeners}>
                <BsThreeDotsVertical className='drag-handle' />
              </span>
              <div className='productoName'>{producto.product.productName}</div>
              <ContadorProducto
                producto={producto}
                handleEliminar={handleEliminar}
                handleAmount={handleAmount}
                handleMover={handleMover}
                icono={<RiShoppingCartLine className='botonContadorIcono' />}
              />
            </div>
          </>
        )}
      </SortableItem>
    );
  }
);

export default memo(ListaCompraItem);
