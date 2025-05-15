import Etiqueta from './Tag';
import Modal from '../generic/Modal';
import useEtiquetaStore from '../../store/TagStore';
import { useEffect, useRef } from 'react';
import React from 'react';

interface ListaEtiquetasProps {
  tipo: string;
}

const ListaEtiquetas: React.FC<ListaEtiquetasProps> = ({ tipo }) => {
  const etiquetas = useEtiquetaStore((state) => state.etiquetas);
  const addEtiqueta = useEtiquetaStore((state) => state.addEtiqueta);
  const etiquetasSeleccionadas = useEtiquetaStore(
    (state) => state.etiquetasSeleccionadas
  );
  const fetchEtiquetas = useEtiquetaStore((state) => state.fetchEtiquetas);
  const etiquetaDialog = useRef(null);
  const nombreEtiquetaRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchEtiquetas();
  }, [fetchEtiquetas]);

  const saveEtiqueta = async (tagName) => {
    try {
      const tagDTO = {
        tagName: tagName,
        tagType: tipo,
      };
      addEtiqueta(tagDTO);
    } catch (error) {
      console.error(error);
    }
  };

  const modalEtiquetaSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nombreEtiquetaRef.current) return;
    const tagName = nombreEtiquetaRef.current.value;
    if (!tagName) return;
    saveEtiqueta(tagName);
    etiquetaDialog.current.close();
    nombreEtiquetaRef.current.value = '';
  };

  const popupEtiqueta = (
    <Modal ref={etiquetaDialog}>
      <h2 className="modalTitulo">Añadir etiqueta</h2>
      <form className="modalSection" onSubmit={modalEtiquetaSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          className="modalInput"
          ref={nombreEtiquetaRef}
          autoFocus={true}
        />
        <button type="submit" className="modalBoton">
          Crear
        </button>
      </form>
    </Modal>
  );

  return (
    <>
      {popupEtiqueta}
      <div className="etiquetas">
        {etiquetas
          .filter((e) => e.tagType === tipo)
          .map((etiqueta) => (
            <Etiqueta
              key={etiqueta.tagID}
              etiqueta={etiqueta}
              seleccionada={etiquetasSeleccionadas.some(
                (e) => e.tagID === etiqueta.tagID
              )}
              handleModal={null}
            />
          ))}
        <Etiqueta
          key="add"
          etiqueta={{
            tagName: 'Añadir etiqueta',
            tagID: -1,
            tagType: tipo,
          }}
          seleccionada={false}
          handleModal={() => {
            etiquetaDialog.current.open();
            nombreEtiquetaRef.current.focus();
          }}
        />
      </div>
    </>
  );
};

export default ListaEtiquetas;
