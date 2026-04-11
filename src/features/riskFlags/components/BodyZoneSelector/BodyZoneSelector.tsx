import { RotateCw, X } from "lucide-react";
import { Body } from "@shared/components/BodyHighlighter";
import { Button, Checkbox } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import {
  BODY_ZONE_GROUPS,
  BODY_ZONE_LABELS,
  type BodyZone,
} from "../../constants";
import { useBodyZoneSelector } from "../../hooks/useBodyZoneSelector";

export interface BodyZoneSelectorProps {
  value: BodyZone[];
  onChange: (zones: BodyZone[]) => void;
  id?: string;
  error?: boolean;
  "aria-describedby"?: string;
  disabled?: boolean;
}

export function BodyZoneSelector({
  value,
  onChange,
  id,
  error,
  "aria-describedby": ariaDescribedBy,
  disabled,
}: BodyZoneSelectorProps) {
  const normalizedValue = Array.isArray(value) ? value : [];
  const {
    side,
    toggleSide,
    isSelected,
    toggleZone,
    clearAll,
    bodyData,
    handleBodyPartPress,
    defaultFill,
  } = useBodyZoneSelector({ value: normalizedValue, onChange });

  return (
    <div
      id={id}
      aria-invalid={error || undefined}
      data-invalid={error ? "true" : undefined}
      aria-describedby={ariaDescribedBy}
      className={cn(
        "flex flex-col gap-4 rounded-xl border p-4",
        error ? "border-error" : "border-neutral-200",
      )}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 sm:hidden">
            <Button
              size="sm"
              variant="outline"
              intent="neutral"
              onClick={toggleSide}
              disabled={disabled}
              aria-label="Cambiar vista del cuerpo"
            >
              <RotateCw size={14} aria-hidden="true" />
              {side === "front" ? "Frente" : "Dorso"}
            </Button>
          </div>

          <div className="flex items-center justify-center p-4 sm:hidden">
            <Body
              data={bodyData}
              side={side}
              scale={1.3}
              defaultFill={defaultFill}
              hoverFill="#438e87"
              onBodyPartPress={disabled ? undefined : handleBodyPartPress}
            />
          </div>

          <div className="hidden sm:flex sm:items-start sm:justify-center sm:gap-4 sm:p-2">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium text-neutral-700">
                Frente
              </span>
              <Body
                data={bodyData}
                side="front"
                scale={1}
                defaultFill={defaultFill}
                hoverFill="#438e87"
                onBodyPartPress={disabled ? undefined : handleBodyPartPress}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium text-neutral-700">
                Dorso
              </span>
              <Body
                data={bodyData}
                side="back"
                scale={1}
                defaultFill={defaultFill}
                hoverFill="#438e87"
                onBodyPartPress={disabled ? undefined : handleBodyPartPress}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {BODY_ZONE_GROUPS.map((group) => (
            <fieldset key={group.label} className="flex flex-col gap-2">
              <legend className="text-sm font-semibold text-neutral-800">
                {group.label}
              </legend>

              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                {group.zones.map((zone) => {
                  const checkboxId = `zone-${zone}`;
                  const checked = isSelected(zone);
                  return (
                    <label
                      key={zone}
                      htmlFor={checkboxId}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors",
                        "hover:bg-neutral-50",
                        disabled && "cursor-not-allowed opacity-60",
                      )}
                    >
                      <Checkbox
                        id={checkboxId}
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleZone(zone)}
                      />
                      <span className="select-none text-neutral-700">
                        {BODY_ZONE_LABELS[zone]}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      {normalizedValue.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t border-neutral-200 pt-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {normalizedValue.length} seleccionada
            {normalizedValue.length === 1 ? "" : "s"}
          </span>

          <div className="flex flex-wrap gap-1.5">
            {normalizedValue.map((zone) => (
              <button
                key={zone}
                type="button"
                onClick={() => toggleZone(zone)}
                disabled={disabled}
                className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 hover:bg-primary-100 disabled:opacity-60"
              >
                {BODY_ZONE_LABELS[zone]}
                <X size={12} aria-hidden="true" />
              </button>
            ))}
          </div>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            intent="neutral"
            onClick={clearAll}
            disabled={disabled}
            className="ml-auto"
          >
            Limpiar
          </Button>
        </div>
      )}
    </div>
  );
}

BodyZoneSelector.displayName = "BodyZoneSelector";
