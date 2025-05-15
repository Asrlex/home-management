import React, {
  useState,
  useRef,
  Fragment,
  useEffect,
} from 'react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import {
  FaPlus,
  FaArrowAltCircleUp,
  FaArrowAltCircleDown,
} from 'react-icons/fa';
import { IoIosRefresh } from 'react-icons/io';
import { InView } from 'react-intersection-observer';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  TouchSensor,
  MouseSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Modal from '../generic/Modal';
import ListaEtiquetas from '../tags/TagSection';
import FAB from '../generic/FloatingButton';
import useProductStore from '../../store/ProductStore';
import useEtiquetaStore from '../../store/TagStore';
import useShoppingListStore from '../../store/ShoppingListStore';
import useStockStore from '../../store/StockStore';
import { axiosRequest } from '../../hooks/axiosRequest';
import { customStyles } from '../../styles/SelectStyles';
import { ApiEndpoints, DespensaEndpoints, ListaCompraEndpoints } from '@/config/apiconfig';
import { HttpEnum } from '@/entities/enums/http.enum';
import { ProductsEnum, ProductToastMessages } from './entities/products.enum';
import { ShoppingListProductI, StockProductI } from '@/entities/types/home-management.entity';
import UnifiedItemComponent from './UnifiedItemComponent';

