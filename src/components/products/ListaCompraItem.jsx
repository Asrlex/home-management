import { RiDeleteBinLine, RiShoppingCartLine } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTag } from "react-icons/fa";
import { useRef, forwardRef } from "react";
import { memo } from "react";
import { ContextMenu } from "primereact/contextmenu";
import ContadorProducto from "./ContadorProducto";
import useEtiquetaStore from "../../store/TagContext";
import useShoppingListStore from "../../store/ShoppingListContext";
import SortableItem from "../generic/SortableItem";

const ListaCompraItem = forwardRef(
  (
    { producto, handleEliminar, handleAmount, handleMover, addOrRemoveTag },
    ref
  ) => {
    const etiquetas = useEtiquetaStore((state) => state.etiquetas);
    const cm = useRef(null);

    const contextModel = [
      {
        label: "Eliminar",
        icon: <RiDeleteBinLine className="me-2 w-3 h-3" />,
        command: () => handleEliminar(producto.product.productID),
      },
      {
        label: "Comprar",
        icon: <RiShoppingCartLine className="me-2 w-3 h-3" />,
        command: () => handleComprar(producto.product.productID),
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
        key={producto.shoppingListProductID}
        id={producto.shoppingListProductID}
      >
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
              <div className="productoName">{producto.product.productName}</div>
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
    );
  }
);

export default memo(ListaCompraItem);
