import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@shared/ui";
import type { RiskFlag } from "../../types";

export const riskFlagsColumns: ColumnDef<RiskFlag, unknown>[] = [
  {
    id: "name",
    header: "Nombre",
    meta: { className: "w-[1%] whitespace-nowrap" },
    cell: ({ row }) => {
      const { name } = row.original;

      return (
        <div className="flex items-center justify-start gap-4">
          <span className="font-medium">{name}</span>
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
