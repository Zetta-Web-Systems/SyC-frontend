import { createFileRoute } from "@tanstack/react-router";
import RegisterMemberPage from "@features/members/pages/RegisterMemberPage";

export const Route = createFileRoute("/_authenticated/members_/register")({
  component: RegisterMemberPage,
});
