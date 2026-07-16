import { LoadingState } from "@shared/components/LoadingState/LoadingState";
import { useSettingsQuery } from "./hooks/useSettingsQuery";
import { useUpdateSettingMutation } from "./hooks/mutations/useUpdateSettingMutation";
import { SETTING_GROUPS_META } from "./constants";
import { filterSettingsByGroup } from "./lib/settingGroups";
import { SettingsGroupCard } from "./components/SettingsGroupCard";

export default function SystemParametersPage() {
  const { data: settings, isLoading, isError } = useSettingsQuery();
  const { mutate: updateSetting } = useUpdateSettingMutation();

  const handleUpdate = (key: string, value: string) => {
    updateSetting({ key, value });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-neutral-900 text-xl md:text-3xl">
          Parámetros del sistema
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Ajustá las reglas de negocio configurables de la aplicación
        </p>
      </div>

      {isLoading ? (
        <LoadingState message="Cargando parámetros..." />
      ) : isError || !settings ? (
        <p className="text-sm text-neutral-500">
          No se pudieron cargar los parámetros. Intentá de nuevo más tarde.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {SETTING_GROUPS_META.map((meta) => (
            <SettingsGroupCard
              key={meta.group}
              title={meta.title}
              description={meta.description}
              group={meta.group}
              settings={filterSettingsByGroup(settings, meta.group)}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