export default function GestorProductos({ type }) {
  const [prodInView, setProdInView] = useState({
    last: false,
    first: false,
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const etiquetasSeleccionadas = useEtiquetaStore(
    (state) => state.etiquetasSeleccionadas
  );
  const addItemTag = useEtiquetaStore((state) => state.addItemTag);
  const deleteItemTag = useEtiquetaStore((state) => state.deleteItemTag);
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore(
    (state) => state.fetchProducts
  );
  const shoppingListItems = useShoppingListStore(
    (state) => state.shoppingListItems
  );
  const addShoppingListItem = useShoppingListStore(
    (state) => state.addShoppingListItem
  );
  const removeShoppingListItem = useShoppingListStore(
    (state) => state.removeShoppingListItem
  );
  const modifyShoppingListItemAmount = useShoppingListStore(
    (state) => state.modifyShoppingListItemAmount
  );
  const reorderShoppingListItems = useShoppingListStore(
    (state) => state.reorderShoppingListItems
  );
  const fetchShoppingListItems = useShoppingListStore(
    (state) => state.fetchShoppingListItems
  );
  const stockItems = useStockStore((state) => state.stockItems);
  const addStockItem = useStockStore((state) => state.addStockItem);
  const removeStockItem = useStockStore((state) => state.removeStockItem);
  const modifyStockItemAmount = useStockStore(
    (state) => state.modifyStockItemAmount
  );
  const reorderStockItems = useStockStore((state) => state.reorderStockItems);
  const fetchStockItems = useStockStore((state) => state.fetchStockItems);
  const productoDialogRef = useRef(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const lastRef = useRef(null);
  const firstRef = useRef(null);
  const fetchItems =
    type === ProductsEnum.listaCompra ? fetchShoppingListItems : fetchStockItems;
  const items: (StockProductI | ShoppingListProductI)[] =
    type === ProductsEnum.listaCompra ? shoppingListItems : stockItems;
  const addOrRemoveListTag =
    type === ProductsEnum.listaCompra
      ? useShoppingListStore((state) => state.addOrRemoveListTag)
      : useStockStore((state) => state.addOrRemoveListTag);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  /**
   * Custom hook to handle drag and drop events
   */
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  /**
   * Handles the end of a drag event
   * @param {object} event The drag event
   * @param {object} event.active The active element
   * @param {object} event.over The element over which the active element is
   * @param {object} event.active.id The ID of the active element
   * @param {object} event.over.id The ID of the element over which the active element is
   */
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = (
        type === ProductsEnum.listaCompra ? shoppingListItems : stockItems
      ).findIndex(
        (item: StockProductI | ShoppingListProductI) =>
          item[
          type === ProductsEnum.listaCompra ? ProductsEnum.listaCompraID : ProductsEnum.stockID
          ] === active.id
      );
      const newIndex = (
        type === ProductsEnum.listaCompra ? shoppingListItems : stockItems
      ).findIndex(
        (item: StockProductI | ShoppingListProductI) =>
          item[
          type === ProductsEnum.listaCompra ? ProductsEnum.listaCompraID : ProductsEnum.stockID
          ] === over.id
      );
      const newItems = arrayMove(items, oldIndex, newIndex);
      const newOrder = newItems.map((item) =>
        item[
        type === ProductsEnum.listaCompra ? ProductsEnum.listaCompraID : ProductsEnum.stockID
        ]
      );

      type === ProductsEnum.listaCompra
        ? reorderShoppingListItems(newOrder)
        : reorderStockItems(newOrder);
    }
  };

  /**
   * Adds a product to the list
   * @param {number} id The product ID
   * @param {number} amount The amount of the product
   */
  const handleAdd = (id: number, amount: number) => {
    const apiUrl =
      type === ProductsEnum.listaCompra
        ? ApiEndpoints.hm_url + ListaCompraEndpoints.base
        : ApiEndpoints.hm_url + DespensaEndpoints.base;
    const addItem =
      type === ProductsEnum.listaCompra ? addShoppingListItem : addStockItem;
    axiosRequest(
      HttpEnum.POST,
      apiUrl,
      {},
      {
        [type === ProductsEnum.listaCompra ? ProductsEnum.listaCompraAmount : ProductsEnum.stockAmount]:
          amount,
        storeID: 2,
        [type === ProductsEnum.listaCompra ? ProductsEnum.listaCompraID : ProductsEnum.stockID]:
          id,
      }
    )
      .then((response) => {
        addItem(response.data);
        toast.success(ProductToastMessages.AddedProductSuccess);
      })
      .catch((error) => {
        console.error(error);
        toast.error(ProductToastMessages.AddedProductError);
      });
  };

  /**
   * Deletes a product from the list
   * @param {number} id The product ID
   */
  const handleEliminar = (id: number) => {
    const confirmacion = window.confirm(ProductToastMessages.DeleteProductConfirmation);
    if (confirmacion) {
      const apiUrl =
        type === ProductsEnum.listaCompra
          ? `${ApiEndpoints.hm_url + ListaCompraEndpoints.base}/${id}`
          : `${ApiEndpoints.hm_url + DespensaEndpoints.base}/${id}`;
      const removeItem =
        type === ProductsEnum.listaCompra ? removeShoppingListItem : removeStockItem;
      axiosRequest(HttpEnum.DELETE, apiUrl)
        .then(() => {
          removeItem(id);
          toast.success(ProductToastMessages.DeletedProductSuccess);
        })
        .catch((error) => {
          console.error(error);
          toast.error(ProductToastMessages.DeletedProductError);
        });
    }
  };

  /**
   * Modifies the amount of a product
   * @param {number} id The product ID
   * @param {number} amount The new amount
   */
  const handleAmount = (id: number, amount: number) => {
    const apiUrl =
      type === ProductsEnum.listaCompra
        ? `${ApiEndpoints.hm_url + ListaCompraEndpoints.modifyAmount}${id}`
        : `${ApiEndpoints.hm_url + DespensaEndpoints.modifyAmount}${id}`;
    const modifyItemAmount =
      type === ProductsEnum.listaCompra
        ? modifyShoppingListItemAmount
        : modifyStockItemAmount;

    axiosRequest(
      HttpEnum.PUT,
      apiUrl,
      { amount }
    )
      .then(() => {
        modifyItemAmount(id, amount);
        toast.success(ProductToastMessages.ModifyAmountSuccess);
      })
      .catch((error) => {
        console.error(error);
        toast.error(ProductToastMessages.ModifyAmountError);
      });
  };

  /**
   * Moves a product from one list to the other
   * @param {number} id The product ID
   */
  const handleMover = (id: number) => {
    const apiUrl =
      type === ProductsEnum.listaCompra
        ? `${ApiEndpoints.hm_url + ListaCompraEndpoints.buy}${id}`
        : `${ApiEndpoints.hm_url + DespensaEndpoints.toList}${id}`;
    const removeItem =
      type === ProductsEnum.listaCompra ? removeShoppingListItem : removeStockItem;
    const addItem =
      type === ProductsEnum.listaCompra ? addStockItem : addShoppingListItem;
    axiosRequest(HttpEnum.PUT, apiUrl)
      .then((response) => {
        removeItem(id);
        addItem(response.data);
        toast.success(ProductToastMessages.MovedProductSuccess);
      })
      .catch((error) => {
        console.error(error);
        toast.error(ProductToastMessages.MovedProductError);
      });
  };

  /**
   * Adds or removes an etiqueta (tag) from a product
   * @param {number} etiqueta_id The etiqueta ID
   * */
  const addOrRemoveEtiqueta = (etiqueta_id: number, producto: StockProductI | ShoppingListProductI) => {
    const productID = producto.product.productID;
    const etiqueta = etiquetasSeleccionadas.find(
      (etiqueta) => etiqueta.tagID === etiqueta_id
    );
    if (
      producto.product.tags?.some(
        (prodEtiqueta) => prodEtiqueta.tagID === etiqueta_id
      )
    ) {
      deleteItemTag({ tagID: etiqueta_id, itemID: productID })
        .then(() => {
          addOrRemoveListTag(etiqueta_id, productID);
          toast.success(ProductToastMessages.DeletedTagSuccess);
        })
        .catch((error) => {
          console.error(error);
          toast.error(ProductToastMessages.DeletedTagError);
        });
    } else {
      addItemTag({ tagID: etiqueta_id, itemID: productID })
        .then(() => {
          axiosRequest(HttpEnum.GET, DespensaEndpoints.all)
            .then(() => {
              addOrRemoveListTag(etiqueta_id, productID);
              toast.success(ProductToastMessages.AddedTagSuccess);
            })
            .catch((error) => {
              console.error(error);
              toast.error(ProductToastMessages.AddedTagError);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  /**
   * Handles the submit event of the modal
   * @param {object} e The submit event
   */
  const modalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const handleAmount = parseInt(amountRef.current.value);
    handleAdd(selectedProduct.value, handleAmount);
    productoDialogRef.current.close();
    amountRef.current.value = '';
  };

  /**
   * Options for the Select component
   */
  const productOptions = products
    .sort((a, b) => a.productName.localeCompare(b.productName))
    .map((product) => ({
      value: product.productID,
      label: product.productName,
    }));

  /**
   * The modal to add a product
   */
  const popupProducto = (
    <Modal ref={productoDialogRef}>
      <h2 className='modalTitulo'>Añadir producto</h2>
      <form className='modalSection' onSubmit={modalSubmit}>
        <Select
          options={productOptions}
          onChange={setSelectedProduct}
          placeholder='Seleccionar producto'
          className='modalSelect'
          styles={customStyles}
          isSearchable
        />
        <input
          type='number'
          placeholder='Cantidad'
          className='modalInputSmall'
          ref={amountRef}
        />
        <button type='submit' className='modalBoton'>
          Crear
        </button>
      </form>
    </Modal>
  );

  return (
    <>
      {popupProducto}
      <ListaEtiquetas tipo='Product' />
      <div className={type === ProductsEnum.listaCompra ? 'listaCompra' : 'despensa'}>
        {Array.isArray(items) && items.length === 0 && (
          <div style={{ textAlign: 'center' }}>
            No hay productos en la{' '}
            {type === ProductsEnum.listaCompra ? 'lista de la compra' : 'despensa'}
          </div>
        )}
        <span
          onClick={() => {
            firstRef.current.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <FaArrowAltCircleUp
            className={`iconoScrollTop `}
            style={{
              display: prodInView.first ? 'none' : 'block',
            }}
          />
        </span>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={
              Array.isArray(items)
                ? items.map(
                  (item) =>
                    item[
                    type === ProductsEnum.listaCompra
                      ? ProductsEnum.listaCompraID
                      : ProductsEnum.stockID
                    ]
                )
                : []
            }
            strategy={verticalListSortingStrategy}
          >
            {Array.isArray(items) &&
              items.length > 0 &&
              items
                .filter((producto) => {
                  if (etiquetasSeleccionadas.length === 0) return true;
                  return etiquetasSeleccionadas.some((etiqueta) =>
                    producto.product.tags.some(
                      (prodEtiqueta) => prodEtiqueta.tagID === etiqueta.tagID
                    )
                  );
                })
                .map((producto, index) => (
                  <Fragment
                    key={
                      producto[
                      type === ProductsEnum.listaCompra
                        ? ProductsEnum.listaCompraID
                        : ProductsEnum.stockID
                      ]
                    }
                  >
                    {index === 0 ? (
                      <InView
                        as='div'
                        onChange={(inView) => {
                          setProdInView((state) => ({
                            last: state.last,
                            first: inView,
                          }));
                        }}
                        threshold={0.5}
                      >
                        <UnifiedItemComponent
                          ref={firstRef}
                          producto={producto}
                          handleEliminar={handleEliminar}
                          handleAmount={handleAmount}
                          handleMover={handleMover}
                          addOrRemoveTag={addOrRemoveEtiqueta}
                        />
                      </InView>
                    ) : index === items.length - 1 ? (
                      <InView
                        as='div'
                        onChange={(inView) => {
                          setProdInView((state) => ({
                            last: inView,
                            first: state.first,
                          }));
                        }}
                        threshold={0.5}
                      >
                        <UnifiedItemComponent
                          ref={lastRef}
                          producto={producto}
                          handleEliminar={handleEliminar}
                          handleAmount={handleAmount}
                          handleMover={handleMover}
                          addOrRemoveTag={addOrRemoveEtiqueta}
                        />
                      </InView>
                    ) : (
                      <UnifiedItemComponent
                        producto={producto}
                        handleEliminar={handleEliminar}
                        handleAmount={handleAmount}
                        handleMover={handleMover}
                        addOrRemoveTag={addOrRemoveEtiqueta}
                      />
                    )}
                  </Fragment>
                ))}
          </SortableContext>
        </DndContext>
        <span
          onClick={() => {
            lastRef.current.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <FaArrowAltCircleDown
            className={`iconoScrollBottom `}
            style={{
              display: prodInView.last ? 'none' : 'block',
            }}
          />
        </span>
      </div>
      <div className='seccionBotones'>
        <FAB
          icon={<IoIosRefresh />}
          action={() => fetchItems()}
          classes='refreshButton'
        />
        <FAB
          icon={<FaPlus />}
          action={async () => {
            await fetchProducts();
            productoDialogRef.current.open()
          }}
          classes='floatingButton'
        />
      </div>
    </>
  );
}
