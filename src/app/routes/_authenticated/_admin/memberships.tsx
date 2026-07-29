import { createFileRoute } from "@tanstack/react-router";
import { MembershipsPage } from "@features/memberPlans";

export const Route = createFileRoute("/_authenticated/_admin/memberships")({
  component: MembershipsPage,
});
