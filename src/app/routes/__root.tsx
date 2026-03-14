import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { NotFound, GenericError } from "@shared/components/Errors";
import type { AuthUser } from "@features/auth";

interface RouterContext {
  auth: {
    isAuthenticated: boolean;
    user: AuthUser | null;
  };
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ({ error }) => <GenericError error={error} />,
});

function RootComponent() {
  return <Outlet />;
}
