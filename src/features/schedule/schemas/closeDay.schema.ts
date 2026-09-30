import { z } from "zod";
import { CLOSURE_TYPE, type ClosureType } from "../constants";

export const CLOSURE_REASON_MAX_LENGTH = 200;

const closureTypeEnum = z.enum(
  Object.values(CLOSURE_TYPE) as [ClosureType, ...ClosureType[]],
);

export const closeDaySchema = z
  .object({
    type: closureTypeEnum,
    startDate: z.string().min(1, "Elegí la fecha de inicio"),
    endDate: z.string().min(1, "Elegí la fecha de fin"),
    reason: z
      .string()
      .max(CLOSURE_REASON_MAX_LENGTH, "La descripción es muy larga")
      .optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    path: ["endDate"],
    error: "No puede ser anterior al inicio",
  });

export type CloseDaySchema = z.infer<typeof closeDaySchema>;
