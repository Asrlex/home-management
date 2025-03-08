import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";
import { AiFillDelete, AiOutlineEdit } from "react-icons/ai";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Tarea({
  tarea,
  toggleCompletada,
  handleEliminar,
  handleEditar,
  handleChange,
  expanded,
}) {

  return (
    <Accordion key={tarea.taskID}
      expanded={expanded === tarea.taskID}
      onChange={handleChange(tarea.taskID)} 
      slotProps={{ heading: { component: 'h4' } }}
      classes={{ root: `tarea ${tarea.taskCompleted ? 'opacity-30' : ''}`}}
      sx={{ backgroundColor: 'var(--item-bg-color)' }}
    >
      <AccordionSummary
        className="tituloTarea"
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${tarea.taskID}-content`}
        id={`${tarea.taskID}-header`}
      >
        <Typography component="span" classes={{ root: 'flex items-center' }}>
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
          <span className="tituloTarea">
            {tarea.taskTitle}
          </span>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className={`descTarea`}>
          {tarea.taskDescription}
          <span className="ps-4">
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
}
