import React, { useState, useEffect, useRef } from 'react';
import { axiosRequest } from '../../../hooks/useAxiosRequest';
import toast from 'react-hot-toast';
import { LuWashingMachine, LuCookingPot, LuDog, LuBath } from 'react-icons/lu';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { PiHandSoap, PiBroom } from 'react-icons/pi';
import { HttpEnum } from '@/entities/enums/http.enum';
import { ApiEndpoints, TareasEndpoints } from '@/config/apiconfig';
import { ContextMenu } from 'primereact/contextmenu';
import { RiDeleteBinLine } from 'react-icons/ri';
import { HouseTaskI } from '@/entities/types/home-management.entity';

const TareasCasa = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTaskName, setFilteredTaskName] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [shadow, setShadow] = useState({ top: false, bottom: false });
  const listRef = useRef(null);
  const contextMenuRef = useRef(null);
  const [activeHouseTask, setActiveHouseTask] = useState<HouseTaskI>(null);

  const tasksList = [
    {
      name: 'Lavadora',
      icon: <LuWashingMachine className="houseTaskIcon" />,
    },
    {
      name: 'Lavaplatos',
      icon: <PiHandSoap className="houseTaskIcon" />,
    },
    { name: 'Baños', icon: <LuBath className="houseTaskIcon" /> },
    { name: 'Barrer', icon: <PiBroom className="houseTaskIcon" /> },
    { name: 'Cocinar', icon: <LuCookingPot className="houseTaskIcon" /> },
    { name: 'Pasear', icon: <LuDog className="houseTaskIcon" /> },
    {
      name: 'Compra',
      icon: <MdOutlineShoppingCart className="houseTaskIcon" />,
    },
  ];

  useEffect(() => {
    axiosRequest(HttpEnum.GET, ApiEndpoints.hm_url + TareasEndpoints.homeAll)
      .then((response) => {
        const responseData = response.data as HouseTaskI[];
        const sortedTasks = responseData.sort(
          (a: HouseTaskI, b: HouseTaskI) => {
            const dateA = new Date(a.houseTaskDate);
            const dateB = new Date(b.houseTaskDate);
            return dateB.getTime() - dateA.getTime();
          }
        );
        setTasks(sortedTasks);
      })
      .catch((error) => console.error('Error leyendo tareas:', error));
  }, []);

  useEffect(() => {
    const updateShadow = () => {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      setShadow((shadow) => ({
        ...shadow,
        top: scrollTop > 0,
        bottom: scrollTop < scrollHeight - clientHeight,
      }));
    };

    updateShadow();
    listRef.current.addEventListener('scroll', updateShadow);
  }, [tasks]);

  const handleTaskClick = (taskName: string) => {
    const task = {
      houseTaskName: taskName,
    };

    axiosRequest(
      HttpEnum.POST,
      ApiEndpoints.hm_url + TareasEndpoints.home,
      {},
      task
    )
      .then((response) => {
        setTasks([response.data, ...tasks]);
        toast.success(`Tarea ${taskName} añadida correctamente`);
      })
      .catch((error) => {
        toast.error(`Error añadiendo tarea`);
        console.error(`Error añadiendo tarea: ${error.response.data.message}`);
      });
  };

  const handleTaskNameClick = (taskName: string) => {
    setFilteredTaskName(filteredTaskName === taskName ? null : taskName);
  };

  const checkDate = (date: string) => {
    const now = new Date();
    const taskDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - taskDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 7;
  };

  const filteredTasks = filteredTaskName
    ? tasks.filter((task) => task.houseTaskName === filteredTaskName)
    : tasks;

  const handleDateClick = (taskId: number) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const handleTaskDelete = (taskId: number) => {
    axiosRequest(
      HttpEnum.DELETE,
      ApiEndpoints.hm_url + TareasEndpoints.home + taskId
    )
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== taskId));
        toast.success('Tarea borrada correctamente');
      })
      .catch((error) => {
        toast.error(`Error borrando tarea`);
        console.error(`Error borrando tarea: ${error.response.data.message}`);
      });
  };

  const contextMenuModel = [
    {
      label: 'Delete',
      icon: <RiDeleteBinLine className="customContextMenuIcon" />,
      command: () => handleTaskDelete(activeHouseTask.houseTaskID),
    },
  ];

  return (
    <>
      <div className="tareas">
        <ContextMenu
          className="customContextMenu"
          model={contextMenuModel}
          ref={contextMenuRef}
        />
        <div className="houseTaskButtons">
          {tasksList.map((task, index) => (
            <button
              key={index}
              onClick={() => handleTaskClick(task.name)}
              className="houseTaskButton"
            >
              {task.icon}
              <span className="houseTaskButtonText">{task.name}</span>
            </button>
          ))}
        </div>
        <hr className="hrSeccion" />
        <div className="houseTaskTitle">Tareas completadas</div>
        <div
          ref={listRef}
          className={`houseTaskList ${shadow.top ? 'shadow-top' : ''} ${
            shadow.bottom ? 'shadow-bottom' : ''
          }`}
        >
          {filteredTasks.map((task, index) => (
            <div
              key={index}
              className={
                'houseTaskItem ' +
                (checkDate(task.houseTaskDate) ? 'houseTaskItemOld' : '')
              }
              onContextMenu={(e) => {
                e.preventDefault();
                setActiveHouseTask(task);
                console.log('Selected task:', task);
                contextMenuRef.current.show(e);
              }}
            >
              <span
                className="houseTaskName"
                onClick={() => handleTaskNameClick(task.houseTaskName)}
              >
                {task.houseTaskName}
              </span>
              <span
                className="houseTaskDate"
                title={task.houseTaskDate}
                onClick={() => handleDateClick(task.id)}
              >
                {expandedTask === task.id
                  ? task.houseTaskDate
                  : task.houseTaskDate.split(' ')[0]}
              </span>{' '}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TareasCasa;
