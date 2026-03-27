import { RouterProvider } from "@tanstack/react-router";
import { router } from "@app/router";
import { useAuthStore } from "@features/auth";
import { ToastContainer } from "@shared/ui";
import { ConfirmDialogContainer } from "@shared/components/Feedback";

export function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

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
