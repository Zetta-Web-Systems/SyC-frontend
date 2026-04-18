import { useState } from "react";
import {
  EllipsisVertical,
  FileText,
  MapPin,
  Pencil,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  Badge,
  Button,
  Popover,
  PopoverItem,
  PopoverSeparator,
} from "@shared/ui";
import { GuidelineModal } from "@shared/components/Guideline";
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
  const [guidelineOpen, setGuidelineOpen] = useState(false);
  const hasGuideline = Boolean(
    riskFlag.medicalGuideline && riskFlag.medicalGuideline.trim().length > 0,
  );

  const zonesCount = riskFlag.affectedZones?.length ?? 0;
  const zonesSubtitle =
    zonesCount === 0
      ? "Sin zonas"
      : `${zonesCount} ${zonesCount === 1 ? "zona afectada" : "zonas afectadas"}`;

  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="truncate text-sm font-semibold text-neutral-900">
            {riskFlag.name}
          </p>
          <span className="flex items-center gap-1 text-xs text-neutral-500">
            <MapPin size={12} className="text-red-400" aria-hidden="true" />
            {zonesSubtitle}
          </span>
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
                {hasGuideline && (
                  <>
                    <PopoverItem
                      icon={<FileText color="#4ea49c" />}
                      onClick={() => {
                        setGuidelineOpen(true);
                        setMenuOpen(false);
                      }}
                    >
                      Ver documentación
                    </PopoverItem>
                    <PopoverSeparator />
                  </>
                )}
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
              <>
                {hasGuideline && (
                  <>
                    <PopoverItem
                      icon={<FileText color="#4ea49c" />}
                      onClick={() => {
                        setGuidelineOpen(true);
                        setMenuOpen(false);
                      }}
                    >
                      Ver documentación
                    </PopoverItem>
                    <PopoverSeparator />
                  </>
                )}
                <PopoverItem
                  icon={<UserCheck color="#90cbc5" />}
                  onClick={() => {
                    onRestore(riskFlag);
                    setMenuOpen(false);
                  }}
                >
                  Restaurar
                </PopoverItem>
              </>
            )}
          </Popover>
        </div>
      </div>

      <GuidelineModal
        open={guidelineOpen}
        onClose={() => setGuidelineOpen(false)}
        guideline={riskFlag.medicalGuideline}
        riskFlagName={riskFlag.name}
      />

      <hr className="border-neutral-200 my-3" />

      <div className="flex flex-col gap-1 text-xs text-neutral-500">
        <span className="text-center text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Zonas afectadas
        </span>
        <AffectedZonesBadges zones={riskFlag.affectedZones} max={3} />
      </div>
    </div>
  );
}

RiskFlagCard.displayName = "RiskFlagCard";
