import type { ColumnVisibilityConfig } from "@shared/hooks/useColumnVisibility";

export const INSTRUCTOR_TABLE_VISIBILITY: ColumnVisibilityConfig = {
  sm: {
    name: true,
    dni: true,
    contact: true,
    address: false,
    estado: false,
    actions: true,
  },
  md: {
    name: true,
    dni: true,
    contact: true,
    address: true,
    estado: true,
    actions: true,
  },
  lg: {
    name: true,
    dni: true,
    contact: true,
    address: true,
    estado: true,
    actions: true,
  },
};

export const ATTENDANCE_TABLE_VISIBILITY: ColumnVisibilityConfig = {
  sm: {
    name: false,
    attendanceDate: true,
    arrivalTime: true,
    departureTime: true,
  },
  md: {
    name: true,
    attendanceDate: true,
    arrivalTime: true,
    departureTime: true,
  },
  lg: {
    name: true,
    attendanceDate: true,
    arrivalTime: true,
    departureTime: true,
  },
};
