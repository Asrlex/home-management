import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Tarea from "./Tarea";
import Modal from "../generic/Modal";
import FAB from "../generic/FloatingButton";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import { axiosRequest } from "../../common/services/AxiosRequest";
import { HttpEnum } from "@/entities/enums/http.enum";
import { ApiEndpoints, TareasEndpoints } from "@/config/apiconfig";

export default function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const dialog = useRef();
  const tituloRef = useRef();
  const descripcionRef = useRef();

  const handleChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    axiosRequest(HttpEnum.GET, ApiEndpoints.hm_url + TareasEndpoints.all)
      .then((response) => {
        setTareas(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const toggleCompletada = (id, completada) => {
    axiosRequest(
      HttpEnum.PATCH,
      `${ApiEndpoints.hm_url + TareasEndpoints.base}/${id}`,
      {taskCompleted: !completada},
    )
      .then(() => {
        setTareas(
          tareas.map((tarea) => {
            if (tarea.taskID === id) {
              tarea.taskCompleted = !completada;
            }
            return tarea;
          })
        );
        toast.success(
          `Tarea ${!completada ? "completada" : "desmarcada como completada"}`
        );
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          `Error al actualizar la tarea: ${error.response.data.message}`
        );
      });
  };

  const handleEliminar = (id) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de eliminar esta tarea?"
    );
    if (confirmacion) {
      axiosRequest(
        HttpEnum.DELETE,
        `${ApiEndpoints.hm_url + TareasEndpoints.base}/${id}`
      )
        .then(() => {
          setTareas(tareas.filter((tarea) => tarea.taskID !== id));
          toast.success("Tarea eliminada correctamente");
        })
        .catch((error) => {
          console.error(error);
          toast.error(
            `Error al eliminar la tarea: ${error.response.data.message}`
          );
        });
    }
  };

  const handleEditar = (id) => {
    const tarea = tareas.find((t) => t.taskID === id);
    if (tarea) {
      setIsEditMode(true);
      setCurrentTaskId(id);
      tituloRef.current.value = tarea.taskTitle;
      descripcionRef.current.value = tarea.taskDescription;
      dialog.current.open();
    }
  };

  const modalSubmit = (e) => {
    e.preventDefault();
    const taskTitle = tituloRef.current.value;
    const taskDescription = descripcionRef.current.value;

    if (isEditMode) {
      axiosRequest(
        HttpEnum.PUT,
        `${ApiEndpoints.hm_url + TareasEndpoints.base}/${currentTaskId}`,
        {},
        {
          taskID: currentTaskId,
          taskTitle,
          taskDescription,
        }
      )
        .then((response) => {
          setTareas([
            ...tareas.filter((t) => t.taskID !== currentTaskId),
            response,
          ]);
          dialog.current.close();
          tituloRef.current.value = "";
          descripcionRef.current.value = "";
          setIsEditMode(false);
          setCurrentTaskId(null);
          toast.success("Tarea actualizada correctamente");
        })
        .catch((error) => {
          console.error(error);
          toast.error(
            `Error al actualizar la tarea: ${error.response.data.message}`
          );
        });
    } else {
      axiosRequest(
        HttpEnum.POST,
        ApiEndpoints.hm_url + TareasEndpoints.base,
        {},
        {
          taskTitle,
          taskDescription,
        }
      )
        .then((response) => {
          setTareas([response, ...tareas]);
          dialog.current.close();
          tituloRef.current.value = "";
          descripcionRef.current.value = "";
          toast.success("Tarea creada correctamente");
        })
        .catch((error) => {
          console.error(error);
          toast.error(
            `Error al crear la tarea: ${error.response.data.message}`
          );
        });
    }
  };

  const popup = (
    <Modal ref={dialog}>
      <h2 className="modalTitulo">
        {isEditMode ? "Editar tarea" : "Crear tarea"}
      </h2>
      <form>
        <div style={{ marginBottom: "0.75rem" }}>
          <input
            className="modalInput"
            id="titulo"
            ref={tituloRef}
            placeholder="Título"
          />
        </div>
        <div style={{ marginBottom: "0.75rem" }}>
          <textarea
            className="modalInput modalTextArea"
            id="descripcion"
            ref={descripcionRef}
            placeholder="Descripción"
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button type="submit" className="modalBoton" onClick={modalSubmit}>
            {isEditMode ? "Actualizar" : "Crear"}
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
        <FAB
          icon={<FaPlus />}
          action={() => {
            setIsEditMode(false);
            setCurrentTaskId(null);
            tituloRef.current.value = "";
            descripcionRef.current.value = "";
            dialog.current.open();
          }}
          classes="floatingButton"
        />
      </div>
    </>
  );
}
