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
    fee: false,
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
    fee: true,
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
    fee: true,
    estado: true,
    actions: true,
  },
};

export const BILLING_TABLE_VISIBILITY: ColumnVisibilityConfig = {
  sm: {
    member: true,
    period: false,
    dueStatus: true,
    total: false,
    paid: true,
    notes: false,
    actions: true,
  },
  md: {
    member: true,
    period: true,
    dueStatus: true,
    total: true,
    paid: true,
    notes: false,
    actions: true,
  },
  lg: {
    member: true,
    period: true,
    dueStatus: true,
    total: true,
    paid: true,
    notes: true,
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
    dates: true,
    durationInWeeks: false,
    daysPerWeek: false,
    instructor: false,
    estado: false,
    actions: true,
  },
  md: {
    member: true,
    dates: true,
    durationInWeeks: true,
    daysPerWeek: true,
    instructor: true,
    estado: true,
    actions: true,
  },
  lg: {
    member: true,
    dates: true,
    durationInWeeks: true,
    daysPerWeek: true,
    instructor: true,
    estado: true,
    actions: true,
  },
};

export const ATTENDANCE_TABLE_VISIBILITY: ColumnVisibilityConfig = {
  sm: {
    name: true,
    attendanceDate: true,
    status: true,
    arrivalTime: true,
    departureTime: true,
    mood: false,
    absentReason: false,
  },
  md: {
    name: true,
    attendanceDate: true,
    status: true,
    arrivalTime: true,
    departureTime: true,
    mood: true,
    absentReason: true,
  },
  lg: {
    name: true,
    attendanceDate: true,
    status: true,
    arrivalTime: true,
    departureTime: true,
    mood: true,
    absentReason: true,
  },
};
