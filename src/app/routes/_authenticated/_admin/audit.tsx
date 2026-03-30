import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_admin/audit")({
  component: AuditPage,
});

function AuditPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Auditoría</h1>
      <p className="mt-2 text-neutral-500">Sección en desarrollo.</p>
    </div>
  );
}
