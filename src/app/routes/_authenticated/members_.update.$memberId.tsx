import { createFileRoute } from "@tanstack/react-router";
import UpdateMemberPage from "@features/members/pages/UpdateMemberPage";

export const Route = createFileRoute(
  "/_authenticated/members_/update/$memberId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { memberId } = Route.useParams();
  return <UpdateMemberPage memberId={memberId} />;
}
