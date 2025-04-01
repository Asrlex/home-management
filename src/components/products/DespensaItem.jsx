import { RiDeleteBinLine } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTag } from "react-icons/fa";
import { CiBoxList } from "react-icons/ci";
import { useRef, forwardRef } from "react";
import { memo } from "react";
import { ContextMenu } from "primereact/contextmenu";
import ContadorProducto from "./ContadorProducto";
import useEtiquetaStore from "../../store/EtiquetaContext";
import useDespensaStore from "../../store/StockContext";
import SortableItem from "../generic/SortableItem";

const DespensaItem = forwardRef(
  (
    { producto, handleEliminar, handleAmount, handleMover, addOrRemoveTag },
    innerRef
  ) => {
    const etiquetas = useEtiquetaStore((state) => state.etiquetas);
    const addOrRemoveListTag = useDespensaStore(
      (state) => state.addOrRemoveListTag
    );
    const productID = producto.product.productID;
    const nombre = producto.product.productName;
    const fecha = new Date(producto.product.productDateLastBought);
    const fechaCompraFormat = `${fecha.getDate()}/${
      fecha.getMonth() + 1
    }/${fecha.getFullYear()}`;
    const contextMenuRef = useRef(null);

    const contextModel = [
      {
        label: "Eliminar",
        icon: <RiDeleteBinLine className="me-2 w-3 h-3" />,
        command: () => handleEliminar(producto.stockProductID),
      },
      {
        label: "Añadir a la lista",
        icon: <CiBoxList className="me-2 w-3 h-3" />,
        command: () => handleAddListaCompra(producto.stockProductID),
      },
      {
        label: "Etiquetas",
        icon: <FaTag className="me-2 w-3 h-3" />,
        items: etiquetas
          .filter((etiqueta) => etiqueta.tagType === "Product")
          .map((etiqueta) => ({
            label: producto.product.tags?.some(
              (prodEtiqueta) => prodEtiqueta.tagID === etiqueta.tagID
            )
              ? `${etiqueta.tagName} ✅`
              : `${etiqueta.tagName}`,
            icon: <FaTag className="me-2 w-3 h-3" />,
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
              onContextMenu={(e) => {
                e.preventDefault();
                contextMenuRef.current.show(e);
              }}
              ref={innerRef}
            >
              <span ref={setActivatorNodeRef} {...attributes} {...listeners}>
                <BsThreeDotsVertical className="drag-handle" />
              </span>
              <div className="productoName">
                {nombre}{" "}
                <span className="fechaCompra">{fechaCompraFormat}</span>
              </div>
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
    );
  }
);

export default memo(DespensaItem);
