import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { LoginPage } from "@features/auth";

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/_auth/login")({
  validateSearch: loginSearchSchema,
  component: LoginPage,
});
