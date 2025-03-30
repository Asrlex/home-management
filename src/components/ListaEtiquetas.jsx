import Etiqueta from "./Etiqueta";
import Modal from './generic/Modal';
import useEtiquetaStore from "../store/EtiquetaContext";
import { useRef } from "react";
import { axiosRequest } from "../services/AxiosRequest";
import api_config from "../config/apiconfig";

export default function ListaEtiquetas({ tipo }) {
  const { etiquetas, etiquetasSeleccionadas, addEtiqueta } = useEtiquetaStore((state) => ({
    etiquetas: state.etiquetas,
    etiquetasSeleccionadas: state.etiquetasSeleccionadas,
    addEtiqueta: state.addEtiqueta,
  }));
  const etiquetaDialog = useRef();
  const nombreEtiquetaRef = useRef();

  const saveEtiqueta = async (tagName) => {
    try {
      const response = await axiosRequest('POST', api_config.etiquetas.base, {}, { tagName, tagType: tipo });
      addEtiqueta(response);
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
      <form>
        <input
          type='text'
          placeholder='Nombre'
          className='modalInput'
          ref={nombreEtiquetaRef}
          autoFocus={true}
        />
        <div className="flex justify-center">
          <button
            type='submit'
            className='modalBoton'
            onClick={modalEtiquetaSubmit}
          >
            Crear
          </button>
        </div>
      </form>
    </Modal>;

  return (
    <>
      {popupEtiqueta}
      <div className="etiquetas">
        {etiquetas.filter(e => e.tagType === tipo).map((etiqueta) => (
          <Etiqueta
            key={etiqueta.tagID}
            etiqueta={etiqueta}
            seleccionada={etiquetasSeleccionadas.some(e => e.tagID === etiqueta.tagID)}
          />
        ))}
        <Etiqueta
          key="add"
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