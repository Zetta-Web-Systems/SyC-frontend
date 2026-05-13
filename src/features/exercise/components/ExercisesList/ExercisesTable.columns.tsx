import type { ColumnDef } from "@tanstack/react-table";
import { Dumbbell } from "lucide-react";
import { Avatar, Badge } from "@shared/ui";
import { BODY_ZONE_LABELS, GROUP_DOT_CLASS } from "@shared/constants/bodyZones";
import { getAffectedGroups } from "@shared/utils/bodyZones.utils";
import type { Exercise } from "../../types";
import { EXERCISE_LEVEL_INTENT, EXERCISE_LEVEL_LABELS } from "../../constants";

export const exercisesColumns: ColumnDef<Exercise, unknown>[] = [
  {
    id: "name",
    header: "Nombre",
    meta: { className: "w-[1%] whitespace-nowrap" },
    cell: ({ row }) => {
      const { name, image, exerciseLevel } = row.original;

      return (
        <div className="flex items-center justify-start gap-4">
          <Avatar
            size="md"
            color="neutral"
            src={image ?? null}
            fallback={<Dumbbell size={18} aria-hidden="true" />}
            alt={name}
          />
          <div className="flex flex-col items-start gap-1">
            <span className="font-medium">{name}</span>
            <span className="flex items-center gap-1 text-xs">
              Nivel:{" "}
              <Badge intent={EXERCISE_LEVEL_INTENT[exerciseLevel]} size="sm">
                {EXERCISE_LEVEL_LABELS[exerciseLevel]}
              </Badge>
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "affectedZones",
    header: "Zonas afectadas",
    cell: ({ row }) => {
      const groups = getAffectedGroups(row.original.affectedZones).filter(
        (g) => g.zones.length > 0,
      );

      if (groups.length === 0) {
        return (
          <span className="flex justify-start text-sm italic text-neutral-400">
            Sin zonas
          </span>
        );
      }

      return (
        <div className="flex flex-col gap-1 text-left text-sm">
          {groups.map((group) => (
            <div key={group.label} className="flex items-center gap-2">
              <span
                className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${GROUP_DOT_CLASS[group.label]}`}
              />
              <span className="shrink-0 font-medium text-neutral-700">
                {group.label}:
              </span>
              <span className="text-neutral-600">
                {group.zones.map((z) => BODY_ZONE_LABELS[z]).join(", ")}
              </span>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: "estado",
    header: "Estado",
    meta: { className: "w-[1%] whitespace-nowrap" },
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
