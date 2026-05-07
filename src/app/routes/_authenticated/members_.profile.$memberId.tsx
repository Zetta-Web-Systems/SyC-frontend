import { createFileRoute } from "@tanstack/react-router";
import ProfileMemberPage from "@features/members/pages/ProfileMemberPage";

export const Route = createFileRoute(
  "/_authenticated/members_/profile/$memberId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { memberId } = Route.useParams();
  return <ProfileMemberPage memberId={memberId} />;
}
