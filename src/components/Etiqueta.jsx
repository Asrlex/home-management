import { RiAddLine, RiDeleteBinLine } from "react-icons/ri";
import useEtiquetaStore from "../store/EtiquetaContext";
import { useRef } from "react";
import { ContextMenu } from 'primereact/contextmenu';
import { axiosRequest } from "../services/AxiosRequest";
import api_config from "../config/apiconfig";

export default function Etiqueta({ etiqueta, seleccionada, handleModal }) {
    const { tagName } = etiqueta;
    const { addToSeleccionadas, removeFromSeleccionadas, deleteEtiqueta } = useEtiquetaStore((state) => ({
        addToSeleccionadas: state.addToSeleccionadas,
        removeFromSeleccionadas: state.removeFromSeleccionadas,
        deleteEtiqueta: state.deleteEtiqueta
    }));
    const cm = useRef(null);
    const contextModel = [
        {
            label: 'Eliminar',
            icon: <RiDeleteBinLine className="me-2 w-3 h-3" />,
            command: () => {
                axiosRequest('DELETE', `${api_config.etiquetas.base}/${etiqueta.tagID}`);
                deleteEtiqueta(etiqueta.tagID);
            }
        }
    ];
    
    return (
        <>
            {tagName !== 'Añadir etiqueta' && <ContextMenu 
                className="customContextMenu"
                model={contextModel}
                ref={cm}
            />}
            <div
                className={`etiqueta
                    ${seleccionada ? 'etiquetaSeleccionada' : ''}
                    ${tagName === 'Añadir etiqueta' ? 'etiquetaAdd' : ''}`
                }
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
                {tagName === 'Añadir etiqueta' ?
                    <RiAddLine className="w-4 h-4"/> :
                    tagName
                }
            </div>
        </>
    );
}