import type { ColumnDef } from "@tanstack/react-table";
import { BODY_ZONE_LABELS, GROUP_DOT_CLASS } from "@shared/constants/bodyZones";
import { getAffectedGroups } from "@shared/utils/bodyZones.utils";
import type { ExerciseGroup } from "../../types";

export const groupExercisesColumns: ColumnDef<ExerciseGroup, unknown>[] = [
  {
    id: "name",
    header: "Nombre",
    meta: { className: "w-[1%] whitespace-nowrap" },
    cell: ({ row }) => {
      const { name } = row.original;

      return (
        <div className="flex items-center justify-center gap-3">
          <span className="font-medium">{name}</span>
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
        <div className="flex flex-col gap-y-1 text-left text-sm lg:flex-row lg:flex-wrap lg:gap-x-5 xl:flex-col xl:gap-x-0">
          {groups.map((group) => (
            <div key={group.label} className="flex items-start gap-2">
              <span
                className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${GROUP_DOT_CLASS[group.label]}`}
              />
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
                <span className="font-medium text-neutral-700">
                  {group.label}:
                </span>
                <span className="text-neutral-600">
                  {group.zones.map((z) => BODY_ZONE_LABELS[z]).join(", ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    },
  },
];
