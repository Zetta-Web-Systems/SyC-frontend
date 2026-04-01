import { z } from "zod";

const MIN_DNI_LENGTH = 7;
const MAX_DNI_LENGTH = 8;

const MIN_PHONE_LENGTH = 9;
const MAX_PHONE_LENGTH = 15;

const ADDRESS_LENGTH = 255;

const dniField = z
  .string({ error: "El DNI es requerido" })
  .regex(/^\d+$/, "El DNI solo debe contener numeros")
  .min(
    MIN_DNI_LENGTH,
    `El DNI debe tener al menos ${MIN_DNI_LENGTH} caracteres`,
  )
  .max(
    MAX_DNI_LENGTH,
    `El DNI debe tener como máximo ${MAX_DNI_LENGTH} caracteres`,
  );

const nameField = z
  .string({ error: "El nombre es requerido" })
  .min(1, "El nombre es requerido");

const lastnameField = z
  .string({ error: "El apellido es requerido" })
  .min(1, "El apellido es requerido");

const phoneField = z
  .string({ error: "El telefono es requerido" })
  .regex(
    /^\d{2,4}-\d{7}$/,
    "El telefono debe tener el formato: código de área (2-4 dígitos) + número (7 dígitos), ej: 11-1234567",
  )
  .min(
    MIN_PHONE_LENGTH,
    `El telefono debe tener al menos ${MIN_PHONE_LENGTH} caracteres`,
  )
  .max(
    MAX_PHONE_LENGTH,
    `El telefono debe tener como máximo ${MAX_PHONE_LENGTH} caracteres`,
  )
  .or(z.literal(""));

const emergencyPhoneField = z
  .string()
  .regex(
    /^\d{2,4}-\d{7}$/,
    "El telefono de emergencia debe tener el formato: código de área (2-4 dígitos) + número (7 dígitos), ej: 11-1234567",
  )
  .min(
    MIN_PHONE_LENGTH,
    `El telefono de emergencia debe tener al menos ${MIN_PHONE_LENGTH} caracteres`,
  )
  .max(
    MAX_PHONE_LENGTH,
    `El telefono de emergencia debe tener como máximo ${MAX_PHONE_LENGTH} caracteres`,
  )
  .or(z.literal(""));

const addressField = z
  .string({ error: "La direccion es requerida" })
  .max(
    ADDRESS_LENGTH,
    `La direccion debe tener como máximo ${ADDRESS_LENGTH} caracteres`,
  );

export const registerInstructorSchema = z.object({
  name: nameField,
  lastname: lastnameField,
  dni: dniField,
  email: z.email("Ingresa un email valido"),
  phone: phoneField.optional(),
  emergencyPhone: emergencyPhoneField.optional(),
  address: addressField.optional(),
  image: z.instanceof(File).optional().or(z.literal(undefined)),
});

export type RegisterInstructorSchema = z.infer<typeof registerInstructorSchema>;

export const updateInstructorSchema = z.object({
  name: nameField,
  lastname: lastnameField,
  dni: dniField,
  phone: phoneField,
  emergencyPhone: emergencyPhoneField.optional(),
  address: addressField.optional(),
  image: z.instanceof(File).optional().or(z.literal(undefined)),
});

export type UpdateInstructorSchema = z.infer<typeof updateInstructorSchema>;
