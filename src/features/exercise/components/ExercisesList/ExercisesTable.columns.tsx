import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@shared/ui";
import { AffectedZonesBadges } from "@shared/components/AffectedZonesBadges/AffectedZonesBadges";
import type { Exercise } from "../../types";
import { EXERCISE_LEVEL_LABELS } from "../../constants";

const LEVEL_INTENT: Record<
  Exercise["exerciseLevel"],
  "success" | "warning" | "error"
> = {
  "1": "success",
  "2": "warning",
  "3": "error",
};

export const exercisesColumns: ColumnDef<Exercise, unknown>[] = [
  {
    id: "name",
    header: "Nombre",
    meta: { className: "w-[1%] whitespace-nowrap" },
    cell: ({ row }) => (
      <div className="flex items-center justify-start gap-3">
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    id: "exerciseLevel",
    header: "Nivel",
    cell: ({ row }) => {
      const level = row.original.exerciseLevel;
      return (
        <Badge intent={LEVEL_INTENT[level]} size="md">
          {EXERCISE_LEVEL_LABELS[level]}
        </Badge>
      );
    },
  },
  {
    id: "affectedZones",
    header: "Zonas afectadas",
    cell: ({ row }) => (
      <AffectedZonesBadges zones={row.original.affectedZones} />
    ),
  },
  {
    id: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <Badge variant="dot" intent={isActive ? "success" : "error"} size="md">
          {isActive ? "ACTIVO" : "INACTIVO"}
        </Badge>
      );
    },
  },
];
