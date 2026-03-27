import { useEffect } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@app/router";
import { useAuthStore, useGetMeQuery } from "@features/auth";
import { ToastContainer } from "@shared/ui";
import { ConfirmDialogContainer } from "@shared/components/Feedback";
import { LoadingState } from "@shared/components/LoadingState/LoadingState";

export function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const { data, isPending } = useGetMeQuery();

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  if (isPending) {
    return <LoadingState message="Cargando" fullHeight spinnerSize="lg" />;
  }

  return (
    <>
      <RouterProvider
        router={router}
        context={{ auth: { isAuthenticated, user } }}
      />
      <ToastContainer />
      <ConfirmDialogContainer />
    </>
  );
}
