import { RiAddLine, RiDeleteBinLine } from 'react-icons/ri';
import useEtiquetaStore from '../store/TagStore';
import { useRef } from 'react';
import { ContextMenu } from 'primereact/contextmenu';
import { axiosRequest } from '../common/services/AxiosRequest';

export default function Etiqueta({ etiqueta, seleccionada, handleModal }) {
  const { tagName } = etiqueta;
  const addToSeleccionadas = useEtiquetaStore(
    (state) => state.addToSeleccionadas
  );
  const removeFromSeleccionadas = useEtiquetaStore(
    (state) => state.removeFromSeleccionadas
  );
  const deleteEtiqueta = useEtiquetaStore((state) => state.deleteEtiqueta);
  const cm = useRef(null);
  const contextModel = [
    {
      label: 'Eliminar',
      icon: <RiDeleteBinLine className='customContextMenuIcon' />,
      command: () => deleteEtiqueta(etiqueta.tagID),
    },
  ];

  return (
    <>
      {tagName !== 'Añadir etiqueta' && (
        <ContextMenu
          className='customContextMenu'
          model={contextModel}
          ref={cm}
        />
      )}
      <div
        className={`etiqueta
                    ${seleccionada ? 'etiquetaSeleccionada' : ''}
                    ${tagName === 'Añadir etiqueta' ? 'etiquetaAdd' : ''}`}
        onClick={() => {
          if (tagName === 'Añadir etiqueta') {
            handleModal();
            return;
          }
          if (seleccionada) {
            removeFromSeleccionadas(etiqueta.tagID);
          } else {
            addToSeleccionadas(etiqueta);
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          cm.current.show(e);
        }}
      >
        {tagName === 'Añadir etiqueta' ? (
          <RiAddLine className='etiquetaAddIcono' />
        ) : (
          tagName
        )}
      </div>
    </>
  );
}
