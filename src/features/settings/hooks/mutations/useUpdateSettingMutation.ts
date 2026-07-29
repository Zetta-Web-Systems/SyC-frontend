import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { updateSetting } from "../../services/settings.api";
import { SETTINGS_KEYS } from "../../constants";

interface UpdateSettingVars {
  key: string;
  value: string;
}

export function useUpdateSettingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: UpdateSettingVars) =>
      updateSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.all });
      toast.success("Configuración actualizada", {
        description: "El valor se guardó correctamente.",
      });
    },
  });
}
