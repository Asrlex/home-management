import Etiqueta from './Etiqueta';
import Modal from './generic/Modal';
import useEtiquetaStore from '../store/TagStore';
import { useEffect, useRef } from 'react';

export default function ListaEtiquetas({ tipo }) {
  const etiquetas = useEtiquetaStore(state => state.etiquetas);
  const addEtiqueta = useEtiquetaStore(state => state.addEtiqueta);
  const etiquetasSeleccionadas = useEtiquetaStore(state => state.etiquetasSeleccionadas);
  const fetchEtiquetas = useEtiquetaStore(state => state.fetchEtiquetas);
  const etiquetaDialog = useRef();
  const nombreEtiquetaRef = useRef();

  useEffect(() => {
    fetchEtiquetas();
  }, []);

  const saveEtiqueta = async (tagName) => {
    try {
      const tagDTO = {
        tagName: tagName,
        tagType: tipo,
      }
      addEtiqueta(tagDTO);
    } catch (error) {
      console.error(error);
    }
  }

  const modalEtiquetaSubmit = (e) => {
    e.preventDefault();
    const tagName = nombreEtiquetaRef.current.value;
    if (!tagName) return;
    saveEtiqueta(tagName);
    etiquetaDialog.current.close();
    nombreEtiquetaRef.current.value = '';
  };

  const popupEtiqueta =
    <Modal
      ref={etiquetaDialog}
    >
      <h2 className='modalTitulo'>
        Añadir etiqueta
      </h2>
      <form className='modalSection'>
        <input
          type='text'
          placeholder='Nombre'
          className='modalInput'
          ref={nombreEtiquetaRef}
          autoFocus={true}
        />
          <button
            type='submit'
            className='modalBoton'
            onClick={modalEtiquetaSubmit}
          >
            Crear
          </button>
      </form>
    </Modal>;

  return (
    <>
      {popupEtiqueta}
      <div className='etiquetas'>
        {etiquetas.filter(e => e.tagType === tipo).map((etiqueta) => (
          <Etiqueta
            key={etiqueta.tagID}
            etiqueta={etiqueta}
            seleccionada={etiquetasSeleccionadas.some(e => e.tagID === etiqueta.tagID)}
          />
        ))}
        <Etiqueta
          key='add'
          etiqueta={{
            tagName: 'Añadir etiqueta',
            color: '#fff'
          }}
          handleModal={() => {
            etiquetaDialog.current.open()
            nombreEtiquetaRef.current.focus();
          }}
        />
      </div>
    </>
  );
}