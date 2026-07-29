import { z } from "zod";
import { INSTRUCTOR_VALIDATION as IV } from "./instructor.validation";

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
    IV.dni.minLength,
    `El DNI debe tener al menos ${IV.dni.minLength} caracteres`,
  )
  .max(
    IV.dni.maxLength,
    `El DNI debe tener como máximo ${IV.dni.maxLength} caracteres`,
  );

const emailField = z.email("Ingresa un email válido");

const phoneField = z
  .string({ error: "El teléfono es requerido" })
  // .min(
  //   IV.phone.minLength,
  //   `El teléfono debe tener al menos ${IV.phone.minLength} caracteres`,
  // )
  // .max(
  //   IV.phone.maxLength,
  //   `El teléfono debe tener como máximo ${IV.phone.maxLength} caracteres`,
  // )
  .regex(
    IV.phone.regex,
    "El teléfono debe tener el formato: código de área (2-4 dígitos) + número (6-8 dígitos), ej: 11-1234567",
  )
  .optional()
  .or(z.literal(""));

const emergencyPhoneField = z
  .string({ error: "El teléfono de emergencia es requerido" })
  // .min(
  //   IV.phone.minLength,
  //   `El teléfono debe tener al menos ${IV.phone.minLength} caracteres`,
  // )
  // .max(
  //   IV.phone.maxLength,
  //   `El teléfono debe tener como máximo ${IV.phone.maxLength} caracteres`,
  // )
  .regex(
    IV.phone.regex,
    "El teléfono debe tener el formato: código de área (2-4 dígitos) + número (6-8 dígitos), ej: 11-1234567",
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

const deleteImageField = z.boolean().optional();

const isAdminField = z.boolean().optional();

export const registerInstructorSchema = z.object({
  name: nameField,
  lastname: lastnameField,
  dni: dniField,
  email: emailField,
  phone: phoneField,
  emergencyPhone: emergencyPhoneField,
  address: addressField,
  image: imageField,
  isAdmin: isAdminField,
});

export type RegisterInstructorSchema = z.infer<typeof registerInstructorSchema>;

export const updateInstructorSchema = z.object({
  name: nameField,
  lastname: lastnameField,
  phone: phoneField,
  emergencyPhone: emergencyPhoneField,
  address: addressField,
  image: imageField,
  deleteImage: deleteImageField,
  isAdmin: isAdminField,
});

export type UpdateInstructorSchema = z.infer<typeof updateInstructorSchema>;
