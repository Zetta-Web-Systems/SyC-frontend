import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_admin/users")({
  component: UsersPage,
});

function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Usuarios</h1>
      <p className="mt-2 text-neutral-500">Sección en desarrollo.</p>
    </div>
  );
}
