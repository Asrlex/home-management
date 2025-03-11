import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Tarea from "./Tarea";
import Modal from "./generic/Modal";
import FAB from "./generic/FloatingButton";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import api_config from "../config/apiconfig";
import { axiosRequest } from "../utils/axiosUtils";

export default function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef();
  const tituloRef = useRef();
  const descripcionRef = useRef();

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    axiosRequest("GET", api_config.tareas.all)
      .then((response) => {
        setTareas(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const toggleCompletada = (id, completada) => {
    toast.promise(
      axiosRequest("PATCH", `${api_config.tareas.base}/${id}`, { taskCompleted: !completada })
        .then(() => {
          setTareas(
            tareas.map((tarea) => {
              if (tarea.taskID === id) {
                tarea.taskCompleted = !completada;
              }
              return tarea;
            })
          );
        })
        .catch((error) => {
          console.error(error);
        }),
      {
        loading: "Actualizando tarea...",
        success: `Tarea ${completada ? "abierta" : "cerrada"}`,
        error: (err) => `Error al actualizar tarea: ${err}`,
      }
    );
  };
  const handleEliminar = (id) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de eliminar esta tarea?"
    );
    if (confirmacion) {
      toast.promise(
        axiosRequest("DELETE", `${api_config.tareas.base}/${id}`)
          .then(() => {
            setTareas(tareas.filter((tarea) => tarea.taskID !== id));
          })
          .catch((error) => {
            console.error(error);
          }),
        {
          loading: "Eliminando tarea...",
          success: "Tarea eliminada",
          error: (err) => `Error al eliminar tarea: ${err}`,
        }
      );
    }
  };
  const handleEditar = (id) => {
    const titulo = prompt("Nuevo título");
    const descripcion = prompt("Nueva descripción");
    if (!titulo || !descripcion) {
      return;
    }
    toast.promise(
      axios
        .patch(`http://localhost:3002/api/tareas/${id}`, {
          titulo,
          descripcion,
        })
        .then(() => {
          axios
            .get("http://localhost:3002/api/tareas")
            .then((response) => {
              setTareas(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        }),
      {
        loading: "Actualizando tarea...",
        success: "Tarea actualizada",
        error: (err) => `Error al actualizar tarea: ${err}`,
      }
    );
  };

  const modalSubmit = (e) => {
    e.preventDefault();
    const titulo = tituloRef.current.value;
    const descripcion = descripcionRef.current.value;

    toast.promise(
      axios
        .post("http://localhost:3002/api/tareas", { titulo, descripcion })
        .then((response) => {
          axios
            .get("http://localhost:3002/api/tareas")
            .then((response) => {
              setTareas(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
          dialog.current.close();
          tituloRef.current.value = "";
          descripcionRef.current.value = "";
        })
        .catch((error) => {
          console.error(error);
        }),
      {
        loading: "Creando tarea...",
        success: "Tarea creada",
        error: (err) => `Error al crear tarea: ${err}`,
      }
    );
  };
  const popup = (
    <Modal ref={dialog}>
      <h2 className="modalTitulo">Crear tarea</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="titulo" className="modalLabel">
            Título
          </label>
          <input className="modalInput" id="titulo" ref={tituloRef} />
        </div>
        <div className="mb-3">
          <label htmlFor="descripcion" className="modalLabel">
            Descripción
          </label>
          <textarea
            className="modalInput"
            id="descripcion"
            ref={descripcionRef}
          />
        </div>
        <div className="flex justify-center">
          <button type="submit" className="modalBoton" onClick={modalSubmit}>
            Crear
          </button>
        </div>
      </form>
    </Modal>
  );

  return (
    <>
      {popup}
      <div className="tareas">
        <h1 className="h1Seccion">Tareas abiertas</h1>
        <div className="tareasAbiertas">
          {tareas.filter((t) => !t.taskCompleted).length === 0 && (
            <li className="sinContenido">No hay tareas pendientes</li>
          )}
          {tareas
            .filter((t) => !t.taskCompleted)
            .map((tarea) => (
              <Tarea
                key={tarea.taskID}
                tarea={tarea}
                toggleCompletada={toggleCompletada}
                handleEliminar={handleEliminar}
                handleEditar={handleEditar}
                handleChange={handleChange}
                expanded={expanded}
              />
            ))}
        </div>
        <hr className="hrSeccion" />
        <h1 className="h1Seccion">Tareas cerradas</h1>
        <div className="tareasCerradas">
          {tareas.filter((t) => t.taskCompleted).length === 0 && (
            <li className="sinContenido">No hay tareas completadas</li>
          )}
          {tareas
            .filter((t) => t.taskCompleted)
            .map((tarea) => (
              <Tarea
                key={tarea.taskID}
                tarea={tarea}
                toggleCompletada={toggleCompletada}
                handleEliminar={handleEliminar}
                handleEditar={handleEditar}
                handleChange={handleChange}
                expanded={expanded}
              />
            ))}
        </div>
      </div>
      <div className="seccionBotones">
        <FAB icon={<FaPlus />} action={() => dialog.current.open()} />
      </div>
    </>
  );
}
