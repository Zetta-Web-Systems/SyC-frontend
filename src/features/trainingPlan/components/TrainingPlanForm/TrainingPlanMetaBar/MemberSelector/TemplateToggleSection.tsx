import { useId } from "react";
import { FileText } from "lucide-react";
import { Checkbox, IconBox, Input } from "@shared/ui";
import { cn } from "@shared/lib/cn";

interface TemplateToggleSectionProps {
  isTemplate: boolean;
  templateName: string;
  templateNameError?: string;
  onToggle: () => void;
  onTemplateNameChange: (value: string) => void;
}

export function TemplateToggleSection({
  isTemplate,
  templateName,
  templateNameError,
  onToggle,
  onTemplateNameChange,
}: TemplateToggleSectionProps) {
  const inputId = useId();
  const showError = isTemplate && !!templateNameError;

  return (
    <div
      className={cn(
        "border-b border-neutral-200 transition-colors",
        isTemplate && "bg-primary-400/10",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors",
          !isTemplate && "hover:bg-neutral-50",
        )}
      >
        <IconBox
          size="lg"
          shape="md"
          intent="primary"
          tone={isTemplate ? "solid" : "soft"}
        >
          <FileText size={16} aria-hidden="true" />
        </IconBox>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-neutral-900">
            Guardar como plantilla
          </div>
          <div className="mt-0.5 text-xs leading-snug text-neutral-500">
            Crear un plan reutilizable, sin vincular a un alumno
          </div>
        </div>
        <Checkbox
          checked={isTemplate}
          onChange={onToggle}
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none"
        />
      </button>

      {isTemplate && (
        <div className="px-3.5 pt-1 pb-3">
          <label
            htmlFor={inputId}
            className="mb-1 block text-xs font-semibold tracking-wider text-neutral-500 uppercase"
          >
            Nombre de la plantilla
          </label>
          <Input
            id={inputId}
            value={templateName}
            onChange={(e) => onTemplateNameChange(e.target.value)}
            placeholder="Ingresa el nombre de la plantilla"
            size="sm"
            error={showError}
            errorMessage={showError ? templateNameError : undefined}
          />
        </div>
      )}
    </div>
  );
}

TemplateToggleSection.displayName = "TemplateToggleSection";
