import { RiDeleteBinLine } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTag } from "react-icons/fa";
import { CiBoxList } from "react-icons/ci";
import { useRef, forwardRef, useContext } from "react";
import { memo } from 'react';
import { ContextMenu } from 'primereact/contextmenu';
import { axiosRequest } from "../../utils/axiosUtils";
import api_config from "../../config/apiconfig";
import ContadorProducto from "./ContadorProducto";
import { EtiquetaContext } from "../../store/etiqueta-context";
import SortableItem from "../generic/SortableItem";

const DespensaItem = forwardRef(({ producto, handleEliminar, handleAmount, handleMover, setDespensa }, innerRef) => {
  const { etiquetas } = useContext(EtiquetaContext);
  const productID = producto.product.productID;
  const nombre = producto.product.productName;
  const fecha = new Date(producto.product.productDateLastBought);
  const fechaCompraFormat = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
  const contextManuRef = useRef(null);

  const addOrRemoveEtiqueta = (etiqueta_id) => {
    if (producto.etiquetas?.some((prodEtiqueta) => prodEtiqueta.tagID === etiqueta_id)) {
      axiosRequest('DELETE', api_config.etiquetas.item, { tagID: etiqueta_id, itemID: productID })
        .then(() => {
          setDespensa((prevDespensa) => {
            return prevDespensa.map((prod) => {
              if (prod.product.productID === productID) {
                return {
                  ...prod,
                  etiquetas: prod.product.productID?.filter((prodEtiqueta) => prodEtiqueta.tagID !== etiqueta_id)
                }
              }
              return prod;
            });
          });
        })
        .catch((error) => {
          console.error(error);
        });
      return;
    }
    axiosRequest('POST', api_config.etiquetas.item, { tagID: etiqueta_id, itemID: productID })
      .then(() => {
        axiosRequest('GET', api_config.despensa.all)
          .then((response) => {
            setProductos(response);
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
      command: () => handleEliminar(producto.stockProductID)
    },
    {
      label: 'Añadir a la lista',
      icon: <CiBoxList className="me-2 w-3 h-3" />,
      command: () => handleAddListaCompra(producto.stockProductID)
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
        command: () => addOrRemoveEtiqueta(etiqueta.id)
      }))
    }
  ];

  return (
    <SortableItem key={producto.stockProductID} id={producto.stockProductID} ref={innerRef}>
      {(setActivatorNodeRef, attributes, listeners) => (
        <>
          <ContextMenu
            className="customContextMenu"
            model={contextModel}
            ref={contextManuRef}
          />
          <div
            className="producto"
            onContextMenu={(e) => {
              e.preventDefault();
              contextManuRef.current.show(e);
            }}
            ref={innerRef}
          >
            <span ref={setActivatorNodeRef} {...attributes} {...listeners}>
              <BsThreeDotsVertical className="drag-handle" />
            </span>
            <p className="productoName">
              {nombre} <span className="fechaCompra">{fechaCompraFormat}</span>
            </p>
            <ContadorProducto
              producto={producto}
              handleEliminar={handleEliminar}
              handleAmount={handleAmount}
              handleMover={handleMover}
              icono={<CiBoxList className="botonContador botonList" />}
            />
          </div>
        </>
      )}
    </SortableItem>
  )
});

export default memo(DespensaItem);