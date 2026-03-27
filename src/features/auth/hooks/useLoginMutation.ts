import { useNavigate, useSearch } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { login } from "../services/auth.api";
import { useAuthStore } from "../stores/auth.store";
import { USER_ROLE } from "../types";

export function useLoginMutation() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const { redirect: redirectTo } = useSearch({ from: "/_auth/login" });

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      setUser(user);

      const destination =
        user.role === USER_ROLE.ATTENDANCE
          ? "/attendance"
          : (redirectTo ?? "/");

      navigate({ to: destination });
      toast.success("Sesión iniciada", {});
    },
  });
}
