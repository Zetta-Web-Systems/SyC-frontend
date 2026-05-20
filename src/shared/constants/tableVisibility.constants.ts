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

export const MEMBER_TABLE_VISIBILITY: ColumnVisibilityConfig = {
  sm: {
    name: true,
    dni: true,
    contact: false,
    trainingGoal: false,
    age: false,
    currentWeight: false,
    estado: false,
    actions: true,
  },
  md: {
    name: true,
    dni: true,
    contact: true,
    trainingGoal: true,
    age: false,
    currentWeight: false,
    estado: true,
    actions: true,
  },
  lg: {
    name: true,
    dni: true,
    contact: true,
    trainingGoal: true,
    age: true,
    currentWeight: true,
    estado: true,
    actions: true,
  },
};

export const RISK_FLAG_TABLE_VISIBILITY: ColumnVisibilityConfig = {
  sm: {
    name: true,
    affectedZones: false,
    estado: true,
    actions: true,
  },
  md: {
    name: true,
    affectedZones: true,
    estado: true,
    actions: true,
  },
  lg: {
    name: true,
    affectedZones: true,
    estado: true,
    actions: true,
  },
};

export const GROUP_EXERCISE_TABLE_VISIBILITY: ColumnVisibilityConfig = {
  sm: {
    name: true,
    affectedZones: false,
    exercisesCount: true,
    actions: true,
  },
  md: {
    name: true,
    affectedZones: true,
    exercisesCount: true,
    actions: true,
  },
  lg: {
    name: true,
    affectedZones: true,
    exercisesCount: true,
    actions: true,
  },
};

export const EXERCISE_TABLE_VISIBILITY: ColumnVisibilityConfig = {
  sm: {
    name: true,
    affectedZones: false,
    estado: false,
    actions: true,
  },
  md: {
    name: true,
    affectedZones: true,
    estado: true,
    actions: true,
  },
  lg: {
    name: true,
    affectedZones: true,
    estado: true,
    actions: true,
  },
};

export const TRAINING_PLAN_TABLE_VISIBILITY: ColumnVisibilityConfig = {
  sm: {
    member: true,
    startDate: true,
    durationInWeeks: false,
    daysPerWeek: false,
    template: false,
    estado: false,
    actions: true,
  },
  md: {
    member: true,
    startDate: true,
    durationInWeeks: true,
    daysPerWeek: true,
    template: true,
    estado: true,
    actions: true,
  },
  lg: {
    member: true,
    startDate: true,
    durationInWeeks: true,
    daysPerWeek: true,
    template: true,
    estado: true,
    actions: true,
  },
};

export const ATTENDANCE_TABLE_VISIBILITY: ColumnVisibilityConfig = {
  sm: {
    name: true,
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
