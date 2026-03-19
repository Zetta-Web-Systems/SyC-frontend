import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Ingresá un correo electrónico válido"),
  password: z
    .string({ error: "La contraseña es requerida" })
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
