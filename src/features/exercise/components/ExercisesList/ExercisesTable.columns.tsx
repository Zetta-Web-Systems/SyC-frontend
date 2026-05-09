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
    cell: ({ row }) => {
      const { name, exerciseLevel } = row.original;

      return (
        <div className="flex flex-col items-start gap-1">
          <span className="font-medium">{name}</span>
          <span className="flex items-center gap-1 text-xs">
            Nivel:{" "}
            <Badge intent={LEVEL_INTENT[exerciseLevel]} size="sm">
              {EXERCISE_LEVEL_LABELS[exerciseLevel]}
            </Badge>
          </span>
        </div>
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
