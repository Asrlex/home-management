import { ApiEndpoints, FichajesEndpoints } from '@/config/apiconfig';
import {
  CreateAbsenceDto,
  CreateShiftCheckinDto,
} from '@/entities/dtos/shift.dto';
import { HttpEnum } from '@/entities/enums/http.enum';
import { ShiftI, AbsenceI } from '@/entities/types/home-management.entity';
import { axiosRequest } from '@/hooks/axiosRequest';
import { create } from 'zustand';

type UndoAction =
  | { type: 'addShift'; shift: ShiftI }
  | { type: 'deleteShift'; shift: ShiftI }
  | { type: 'addAbsence'; absence: AbsenceI }
  | { type: 'deleteAbsence'; absence: AbsenceI };

interface ShiftStore {
  shifts: ShiftI[];
  absences: AbsenceI[];
  fetchShifts: () => Promise<void>;
  fetchAbsences: () => Promise<void>;
  fetchShiftsForMonth: (month: string) => Promise<void>;
  addShift: (shift: CreateShiftCheckinDto) => Promise<void>;
  deleteShift: (shiftID: number) => Promise<void>;
  addAbsence: (absence: CreateAbsenceDto) => Promise<void>;
  deleteAbsence: (absenceID: number) => Promise<void>;

  undo: () => void;
  redo: () => void;
  undoStack: UndoAction[];
  redoStack: UndoAction[];
}

