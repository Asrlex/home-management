import { RiDeleteBinLine, RiShoppingCartLine } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTag } from "react-icons/fa";
import { useRef, forwardRef, useContext } from "react";
import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ContextMenu } from 'primereact/contextmenu';
import ContadorProducto from "./ContadorProducto";
import { EtiquetaContext } from "../../store/etiqueta-context";
import api_config from "../../config/apiconfig";
import { axiosRequest } from "../../utils/axiosUtils";
import SortableItem from "../generic/SortableItem";

const ListaCompraItem = forwardRef(({ producto, handleEliminar, handleAmount, handleMover, addOrRemoveTag }, ref) => {
  const id = producto.product.productID;
  const { etiquetas } = useContext(EtiquetaContext);
  const cm = useRef(null);
  const addOrRemoveEtiqueta = (etiqueta_id) => {
    if (producto.product.tags?.some((prodEtiqueta) => prodEtiqueta.tagID === etiqueta_id)) {
      axiosRequest('DELETE', api_config.etiquetas.item, { tagID: etiqueta_id, itemID: id })
        .then(() => {
          addOrRemoveTag(id, etiqueta_id);
        })
        .catch((error) => {
          console.error(error);
        });
      return;
    }
    axiosRequest('POST', api_config.etiquetas.item, { tagID: etiqueta_id, itemID: id })
      .then(() => {
        axiosRequest('GET', api_config.lista_compra.all)
          .then((response) => {
            addOrRemoveTag(id, etiqueta_id);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const contextModel = [
    {
      label: 'Eliminar',
      icon: <RiDeleteBinLine className="me-2 w-3 h-3" />,
      command: () => handleEliminar(producto.product.productID)
    },
    {
      label: 'Comprar',
      icon: <RiShoppingCartLine className="me-2 w-3 h-3" />,
      command: () => handleComprar(producto.product.productID)
    },
    {
      label: 'Etiquetas',
      icon: <FaTag className="me-2 w-3 h-3" />,
      items: etiquetas.map((etiqueta) => ({
        label:
          producto.product.tags?.some((prodEtiqueta) => prodEtiqueta.tagID === etiqueta.tagID) ?
            `${etiqueta.tagName} ✅` : `${etiqueta.tagName}`
        ,
        icon: <FaTag className="me-2 w-3 h-3" />,
        command: () => addOrRemoveEtiqueta(etiqueta.tagID)
      }))
    }
  ];

  return (
    <SortableItem key={producto.shoppingListProductID} id={producto.shoppingListProductID}>
      {(setActivatorNodeRef, attributes, listeners) => (
        <>
          <ContextMenu
            className="customContextMenu"
            model={contextModel}
            ref={cm}
          />
          <div
            className="producto"
            onContextMenu={(e) => {
              e.preventDefault();
              cm.current.show(e);
            }}
            ref={ref}
          >
            <span ref={setActivatorNodeRef} {...attributes} {...listeners}>
              <BsThreeDotsVertical className="drag-handle" />
            </span>
            <p className="productoName">{producto.product.productName}</p>
            <ContadorProducto
              producto={producto}
              handleEliminar={handleEliminar}
              handleAmount={handleAmount}
              handleMover={handleMover}
              icono={<RiShoppingCartLine className="botonContador" />}
            />
          </div>
        </>
      )}
    </SortableItem>
  )
});

export default memo(ListaCompraItem);