import { useState } from "react";
import { EllipsisVertical, Pencil, UserCheck, UserX } from "lucide-react";
import {
  Badge,
  Button,
  Popover,
  PopoverItem,
  PopoverSeparator,
} from "@shared/ui";
import type { RiskFlag } from "../../types";
import { AffectedZonesBadges } from "./RiskFlagContent/AffectedZonesBadges";

interface RiskFlagCardProps {
  riskFlag: RiskFlag;
  onEdit: (riskFlag: RiskFlag) => void;
  onDelete: (riskFlag: RiskFlag) => void;
  onRestore: (riskFlag: RiskFlag) => void;
}

export function RiskFlagCard({
  riskFlag,
  onEdit,
  onDelete,
  onRestore,
}: RiskFlagCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="truncate text-sm font-semibold text-neutral-900">
            {riskFlag.name}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Badge intent={riskFlag.isActive ? "success" : "error"} size="sm">
            {riskFlag.isActive ? "ACTIVO" : "INACTIVO"}
          </Badge>
          <Popover
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            side="bottom"
            align="end"
            trigger={
              <Button
                variant="ghost"
                intent="neutral"
                size="icon"
                aria-label={`Opciones de ${riskFlag.name}`}
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <EllipsisVertical size={16} aria-hidden="true" />
              </Button>
            }
          >
            {riskFlag.isActive ? (
              <>
                <PopoverItem
                  icon={<Pencil color="green" />}
                  onClick={() => {
                    onEdit(riskFlag);
                    setMenuOpen(false);
                  }}
                >
                  Editar
                </PopoverItem>
                <PopoverSeparator />
                <PopoverItem
                  icon={<UserX />}
                  variant="danger"
                  onClick={() => {
                    onDelete(riskFlag);
                    setMenuOpen(false);
                  }}
                >
                  Eliminar
                </PopoverItem>
              </>
            ) : (
              <PopoverItem
                icon={<UserCheck color="#90cbc5" />}
                onClick={() => {
                  onRestore(riskFlag);
                  setMenuOpen(false);
                }}
              >
                Restaurar
              </PopoverItem>
            )}
          </Popover>
        </div>
      </div>

      <hr className="border-neutral-200 my-3" />

      <div className="flex flex-col gap-3 text-xs text-neutral-500">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Zonas afectadas
          </span>
          <AffectedZonesBadges zones={riskFlag.affectedZones} max={3} />
        </div>
      </div>
    </div>
  );
}

RiskFlagCard.displayName = "RiskFlagCard";