const useShiftStore = create(
  (set): ShiftStore => ({
    shifts: [],
    absences: [],
    undoStack: [],
    redoStack: [],

    fetchShifts: async () =>
      await axiosRequest(
        HttpEnum.GET,
        ApiEndpoints.hm_url + FichajesEndpoints.all
      )
        .then((response) => set({ shifts: response.data as ShiftI[] }))
        .catch((error) => console.error('Error leyendo tareas:', error)),

    fetchAbsences: async () =>
      await axiosRequest(
        HttpEnum.GET,
        ApiEndpoints.hm_url + FichajesEndpoints.absence
      )
        .then((response) => set({ absences: response.data as AbsenceI[] }))
        .catch((error) => console.error('Error leyendo ausencias:', error)),

    fetchShiftsForMonth: async (month: string) =>
      await axiosRequest(
        HttpEnum.GET,
        `${ApiEndpoints.hm_url + FichajesEndpoints.byMonth}${month}`
      )
        .then((response) => set({ shifts: response.data as ShiftI[] }))
        .catch((error) => console.error('Error leyendo tareas:', error)),

    addShift: async (shift: CreateShiftCheckinDto) =>
      await axiosRequest(
        HttpEnum.POST,
        ApiEndpoints.hm_url + FichajesEndpoints.base,
        {},
        shift
      )
        .then((response) => {
          const newShift = response.data as ShiftI;
          set((state) => ({
            shifts: [...state.shifts, newShift],
            undoStack: [
              ...state.undoStack,
              { type: 'deleteShift', shift: newShift },
            ],
            redoStack: [],
          }));
        })
        .catch((error) => {
          console.error('Error creando tarea:', error);
        }),

    deleteShift: async (shiftID: number) =>
      await axiosRequest(
        HttpEnum.DELETE,
        `${ApiEndpoints.hm_url + FichajesEndpoints.base}${shiftID}`
      )
        .then(() => {
          set((state) => {
            const shift = state.shifts.find((s) => s.shiftID === shiftID);
            if (!shift) return state;
            return {
              shifts: state.shifts.filter((s) => s.shiftID !== shiftID),
              undoStack: [
                ...state.undoStack,
                { type: 'addShift', shift: shift },
              ],
              redoStack: [],
            };
          });
        })
        .catch((error) => {
          console.error('Error deleting task:', error);
        }),

    addAbsence: async (absence: CreateAbsenceDto) =>
      await axiosRequest(
        HttpEnum.POST,
        ApiEndpoints.hm_url + FichajesEndpoints.absence,
        {},
        absence
      )
        .then((response) => {
          const newAbsence = response.data as AbsenceI;
          set((state) => ({
            absences: [...state.absences, newAbsence],
            undoStack: [
              ...state.undoStack,
              { type: 'deleteAbsence', absence: newAbsence },
            ],
            redoStack: [],
          }));
        })
        .catch((error) => {
          console.error('Error creando ausencia:', error);
        }),

    deleteAbsence: async (absenceID: number) =>
      await axiosRequest(
        HttpEnum.DELETE,
        `${ApiEndpoints.hm_url + FichajesEndpoints.absence}${absenceID}`
      )
        .then(() => {
          set((state) => {
            const absence = state.absences.find(
              (a) => a.absenceID === absenceID
            );
            if (!absence) return state;
            return {
              absences: state.absences.filter((s) => s.absenceID !== absenceID),
              undoStack: [...state.undoStack, { type: 'addAbsence', absence }],
              redoStack: [],
            };
          });
        })
        .catch((error) => {
          console.error('Error eliminando ausencia:', error);
        }),

    undo: async () => {
      const { undoStack } = useShiftStore.getState();
      if (undoStack.length === 0) return;
      const lastAction = undoStack[undoStack.length - 1];
      let redoAction: UndoAction | null = null;

      switch (lastAction.type) {
        case 'addShift':
          await axiosRequest(
            HttpEnum.POST,
            ApiEndpoints.hm_url + FichajesEndpoints.base,
            {},
            lastAction.shift
          ).then((response) => {
            set((state) => ({
              shifts: [...state.shifts, response.data as ShiftI],
            }));
          });
          redoAction = { type: 'deleteShift', shift: lastAction.shift };
          break;
        case 'deleteShift':
          await axiosRequest(
            HttpEnum.DELETE,
            `${ApiEndpoints.hm_url + FichajesEndpoints.base}${lastAction.shift.shiftID}`
          ).then(() => {
            set((state) => ({
              shifts: state.shifts.filter(
                (s) => s.shiftID !== lastAction.shift.shiftID
              ),
            }));
          });
          redoAction = { type: 'addShift', shift: lastAction.shift };
          break;
        case 'addAbsence':
          await axiosRequest(
            HttpEnum.POST,
            ApiEndpoints.hm_url + FichajesEndpoints.absence,
            {},
            lastAction.absence
          ).then((response) => {
            set((state) => ({
              absences: [...state.absences, response.data as AbsenceI],
            }));
          });
          redoAction = { type: 'deleteAbsence', absence: lastAction.absence };
          break;
        case 'deleteAbsence':
          await axiosRequest(
            HttpEnum.DELETE,
            `${ApiEndpoints.hm_url + FichajesEndpoints.absence}${lastAction.absence.absenceID}`
          ).then(() => {
            set((state) => ({
              absences: state.absences.filter(
                (a) => a.absenceID !== lastAction.absence.absenceID
              ),
            }));
          });
          redoAction = { type: 'addAbsence', absence: lastAction.absence };
          break;
      }

      set((state) => ({
        undoStack: state.undoStack.slice(0, -1),
        redoStack: redoAction
          ? [...state.redoStack, redoAction]
          : state.redoStack,
      }));
    },

    redo: async () => {
      const { redoStack } = useShiftStore.getState();
      if (redoStack.length === 0) return;
      const lastAction = redoStack[redoStack.length - 1];
      let undoAction: UndoAction | null = null;

      switch (lastAction.type) {
        case 'addShift':
          await axiosRequest(
            HttpEnum.POST,
            ApiEndpoints.hm_url + FichajesEndpoints.base,
            {},
            lastAction.shift
          ).then((response) => {
            set((state) => ({
              shifts: [...state.shifts, response.data as ShiftI],
            }));
          });
          undoAction = { type: 'deleteShift', shift: lastAction.shift };
          break;
        case 'deleteShift':
          await axiosRequest(
            HttpEnum.DELETE,
            `${ApiEndpoints.hm_url + FichajesEndpoints.base}${lastAction.shift.shiftID}`
          ).then(() => {
            set((state) => ({
              shifts: state.shifts.filter(
                (s) => s.shiftID !== lastAction.shift.shiftID
              ),
            }));
          });
          undoAction = { type: 'addShift', shift: lastAction.shift };
          break;
        case 'addAbsence':
          await axiosRequest(
            HttpEnum.POST,
            ApiEndpoints.hm_url + FichajesEndpoints.absence,
            {},
            lastAction.absence
          ).then((response) => {
            set((state) => ({
              absences: [...state.absences, response.data as AbsenceI],
            }));
          });
          undoAction = { type: 'deleteAbsence', absence: lastAction.absence };
          break;
        case 'deleteAbsence':
          await axiosRequest(
            HttpEnum.DELETE,
            `${ApiEndpoints.hm_url + FichajesEndpoints.absence}${lastAction.absence.absenceID}`
          ).then(() => {
            set((state) => ({
              absences: state.absences.filter(
                (a) => a.absenceID !== lastAction.absence.absenceID
              ),
            }));
          });
          undoAction = { type: 'addAbsence', absence: lastAction.absence };
          break;
      }

      set((state) => ({
        redoStack: state.redoStack.slice(0, -1),
        undoStack: undoAction
          ? [...state.undoStack, undoAction]
          : state.undoStack,
      }));
    },
  })
);

export default useShiftStore;
