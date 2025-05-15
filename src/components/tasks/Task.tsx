import { ImCheckboxUnchecked, ImCheckboxChecked } from 'react-icons/im';
import { AiFillDelete, AiOutlineEdit } from 'react-icons/ai';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { TaskI } from '@/entities/types/home-management.entity';

interface TareaProps {
  tarea: TaskI;
  toggleCompletada: (id: number, completada: boolean) => void;
  handleEliminar: (id: number) => void;
  handleEditar: (id: number) => void;
  handleChange: (
    panel: number | false
  ) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
  expanded: number | false;
}

const Tarea: React.FC<TareaProps> = ({
  tarea,
  toggleCompletada,
  handleEliminar,
  handleEditar,
  handleChange,
  expanded,
}) => {
  return (
    <Accordion
      key={tarea.taskID}
      expanded={expanded === tarea.taskID}
      onChange={handleChange(tarea.taskID)}
      classes={{ root: `tarea ${tarea.taskCompleted ? 'opacity-30' : ''}` }}
      sx={{ backgroundColor: 'var(--item-bg-color)' }}
    >
      <AccordionSummary
        className="tituloTarea"
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${tarea.taskID}-content`}
        id={`${tarea.taskID}-header`}
      >
        <Typography
          component="span"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <button className="botonTarea">
            {tarea.taskCompleted ? (
              <ImCheckboxChecked
                className="icono"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCompletada(tarea.taskID, tarea.taskCompleted);
                }}
              />
            ) : (
              <ImCheckboxUnchecked
                className="icono"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCompletada(tarea.taskID, tarea.taskCompleted);
                }}
              />
            )}
          </button>
          <span className="tituloTarea">{tarea.taskTitle}</span>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className={`descTarea`}>
          {tarea.taskDescription}
          <span style={{ paddingInlineStart: '1rem' }}>
            <button className="botonTarea">
              <AiOutlineEdit
                className="icono"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditar(tarea.taskID);
                }}
              />
            </button>
            <button className="botonTarea">
              <AiFillDelete
                className="icono"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEliminar(tarea.taskID);
                }}
              />
            </button>
          </span>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default Tarea;
