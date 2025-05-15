import { RiDeleteBinLine } from 'react-icons/ri';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaTag } from 'react-icons/fa';
import { CiBoxList } from 'react-icons/ci';
import { useRef, forwardRef } from 'react';
import { memo } from 'react';
import { ContextMenu } from 'primereact/contextmenu';
import ContadorProducto from './ProductCounter';
import useEtiquetaStore from '../../store/TagStore';
import SortableItem from '../generic/SortableItem';
import React from 'react';
import { StockProductI } from '@/entities/types/home-management.entity';

export interface DespensaItemProps {
  producto: StockProductI;
  handleEliminar: (id: number) => void;
  handleAmount: (id: number, amount: number) => void;
  handleMover: (id: number) => void;
  addOrRemoveTag: (tagID: number, producto: StockProductI) => void;
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
        icon: <RiDeleteBinLine className="customContextMenuIcon" />,
        command: () => handleEliminar(producto.stockProductID),
      },
      {
        label: 'Añadir a la lista',
        icon: <CiBoxList className="customContextMenuIcon" />,
        command: () => handleMover(producto.stockProductID),
      },
      {
        label: 'Etiquetas',
        icon: <FaTag className="customContextMenuIcon" />,
        items: etiquetas
          .filter((etiqueta) => etiqueta.tagType === 'Product')
          .map((etiqueta) => ({
            label: producto.product.tags?.some(
              (prodEtiqueta) => prodEtiqueta.tagID === etiqueta.tagID
            )
              ? `${etiqueta.tagName} ✅`
              : `${etiqueta.tagName}`,
            icon: <FaTag className="customContextMenuIcon" />,
            command: () => addOrRemoveTag(etiqueta.tagID, producto),
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
              className="customContextMenu"
              model={contextModel}
              ref={contextMenuRef}
            />
            <div
              className="producto"
              onContextMenu={(e: React.MouseEvent) => {
                e.preventDefault();
                contextMenuRef.current.show(e);
              }}
              ref={innerRef}
            >
              <span ref={setActivatorNodeRef} {...attributes} {...listeners}>
                <BsThreeDotsVertical className="drag-handle" />
              </span>
              <div className="productoName">
                {nombre}{' '}
                <span className="fechaCompra">{fechaCompraFormat}</span>
              </div>
              <ContadorProducto
                producto={producto}
                handleEliminar={handleEliminar}
                handleAmount={handleAmount}
                handleMover={handleMover}
                icono={<CiBoxList className="botonContadorIcono botonList" />}
              />
            </div>
          </>
        )}
      </SortableItem>
    );
  }
);

DespensaItem.displayName = 'DespensaItem';

export default memo(DespensaItem);
