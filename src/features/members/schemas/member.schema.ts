import { z } from "zod";
import { TrainingGoal } from "../constants";
import { MEMBER_VALIDATION as MV } from "./member.validation";

const nameField = z
  .string({ error: "El nombre es requerido" })
  .min(1, "El nombre es requerido");

const lastnameField = z
  .string({ error: "El apellido es requerido" })
  .min(1, "El apellido es requerido");

const dniField = z
  .string({ error: "El DNI es requerido" })
  .regex(/^\d+$/, "El DNI solo debe contener números")
  .min(
    MV.dni.minLength,
    `El DNI debe tener al menos ${MV.dni.minLength} caracteres`,
  )
  .max(
    MV.dni.maxLength,
    `El DNI debe tener como máximo ${MV.dni.maxLength} caracteres`,
  );

const emailField = z
  .email("Ingresa un email válido")
  .optional()
  .or(z.literal(""));

const phoneField = z
  .string({ error: "El teléfono es requerido" })
  .regex(
    MV.phone.regex,
    "El teléfono debe tener el formato: código de área (2-4 dígitos) + número (6-8 dígitos), ej: 11-1234567",
  )
  .optional()
  .or(z.literal(""));

const emergencyPhoneField = z
  .string({ error: "El teléfono de emergencia es requerido" })
  .regex(
    MV.phone.regex,
    "El teléfono debe tener el formato: código de área (2-4 dígitos) + número (6-8 dígitos), ej: 11-1234567",
  )
  .optional()
  .or(z.literal(""));

const addressField = z
  .string({ error: "La dirección es requerida" })
  .max(
    MV.address.maxLength,
    `La dirección debe tener como máximo ${MV.address.maxLength} caracteres`,
  )
  .optional()
  .or(z.literal(""));

const imageField = z.instanceof(File).optional().nullable();

const deleteImageField = z.boolean().optional();

const bornDateField = z.string().optional().or(z.literal(""));

const currentWeightField = z
  .number({ error: "El peso debe ser un número" })
  .min(
    MV.currentWeight.min,
    `El peso debe ser al menos ${MV.currentWeight.min} kg`,
  )
  .max(
    MV.currentWeight.max,
    `El peso debe ser como máximo ${MV.currentWeight.max} kg`,
  )
  .optional()
  .nullable();

const trainingGoalField = z.nativeEnum(TrainingGoal, {
  error: "Selecciona un objetivo de entrenamiento",
});

const trainingGoalOptionalField = z
  .nativeEnum(TrainingGoal, {
    error: "Selecciona un objetivo de entrenamiento válido",
  })
  .optional()
  .nullable();

export const registerMemberSchema = z.object({
  name: nameField,
  lastname: lastnameField,
  dni: dniField,
  email: emailField,
  phone: phoneField,
  emergencyPhone: emergencyPhoneField,
  address: addressField,
  image: imageField,
  bornDate: bornDateField,
  currentWeight: currentWeightField,
  trainingGoal: trainingGoalField,
});

export type RegisterMemberSchema = z.infer<typeof registerMemberSchema>;

export const updateMemberSchema = z.object({
  name: nameField,
  lastname: lastnameField,
  email: emailField,
  phone: phoneField,
  emergencyPhone: emergencyPhoneField,
  address: addressField,
  image: imageField,
  deleteImage: deleteImageField,
  bornDate: bornDateField,
  currentWeight: currentWeightField,
  trainingGoal: trainingGoalOptionalField,
});

export type UpdateMemberSchema = z.infer<typeof updateMemberSchema>;
