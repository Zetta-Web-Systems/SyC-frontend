import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { SESSION_KEYS } from "../../constants";
import { registerPresence } from "../../services/session.api";

export function useRegisterPresenceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerPresence,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SESSION_KEYS.boards() });
      toast.success("Asistencia registrada", {
        description: "Ya figura como presente en el turno",
      });
    },
  });
}
