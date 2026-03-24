import { z } from "zod";

const DNI_LENGTH = 8;

const dniField = z
  .string({ error: "El DNI es requerido" })
  .regex(/^\d+$/, "El DNI solo debe contener numeros")
  .length(DNI_LENGTH, `El DNI debe tener exactamente ${DNI_LENGTH} caracteres`);

const nameField = z
  .string({ error: "El nombre es requerido" })
  .min(1, "El nombre es requerido");

const lastnameField = z
  .string({ error: "El apellido es requerido" })
  .min(1, "El apellido es requerido");

export const createInstructorSchema = z.object({
  name: nameField,
  lastname: lastnameField,
  dni: dniField,
  email: z.email("Ingresa un email valido"),
});

export type CreateInstructorSchema = z.infer<typeof createInstructorSchema>;

export const updateInstructorSchema = z.object({
  name: nameField,
  lastname: lastnameField,
  dni: dniField,
});

export type UpdateInstructorSchema = z.infer<typeof updateInstructorSchema>;
