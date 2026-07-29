import { Card } from "@shared/ui";
import type { Setting } from "../types";
import { SettingRow } from "./SettingsGroupCard/SettingRow";

interface SettingsGroupCardProps {
  title: string;
  description: string;
  settings: Setting[];
  onUpdate: (key: string, value: string) => void;
}

export function SettingsGroupCard({
  title,
  description,
  settings,
  onUpdate,
}: SettingsGroupCardProps) {
  return (
    <Card surface="panel" padding="lg" className="flex flex-col">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
        <p className="text-xs text-neutral-500">{description}</p>
      </div>

      {settings.length === 0 ? (
        <p className="mt-3 text-sm text-neutral-400">
          Sin parámetros para mostrar.
        </p>
      ) : (
        <ul className="mt-2 flex flex-col divide-y divide-neutral-100">
          {settings.map((setting) => (
            <SettingRow
              key={setting.key}
              setting={setting}
              onUpdate={onUpdate}
            />
          ))}
        </ul>
      )}
    </Card>
  );
}

SettingsGroupCard.displayName = "SettingsGroupCard";
