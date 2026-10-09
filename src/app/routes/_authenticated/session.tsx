import { useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import {
  SESSION_POSITION,
  SESSION_VIEW,
  SessionPage,
  type SessionSearch,
} from "@features/session";

const sessionSearchSchema = z.object({
  at: z
    .enum([SESSION_POSITION.PREV, SESSION_POSITION.NEXT])
    .optional()
    .catch(undefined),
  view: z
    .enum([SESSION_VIEW.BOARD, SESSION_VIEW.ROOM])
    .optional()
    .catch(undefined),
  member: z.string().min(1).optional().catch(undefined),
  week: z.coerce.number().int().positive().optional().catch(undefined),
  day: z.coerce.number().int().positive().optional().catch(undefined),
});

export const Route = createFileRoute("/_authenticated/session")({
  validateSearch: sessionSearchSchema,
  component: SessionRoute,
});

function SessionRoute() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const handleSearchChange = useCallback(
    (next: SessionSearch) => {
      void navigate({ search: next });
    },
    [navigate],
  );

  return <SessionPage search={search} onSearchChange={handleSearchChange} />;
}
