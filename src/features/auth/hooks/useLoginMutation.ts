import { useNavigate, useSearch } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { login } from "../services/auth.api";
import { useAuthStore } from "../stores/auth.store";

export function useLoginMutation() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const { redirect: redirectTo } = useSearch({ from: "/_auth/login" });

  return useMutation({
    mutationFn: login,
    meta: { showGlobalError: true },
    onSuccess: (user) => {
      setUser(user);
      navigate({ to: redirectTo ?? "/" });
      toast.success("Sesión iniciada", {});
    },
  });
}
