import { RiDeleteBinLine } from 'react-icons/ri';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaTag } from 'react-icons/fa';
import { CiBoxList } from 'react-icons/ci';
import { useRef, forwardRef } from 'react';
import { memo } from 'react';
import { ContextMenu } from 'primereact/contextmenu';
import ContadorProducto from './ContadorProducto';
import useEtiquetaStore from '../../store/TagStore';
import useDespensaStore from '../../store/StockStore';
import SortableItem from '../generic/SortableItem';
import React from 'react';
import { StockProductI } from '@/entities/types/home-management.entity';

interface DespensaItemProps {
  producto: StockProductI;
  handleEliminar: (stockProductID: string) => void;
  handleAmount: (amount: number, producto: any) => void;
  handleMover: (stockProductID: string) => void;
  addOrRemoveTag: (tagID: string, producto: any) => void;
}

const DespensaItem = forwardRef<HTMLDivElement, DespensaItemProps>(
  (
    { producto, handleEliminar, handleAmount, handleMover, addOrRemoveTag },
    innerRef
  ) => {
    const etiquetas = useEtiquetaStore((state) => state.etiquetas);
    const nombre = producto.product.productName;
    const fecha = new Date(producto.product.productDateLastBought);
    const fechaCompraFormat = `${fecha.getDate()}/${
      fecha.getMonth() + 1
    }/${fecha.getFullYear()}`;
    const contextMenuRef = useRef(null);

    const contextModel = [
      {
        label: 'Eliminar',
        icon: <RiDeleteBinLine className='customContextMenuIcon' />,
        command: () => handleEliminar(producto.stockProductID.toString()),
      },
      {
        label: 'Añadir a la lista',
        icon: <CiBoxList className='customContextMenuIcon' />,
        command: () => handleMover(producto.stockProductID.toString()),
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
        key={producto.stockProductID}
        id={producto.stockProductID}
        ref={innerRef}
      >
        {(setActivatorNodeRef, attributes, listeners) => (
          <>
            <ContextMenu
              className='customContextMenu'
              model={contextModel}
              ref={contextMenuRef}
            />
            <div
              className='producto'
              onContextMenu={(e: React.MouseEvent) => {
                e.preventDefault();
                contextMenuRef.current.show(e);
              }}
              ref={innerRef}
            >
              <span ref={setActivatorNodeRef} {...attributes} {...listeners}>
                <BsThreeDotsVertical className='drag-handle' />
              </span>
              <div className='productoName'>
                {nombre}{' '}
                <span className='fechaCompra'>{fechaCompraFormat}</span>
              </div>
              <ContadorProducto
                producto={producto}
                handleEliminar={handleEliminar}
                handleAmount={handleAmount}
                handleMover={handleMover}
                icono={<CiBoxList className='botonContadorIcono botonList' />}
              />
            </div>
          </>
        )}
      </SortableItem>
    );
  }
);

export default memo(DespensaItem);
