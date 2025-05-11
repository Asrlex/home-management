import { useState, useRef, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';
import useProductStore from '../../store/ProductStore';
import useEtiquetaStore from '../../store/TagStore';
import ListaEtiquetas from '../tags/TagSection';
import FAB from '../generic/FloatingButton';
import Modal from '../generic/Modal';
import { FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { TableStyles } from '../../styles/Table.Styles';
import React from 'react';
import { ProductToastMessages } from './entities/products.enum';

const ListaProductos = () => {
  const products = useProductStore((state) => state.products);
  const addProduct = useProductStore((state) => state.addProduct);
  const etiquetasSeleccionadas = useEtiquetaStore(
    (state) => state.etiquetasSeleccionadas
  );
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const [page, setPage] = useState(0);
  const [nameError, setNameError] = useState(false);
  const [unitError, setUnitError] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const productoDialogRef = useRef(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const unitRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSort = (key: any) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = [...products].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const unit = unitRef.current.value;
    setNameError(false);
    setUnitError(false);

    let hasError = false;
    if (!name) {
      setNameError(true);
      hasError = true;
    }
    if (!unit) {
      setUnitError(true);
      hasError = true;
    }
    if (products.some((product) => product.productName === name)) {
      setNameError(true);
      hasError = true;
    }

    if (hasError) return;
    const newProduct = {
      productName: name,
      productUnit: unit,
    };

    addProduct(newProduct)
      .then(() => toast.success(ProductToastMessages.AddedProductSuccess))
      .catch((error) => {
        toast.error(ProductToastMessages.AddedProductError + ': ' + error.message);
      });
    productoDialogRef.current.close();
    nameRef.current.value = '';
    unitRef.current.value = '';
  };

  const popup = (
    <Modal ref={productoDialogRef}>
      <h2 className='modalTitulo'>Crear producto</h2>
      <form>
        <div
          style={{
            marginBottom: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <input
            className='modalInput'
            id='titulo'
            ref={nameRef}
            placeholder='Nombre'
            style={{
              borderColor: nameError ? 'red' : '',
              borderWidth: nameError ? '2px' : '',
            }}
          />
          {nameError && (
            <span style={{ color: 'red', fontSize: '0.8rem' }}>
              {products.some(
                (product) =>
                  product.productName === nameRef.current.value.trim()
              )
                ? 'El producto ya existe'
                : 'Este campo es obligatorio'}
            </span>
          )}
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <input
            className='modalInput'
            id='unidad'
            ref={unitRef}
            placeholder='Unidad'
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            type='submit'
            className='modalBoton'
            onClick={handleAddProduct}
          >
            Crear
          </button>
        </div>
      </form>
    </Modal>
  );

  return (
    <>
      {popup}
      <ListaEtiquetas tipo='Product' />
      <div className='productsTable'>
        <TableContainer component={Paper} sx={TableStyles.table}>
          <Table stickyHeader aria-label='sticky table' size='small'>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={TableStyles.tableHeaderCell}
                  onClick={() => handleSort('productID')}
                >
                  ID{' '}
                  {sortConfig.key === 'productID'
                    ? sortConfig.direction === 'asc'
                      ? '↑'
                      : '↓'
                    : ''}
                </TableCell>
                <TableCell
                  sx={TableStyles.tableHeaderCell}
                  onClick={() => handleSort('productName')}
                >
                  Nombre{' '}
                  {sortConfig.key === 'productName'
                    ? sortConfig.direction === 'asc'
                      ? '↑'
                      : '↓'
                    : ''}
                </TableCell>
                <TableCell
                  sx={TableStyles.tableHeaderCell}
                  onClick={() => handleSort('productUnit')}
                >
                  Unidad{' '}
                  {sortConfig.key === 'productUnit'
                    ? sortConfig.direction === 'asc'
                      ? '↑'
                      : '↓'
                    : ''}
                </TableCell>
                <TableCell
                  sx={TableStyles.tableHeaderCell}
                  onClick={() => handleSort('productDateLastBought')}
                >
                  Comprado{' '}
                  {sortConfig.key === 'productDateLastBought'
                    ? sortConfig.direction === 'asc'
                      ? '↑'
                      : '↓'
                    : ''}
                </TableCell>
                <TableCell
                  sx={TableStyles.tableHeaderCell}
                  onClick={() => handleSort('productDateLastConsumed')}
                >
                  Consumido{' '}
                  {sortConfig.key === 'productDateLastConsumed'
                    ? sortConfig.direction === 'asc'
                      ? '↑'
                      : '↓'
                    : ''}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedItems
                .filter((producto) => {
                  if (etiquetasSeleccionadas.length === 0) return true;
                  return etiquetasSeleccionadas.some((etiqueta) =>
                    producto.tags.some(
                      (prodEtiqueta) => prodEtiqueta.tagID === etiqueta.tagID
                    )
                  );
                })
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product, index) => (
                  <TableRow
                    hover
                    key={product.productID}
                    sx={TableStyles.tableRow}
                  >
                    <TableCell sx={TableStyles.tableCell}>
                      {product.productID}
                    </TableCell>
                    <TableCell sx={TableStyles.tableCell}>
                      {product.productName}
                    </TableCell>
                    <TableCell sx={TableStyles.tableCell}>
                      {product.productUnit}
                    </TableCell>
                    <TableCell sx={TableStyles.tableCell}>
                      {product.productDateLastBought.slice(0, 10)}
                    </TableCell>
                    <TableCell sx={TableStyles.tableCell}>
                      {product.productDateLastConsumed}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component='div'
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={TableStyles.tablePagination}
          slotProps={TableStyles.tablePaginationSlots}
        />
      </div>
      <div className='seccionBotones'>
        <FAB
          icon={<FaPlus />}
          action={() => productoDialogRef.current.open()}
          classes='floatingButton'
        />
      </div>
    </>
  );
};

export default ListaProductos;
