import React, { useState } from 'react';
import Select from 'react-select';
import { CarTaskI } from '@/entities/types/home-management.entity';
import { CreateCarTaskDto } from '@/entities/dtos/task.dto';
import { customStyles } from '@/styles/SelectStyles';
import { axiosRequest } from '@/hooks/axiosRequest';
import { HttpEnum } from '@/entities/enums/http.enum';
import { ApiEndpoints, TareasEndpoints } from '@/config/apiconfig';
import toast from 'react-hot-toast';

const defaultCarTask: CarTaskI = {
  carTaskID: 0,
  carTaskName: 'Golosinas',
  carTaskDetails: '',
  carTaskCost: 0,
  carTaskDate: new Date().toISOString().split('T')[0],
};

const CarTasks = () => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateCarTaskDto>(defaultCarTask);
  const [tasks, setTasks] = useState<CarTaskI[]>([
    {
      carTaskID: 1,
      carTaskName: 'Golosinas',
      carTaskDetails: '50 litros',
      carTaskCost: 75,
      carTaskDate: '2025-05-10',
    },
    {
      carTaskID: 2,
      carTaskName: 'Revisión',
      carTaskDetails: 'Cambio de aceite y filtros',
      carTaskCost: 200,
      carTaskDate: '2025-05-09',
    },
    {
      carTaskID: 3,
      carTaskName: 'Presión Ruedas',
      carTaskDetails: '2.5 atm',
      carTaskCost: 0,
      carTaskDate: '2025-05-08',
    },
    {
      carTaskID: 4,
      carTaskName: 'Cambio Aceite',
      carTaskDetails: 'Aceite sintético',
      carTaskCost: 50,
      carTaskDate: '2025-05-07',
    },
    {
      carTaskID: 5,
      carTaskName: 'Sustitución Limpiaparabrisas',
      carTaskDetails: 'Limpiaparabrisas delantero y trasero',
      carTaskCost: 30,
      carTaskDate: '2025-05-06',
    },
    {
      carTaskID: 6,
      carTaskName: 'ITV',
      carTaskDetails: '',
      carTaskCost: 50,
      carTaskDate: '2025-05-05',
    },
  ]);

  const actionOptions = [
    { value: null, label: 'Selecciona...' },
    { value: 'Golosinas', label: 'Golosinas' },
    { value: 'Revisión', label: 'Revisión' },
    { value: 'Presión Ruedas', label: 'Presión Ruedas' },
    { value: 'Cambio Aceite', label: 'Cambio Aceite' },
    { value: 'Sustitución Limpiaparabrisas', label: 'Sustitución Limpiaparabrisas' },
    { value: 'ITV', label: 'ITV' },
  ];

  const handleActionChange = (selectedOption: any) => {
    setSelectedAction(selectedOption?.value || null);
    setFormData(defaultCarTask);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: CreateCarTaskDto = {
      carTaskName: formData.carTaskName,
      carTaskDetails: formData.carTaskDetails,
      carTaskCost: formData.carTaskCost,
      carTaskDate: new Date().toISOString().split('T')[0],
    };

    await axiosRequest(
      HttpEnum.POST,
      ApiEndpoints.hm_url + TareasEndpoints.carAll,
      {},
      newTask
    )
      .then((response) => {
        const createdTask: CarTaskI = response.data;
        setTasks((prev) => [createdTask, ...prev]);
        setFormData(defaultCarTask);
        setSelectedAction(null);
        toast.success('Tarea creada correctamente');
      })
      .catch((error) => {
        console.error('Error creando la tarea:', error);
        toast.error('Error creando la tarea');
      });
  };

  return (
    <div className='carTaskContainer'>
      <form onSubmit={handleSubmit} className='carTaskForm'>
        <div>
          <Select
            options={actionOptions}
            value={actionOptions.find((option) => option.value === selectedAction)}
            onChange={handleActionChange}
            styles={customStyles}
            isSearchable
            className='modalSelect'
            placeholder='Selecciona'
          />
        </div>

        {selectedAction === 'Golosinas' && (
          <>
            <div className='carTaskFormInput'>
              <label>Litros:</label>
              <input
                type='number'
                name='carTaskDetails'
                placeholder='Litros'
                value={formData.carTaskDetails}
                onChange={handleInputChange}
                className='modalInputSmall'
              />
            </div>
            <div className='carTaskFormInput'>
              <label>Coste:</label>
              <input
                type='number'
                name='carTaskCost'
                placeholder='Coste'
                value={formData.carTaskCost}
                onChange={handleInputChange}
                className='modalInputSmall'
              />
            </div>
          </>
        )}

        {selectedAction === 'Revisión' && (
          <>
            <div className='carTaskFormInput'>
              <label>Coste:</label>
              <input
                type='number'
                name='carTaskCost'
                placeholder='Cost'
                value={formData.carTaskCost}
                onChange={handleInputChange}
                className='modalInputSmall'
              />
            </div>
            <div className='carTaskFormInput'>
              <label>Detalles:</label>
              <textarea
                name='carTaskDetails'
                placeholder='Tasks performed'
                value={formData.carTaskDetails}
                onChange={handleInputChange}
                className='modalInput modalTextArea'
              />
            </div>
          </>
        )}

        {selectedAction === 'Presión Ruedas' && (
          <div className='carTaskFormInput'>
            <label>Presión:</label>
            <input
              type='number'
              name='carTaskDetails'
              placeholder='Presión'
              value={formData.carTaskDetails}
              onChange={handleInputChange}
              className='modalInputSmall'
            />
          </div>
        )}

        {selectedAction && (
          <>
            <div className='carTaskFormInput'>
              <label>Fecha:</label>
              <input
                type='date'
                name='carTaskDate'
                value={formData.carTaskDate || new Date().toISOString().split('T')[0]}
                onChange={handleInputChange}
                className='modalInput'
              />
            </div>
            <div className='carTaskFormButtons'>
              <button
                type='submit'
                className='modalBoton'
                disabled={!selectedAction}>
                Guardar
              </button>
              <button
                type='button'
                className='modalBoton'
                onClick={() => setSelectedAction(null)}>
                Cerrar
              </button>
            </div>
          </>
        )}
      </form>
      <hr className='hrSeccion' />
      <div className={'carTaskList carTaskListEmpty ' + (selectedAction && selectedAction === 'Golosinas' ? 'carTaskListRefuel' : selectedAction === 'Revisión' ? 'carTaskListRevision' : selectedAction === 'Presión Ruedas' ? 'carTaskListPressure' : 'carTaskListDefault')}>
        {tasks.map((task) => (
          <div key={task.carTaskID} className='carTaskListItem'>
            <div className='carTaskListItemName'>
              {task.carTaskName}
            </div>
            <div className='carTaskListItemInfo'>
              <span className='carTaskListItemDate'>
                {task.carTaskDate}
              </span>
              <div className='carTaskListItemDetailsContainer'>
                <span className='carTaskListItemDetails'>
                  {task.carTaskDetails}
                </span>
                {task.carTaskCost > 0 && <span className='carTaskListItemCost'>
                  {task.carTaskCost}€
                </span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div >
  );
};

export default CarTasks;