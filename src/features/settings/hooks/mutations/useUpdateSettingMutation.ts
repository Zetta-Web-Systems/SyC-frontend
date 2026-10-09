import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { TRAINING_PLANS_KEYS } from "@features/trainingPlan";
import { updateSetting } from "../../services/settings.api";
import { SETTINGS_KEYS } from "../../constants";
import { getSettingGroup } from "../../lib/settingGroups";
import { SETTING_GROUP } from "../../types";

interface UpdateSettingVars {
  key: string;
  value: string;
}

export function useUpdateSettingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: UpdateSettingVars) =>
      updateSetting(key, value),
    onSuccess: (_data, { key }) => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.all });

      if (getSettingGroup(key) === SETTING_GROUP.SEMAFORO) {
        queryClient.invalidateQueries({
          queryKey: TRAINING_PLANS_KEYS.trafficLights(),
        });
      }

      toast.success("Configuración actualizada", {
        description: "El valor se guardó correctamente.",
      });
    },
  });
}
