import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@shared/config/queryClient";
import { setLoggingOut } from "@shared/api/api";
import { toast } from "@shared/stores/toast.store";
import { logout } from "../services/auth.api";
import { useAuthStore } from "../stores/auth.store";

function cleanupAuthState(clearAuth: () => void) {
  queryClient.cancelQueries();
  clearAuth();
  queryClient.clear();
}

export function useLogoutMutation() {
  const clearAuth = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    meta: { showGlobalError: false },
    onMutate: () => {
      setLoggingOut(true);
    },
    onSuccess: () => {
      cleanupAuthState(clearAuth);
      navigate({ to: "/login" });
      toast.success("Sesión cerrada", {
        description: "Sesión cerrada correctamente",
      });
    },
    onError: () => {
      cleanupAuthState(clearAuth);
      navigate({ to: "/login" });
      toast.warning("Sesión cerrada", {
        description: "Se cerró la sesión localmente",
      });
    },
    onSettled: () => {
      setLoggingOut(false);
    },
  });
}
