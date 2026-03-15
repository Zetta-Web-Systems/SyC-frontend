import { RouterProvider } from "@tanstack/react-router";
import { router } from "@app/router";
import { useAuthStore } from "@features/auth";

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
    </>
  );
}
