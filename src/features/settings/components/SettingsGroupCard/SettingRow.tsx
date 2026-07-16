import { InlineEditField } from "@shared/ui";
import { formatCurrency } from "@shared/utils/currency.utils";
import type { Setting } from "../../types";

interface SettingRowProps {
  setting: Setting;
  isPrice: boolean;
  onUpdate: (key: string, value: string) => void;
}

export function SettingRow({ setting, isPrice, onUpdate }: SettingRowProps) {
  const numericValue = Number(setting.value);

  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-neutral-700">{setting.description}</span>
      {setting.type === "number" ? (
        <InlineEditField
          type="number"
          value={Number.isFinite(numericValue) ? numericValue : 0}
          min={0}
          onChange={(next) => onUpdate(setting.key, String(next))}
          format={isPrice ? (value) => formatCurrency(value) : undefined}
          inputClassName={isPrice ? "w-24" : undefined}
          ariaLabel={`Editar ${setting.description}`}
        />
      ) : (
        <InlineEditField
          type="text"
          value={setting.value}
          onChange={(next) => onUpdate(setting.key, next)}
          ariaLabel={`Editar ${setting.description}`}
        />
      )}
    </li>
  );
}

SettingRow.displayName = "SettingRow";
