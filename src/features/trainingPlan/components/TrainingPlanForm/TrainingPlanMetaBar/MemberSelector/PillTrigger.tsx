import { ChevronDown } from "lucide-react";
import { Pill } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import type { Member } from "@features/members";
import {
  formatMemberMeta,
  memberFullName,
} from "../../../../lib/memberDisplay";
import { TriggerAvatar } from "./TriggerAvatar";

interface PillTriggerProps {
  isOpen: boolean;
  hasError: boolean;
  isTemplate: boolean;
  selectedMember: Member | null;
  templateName: string;
  onClick: () => void;
}

export function PillTrigger({
  isOpen,
  hasError,
  isTemplate,
  selectedMember,
  templateName,
  onClick,
}: PillTriggerProps) {
  const pillName = isTemplate
    ? "Guardar como plantilla"
    : selectedMember
      ? memberFullName(selectedMember)
      : "Elegí un alumno o plantilla";

  const pillMeta = isTemplate
    ? templateName || "Plan reutilizable · sin alumno asignado"
    : selectedMember
      ? formatMemberMeta(selectedMember)
      : "Tocá para elegir destinatario";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-invalid={hasError || undefined}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-full border bg-white py-1.5 pr-2.5 pl-1.5 transition-all sm:w-auto sm:min-w-72.5",
        isOpen
          ? "border-primary-500 shadow-[0_0_0_4px_rgba(75,93,180,0.10)]"
          : "border-neutral-200 hover:border-neutral-300",
        hasError && !isOpen && "border-error",
      )}
    >
      <TriggerAvatar isTemplate={isTemplate} selectedMember={selectedMember} />

      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-1.5 text-sm leading-tight font-semibold text-neutral-900">
          <span className="truncate">{pillName}</span>
          {isTemplate && (
            <Pill size="xs" intent="primary" tone="soft" uppercase>
              Plantilla
            </Pill>
          )}
        </div>
        <div className="mt-0.5 truncate text-xs leading-tight text-neutral-500">
          {pillMeta}
        </div>
      </div>

      <ChevronDown
        size={14}
        aria-hidden="true"
        className={cn(
          "shrink-0 text-neutral-400 transition-transform",
          isOpen && "rotate-180",
        )}
      />
    </button>
  );
}

PillTrigger.displayName = "PillTrigger";
