import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { NotFound, ServerError, GenericError } from "@shared/components/Errors";
import type { RouterContext } from "@app/types/router.types";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: ({ error }) => {
    if (
      error instanceof AxiosError &&
      error.response &&
      error.response.status >= 500
    ) {
      return <ServerError />;
    }

    return <GenericError error={error} />;
  },
});

function RootComponent() {
  return <Outlet />;
}
