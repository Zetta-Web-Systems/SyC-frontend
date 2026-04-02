import { z } from "zod";
import { INSTRUCTOR_VALIDATION as IV } from "./instructor.validation";

const dniField = z
  .string({ error: "El DNI es requerido" })
  .regex(/^\d+$/, "El DNI solo debe contener números")
  .min(
    IV.dni.minLength,
    `El DNI debe tener al menos ${IV.dni.minLength} caracteres`,
  )
  .max(
    IV.dni.maxLength,
    `El DNI debe tener como máximo ${IV.dni.maxLength} caracteres`,
  );

const nameField = z
  .string({ error: "El nombre es requerido" })
  .min(1, "El nombre es requerido");

const lastnameField = z
  .string({ error: "El apellido es requerido" })
  .min(1, "El apellido es requerido");

const phoneField = z
  .string({ error: "El teléfono es requerido" })
  .min(
    IV.phone.minLength,
    `El teléfono debe tener al menos ${IV.phone.minLength} caracteres`,
  )
  .max(
    IV.phone.maxLength,
    `El teléfono debe tener como máximo ${IV.phone.maxLength} caracteres`,
  )
  .regex(
    IV.phone.regex,
    "El teléfono debe tener el formato: código de área (2-4 dígitos) + número (7 dígitos), ej: 11-1234567",
  )
  .optional()
  .or(z.literal(""));

const emergencyPhoneField = z
  .string({ error: "El teléfono de emergencia es requerido" })
  .min(
    IV.phone.minLength,
    `El teléfono debe tener al menos ${IV.phone.minLength} caracteres`,
  )
  .max(
    IV.phone.maxLength,
    `El teléfono debe tener como máximo ${IV.phone.maxLength} caracteres`,
  )
  .regex(
    IV.phone.regex,
    "El teléfono debe tener el formato: código de área (2-4 dígitos) + número (7 dígitos), ej: 11-1234567",
  )
  .optional()
  .or(z.literal(""));

const addressField = z
  .string({ error: "La dirección es requerida" })
  .max(
    IV.address.maxLength,
    `La dirección debe tener como máximo ${IV.address.maxLength} caracteres`,
  )
  .optional()
  .or(z.literal(""));

const imageField = z.instanceof(File).optional().nullable();

export const registerInstructorSchema = z.object({
  name: nameField,
  lastname: lastnameField,
  dni: dniField,
  email: z.email("Ingresa un email válido"),
  phone: phoneField,
  emergencyPhone: emergencyPhoneField,
  address: addressField,
  image: imageField,
});

export type RegisterInstructorSchema = z.infer<typeof registerInstructorSchema>;

export const updateInstructorSchema = z.object({
  name: nameField,
  lastname: lastnameField,
  dni: dniField,
  phone: phoneField,
  emergencyPhone: emergencyPhoneField,
  address: addressField,
  image: imageField,
});

export type UpdateInstructorSchema = z.infer<typeof updateInstructorSchema>;
