import type { ChangeEvent, MouseEvent } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { Button, Switch } from "@shared/ui";
import { GuidelineButton } from "@shared/components/Guideline";
import { cn } from "@shared/lib/cn";
import { confirm } from "@shared/stores/confirm.store";
import { memberRiskFlagPaths } from "../../../../lib/pathBuilders";
import type { ClinicalProfileFormSchema } from "../../../../schemas/clinicalProfile.schema";

interface MemberRiskFlagCardActionsProps {
  index: number;
  riskFlagName: string;
  guideline?: string;
  onEdit: () => void;
  onRemove: () => void;
}

export function MemberRiskFlagCardActions({
  index,
  riskFlagName,
  guideline,
  onEdit,
  onRemove,
}: MemberRiskFlagCardActionsProps) {
  const { control, setValue } = useFormContext<ClinicalProfileFormSchema>();
  const idName = memberRiskFlagPaths.id(index);
  const isActiveName = memberRiskFlagPaths.isActive(index);

  const memberRiskFlagId = useWatch({ control, name: idName }) as
    | string
    | undefined;
  const isActive = useWatch({ control, name: isActiveName }) as boolean;
  const isExisting = !!memberRiskFlagId;

  function handleRemoveClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
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
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" onClick={onEdit}>
        <Pencil size={14} color="green" />
      </Button>

      {!isExisting && (
        <Button
          variant="ghost"
          intent="danger"
          size="sm"
          onClick={handleRemoveClick}
        >
          <Trash2 size={14} />
        </Button>
      )}

      <GuidelineButton guideline={guideline} riskFlagName={riskFlagName} />

      {isExisting && (
        <div className="ml-2 flex w-16 flex-col items-center gap-0.5">
          <Switch
            checked={isActive}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValue(isActiveName, e.target.checked, { shouldDirty: true })
            }
            // disabled={!isExisting}
            size="sm"
          />
          <span
            className={cn(
              "rounded-full px-1.75 py-0.5 text-center text-[10px] font-bold uppercase tracking-wider",
              isActive
                ? "bg-success/15 text-success"
                : "bg-neutral-100 text-neutral-500",
            )}
          >
            {isActive ? "Activo" : "Inactivo"}
          </span>
        </div>
      )}
    </div>
  );
}

MemberRiskFlagCardActions.displayName = "MemberRiskFlagCardActions";
