import React, { useState, useEffect, useRef } from 'react';
import { axiosRequest } from '../../hooks/axiosRequest';
import toast from 'react-hot-toast';
import { LuWashingMachine, LuCookingPot, LuDog, LuBath } from 'react-icons/lu';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { PiHandSoap, PiBroom } from 'react-icons/pi';
import { HttpEnum } from '@/entities/enums/http.enum';
import { ApiEndpoints, TareasEndpoints } from '@/config/apiconfig';

const TareasCasa = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTaskName, setFilteredTaskName] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [shadow, setShadow] = useState({ top: false, bottom: false });
  const listRef = useRef(null);

  const tasksList = [
    {
      name: 'Lavadora',
      icon: <LuWashingMachine className='houseTaskIcon' />,
    },
    {
      name: 'Lavaplatos',
      icon: <PiHandSoap className='houseTaskIcon' />,
    },
    { name: 'Baños', icon: <LuBath className='houseTaskIcon' /> },
    { name: 'Barrer', icon: <PiBroom className='houseTaskIcon' /> },
    { name: 'Cocinar', icon: <LuCookingPot className='houseTaskIcon' /> },
    { name: 'Pasear', icon: <LuDog className='houseTaskIcon' /> },
    {
      name: 'Compra',
      icon: <MdOutlineShoppingCart className='houseTaskIcon' />,
    },
  ];

  useEffect(() => {
    axiosRequest(HttpEnum.GET, ApiEndpoints.hm_url + TareasEndpoints.home)
      .then((response) => setTasks(response.data))
      .catch((error) => console.error('Error fetching tasks:', error));
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

  const handleTaskClick = (taskName) => {
    const task = {
      houseTaskName: taskName,
    };

    axiosRequest(HttpEnum.POST, ApiEndpoints.hm_url + TareasEndpoints.home, {}, task)
      .then((response) => {
        setTasks([response.data, ...tasks]);
        toast.success(`Task ${taskName} added successfully!`);
      })
      .catch((error) => {
        console.error(error);
        toast.error(`Error adding task: ${error.response.data.message}`);
      });
  };

  const handleTaskNameClick = (taskName) => {
    setFilteredTaskName(filteredTaskName === taskName ? null : taskName);
  };

  const checkDate = (date) => {
    const now = new Date();
    const taskDate = new Date(date);
    const diffTime = Math.abs(now - taskDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 7;
  };

  const filteredTasks = filteredTaskName
    ? tasks.filter((task) => task.houseTaskName === filteredTaskName)
    : tasks;

  const handleDateClick = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  return (
    <>
      <div className='tareas'>
        <div className='houseTaskButtons'>
          {tasksList.map((task, index) => (
            <button
              key={index}
              onClick={() => handleTaskClick(task.name)}
              className='houseTaskButton'
            >
              {task.icon}
              <span className='houseTaskButtonText'>{task.name}</span>
            </button>
          ))}
        </div>
        <hr className='hrSeccion' />
        <div className='houseTaskTitle'>Tareas completadas</div>
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
            >
              <span
                className='houseTaskName'
                onClick={() => handleTaskNameClick(task.houseTaskName)}
              >
                {task.houseTaskName}
              </span>
              <span
                className='houseTaskDate'
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
