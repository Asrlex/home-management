import { ApiEndpoints, FichajesEndpoints } from '@/config/apiconfig';
import {
  CreateAbsenceDto,
  CreateShiftCheckinDto,
} from '@/entities/dtos/shift.dto';
import { HttpEnum } from '@/entities/enums/http.enum';
import { ShiftI, AbsenceI } from '@/entities/types/home-management.entity';
import { axiosRequest } from '@/hooks/axiosRequest';
import { create } from 'zustand';

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
}

const useShiftStore = create(
  (set): ShiftStore => ({
    shifts: [],
    absences: [],

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
          set((state) => ({
            shifts: [...state.shifts, response.data as ShiftI],
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
          set((state) => ({
            shifts: state.shifts.filter((shift) => shift.shiftID !== shiftID),
          }));
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
          set((state) => ({
            absences: [...state.absences, response.data as AbsenceI],
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
          set((state) => ({
            absences: state.absences.filter(
              (absence) => absence.absenceID !== absenceID
            ),
          }));
        })
        .catch((error) => {
          console.error('Error eliminando ausencia:', error);
        }),
  })
);

export default useShiftStore;
