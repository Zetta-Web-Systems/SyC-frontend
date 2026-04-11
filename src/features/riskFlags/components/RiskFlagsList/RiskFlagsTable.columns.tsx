import type { ColumnDef } from "@tanstack/react-table";
import {
  BODY_ZONE_GROUPS,
  BODY_ZONE_LABELS,
  BODY_ZONE_TO_GROUP_LABEL,
  GROUP_DOT_CLASS,
  type BodyZone,
} from "../../constants";
import { Badge } from "@shared/ui";
import type { RiskFlag, AffectedGroup } from "../../types";

function getAffectedGroups(zones: BodyZone[] | undefined): AffectedGroup[] {
  return BODY_ZONE_GROUPS.map((group) => ({
    label: group.label,
    zones: (zones ?? []).filter(
      (zone) => BODY_ZONE_TO_GROUP_LABEL[zone] === group.label,
    ),
  }));
}

export const riskFlagsColumns: ColumnDef<RiskFlag, unknown>[] = [
  {
    id: "name",
    header: "Nombre",
    meta: { className: "w-[1%] whitespace-nowrap" },
    cell: ({ row }) => {
      const { name, affectedZones } = row.original;
      const activeGroups = getAffectedGroups(affectedZones).filter(
        (g) => g.zones.length > 0,
      );
      const visibleGroups = activeGroups.slice(0, 3);

      return (
        <div className="flex items-center justify-start gap-3">
          <div className="flex -space-x-2">
            {visibleGroups.length === 0 ? (
              <span
                className="inline-block h-5 w-5 rounded-full bg-neutral-300 ring-2 ring-white"
                title="Sin zonas"
              />
            ) : (
              visibleGroups.map((group) => (
                <span
                  key={group.label}
                  className={`inline-block h-5 w-5 rounded-full ring-2 ring-white ${GROUP_DOT_CLASS[group.label]}`}
                  title={group.label}
                />
              ))
            )}
          </div>
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
          <span className="text-sm italic text-neutral-400">Sin zonas</span>
        );
      }

      return (
        <div className="flex flex-col gap-1 text-left text-sm">
          {groups.map((group) => (
            <div key={group.label} className="flex items-start gap-2">
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
