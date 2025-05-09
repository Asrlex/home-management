import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import Tarea from './Tarea';
import Modal from '../generic/Modal';
import FAB from '../generic/FloatingButton';
import { FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { axiosRequest } from '../../hooks/axiosRequest';
import { HttpEnum } from '@/entities/enums/http.enum';
import { ApiEndpoints, TareasEndpoints } from '@/config/apiconfig';
import React from 'react';

interface ModalHandle {
  open: () => void;
  close: () => void;
}

export default function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const dialog = useRef<ModalHandle>();
  const tituloRef = useRef<HTMLInputElement>(null);
  const descripcionRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (panel: boolean) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    axiosRequest(HttpEnum.GET, ApiEndpoints.hm_url + TareasEndpoints.all)
      .then((response) => {
        setTareas(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const toggleCompletada = (id: number, completada: boolean) => {
    axiosRequest(
      HttpEnum.PATCH,
      `${ApiEndpoints.hm_url + TareasEndpoints.base}/${id}`,
      { taskCompleted: !completada },
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
          `Tarea ${!completada ? 'completada' : 'desmarcada como completada'}`
        );
      })
      .catch((error) => {
        console.error(error);
        toast.error(
          `Error al actualizar la tarea: ${error.response.data.message}`
        );
      });
  };

  const handleEliminar = (id: number) => {
    const confirmacion = window.confirm(
      '¿Estás seguro de eliminar esta tarea?'
    );
    if (confirmacion) {
      axiosRequest(
        HttpEnum.DELETE,
        `${ApiEndpoints.hm_url + TareasEndpoints.base}/${id}`
      )
        .then(() => {
          setTareas(tareas.filter((tarea) => tarea.taskID !== id));
          toast.success('Tarea eliminada correctamente');
        })
        .catch((error) => {
          console.error(error);
          toast.error(
            `Error al eliminar la tarea: ${error.response.data.message}`
          );
        });
    }
  };

  const handleEditar = (id: number) => {
    if (!dialog.current) return;
    const tarea = tareas.find((t) => t.taskID === id);
    if (tarea) {
      setIsEditMode(true);
      setCurrentTaskId(id);
      tituloRef.current.value = tarea.taskTitle;
      descripcionRef.current.value = tarea.taskDescription;
      dialog.current.open();
    }
  };

  const modalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tituloRef.current || !descripcionRef.current || !tituloRef.current.value || !descripcionRef.current.value) {
      toast.error('Por favor, completa todos los campos');
      return;
    }
    const taskTitle: string = tituloRef.current.value;
    const taskDescription: string = descripcionRef.current.value;

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
            response.data,
          ]);
          dialog.current.close();
          tituloRef.current.value = '';
          descripcionRef.current.value = '';
          setIsEditMode(false);
          setCurrentTaskId(null);
          toast.success('Tarea actualizada correctamente');
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
          setTareas([response.data, ...tareas]);
          dialog.current.close();
          tituloRef.current.value = '';
          descripcionRef.current.value = '';
          toast.success('Tarea creada correctamente');
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
      <h2 className='modalTitulo'>
        {isEditMode ? 'Editar tarea' : 'Crear tarea'}
      </h2>
      <form className='modalForm' onSubmit={modalSubmit}>
        <input
          className='modalInput'
          id='titulo'
          ref={tituloRef}
          placeholder='Título'
        />
        <textarea
          className='modalInput modalTextArea'
          id='descripcion'
          ref={descripcionRef}
          placeholder='Descripción'
        />
        <button type='submit' className='modalBoton' onClick={modalSubmit}>
          {isEditMode ? 'Actualizar' : 'Crear'}
        </button>
      </form>
    </Modal>
  );

  return (
    <>
      {popup}
      <div className='tareas'>
        <h1 className='h1Seccion'>Tareas abiertas</h1>
        <div className='tareasAbiertas'>
          {tareas.filter((t) => !t.taskCompleted).length === 0 && (
            <li className='sinContenido'>No hay tareas pendientes</li>
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
        <hr className='hrSeccion' />
        <h1 className='h1Seccion'>Tareas cerradas</h1>
        <div className='tareasCerradas'>
          {tareas.filter((t) => t.taskCompleted).length === 0 && (
            <li className='sinContenido'>No hay tareas completadas</li>
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
      <div className='seccionBotones'>
        <FAB
          icon={<FaPlus />}
          action={() => {
            setIsEditMode(false);
            setCurrentTaskId(null);
            tituloRef.current.value = '';
            descripcionRef.current.value = '';
            dialog.current.open();
          }}
          classes='floatingButton'
        />
      </div>
    </>
  );
}
