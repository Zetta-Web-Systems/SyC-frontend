import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@shared/ui";
import { confirm } from "@shared/stores/confirm.store";

interface MissingRiskFlagCardProps {
  onRemove: () => void;
}

export function MissingRiskFlagCard({ onRemove }: MissingRiskFlagCardProps) {
  function handleRemove() {
    confirm({
      intent: "danger",
      title: "Eliminar bandera de riesgo",
      description:
        "¿Estás seguro que deseas eliminar esta bandera de riesgo del perfil?",
      confirmLabel: "Eliminar",
      onConfirm: onRemove,
    });
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-dashed border-warning/50 bg-warning/5 px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-warning">
        <AlertTriangle size={16} aria-hidden="true" />
        <span>Bandera de riesgo no encontrada</span>
      </div>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        intent="danger"
        onClick={handleRemove}
        aria-label="Eliminar risk flag"
      >
        <Trash2 size={14} aria-hidden="true" />
      </Button>
    </div>
  );
}

MissingRiskFlagCard.displayName = "MissingRiskFlagCard";
