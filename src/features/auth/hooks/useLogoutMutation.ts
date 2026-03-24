import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@shared/config/queryClient";
import { toast } from "@shared/stores/toast.store";
import { logout } from "../services/auth.api";
import { useAuthStore } from "../stores/auth.store";

export function useLogoutMutation() {
  const clearAuth = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate({ to: "/login" });
      toast.success("Sesión cerrada", {
        description: "Sesión cerrada correctamente",
      });
    },
    onError: () => {
      // TODO: Ver qué hacer acá, si hacer la petición de nuevo o qué pingos. Por ahora, se cierra pase lo que pase.
      clearAuth();
      queryClient.clear();
      navigate({ to: "/login" });
      toast.warning("Sesión cerrada", {
        description: "Se cerró la sesión localmente",
      });
    },
  });
}
