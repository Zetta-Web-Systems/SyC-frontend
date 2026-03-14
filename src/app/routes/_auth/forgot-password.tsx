import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@shared/ui/Card/Card";

export const Route = createFileRoute("/_auth/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <Card className="rounded-xl border border-neutral-100 bg-white p-8 shadow-xl shadow-neutral-200/50">
      {/* TODO: Hacer componente */}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-900">
          Recuperar contraseña
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          Ingresá tu correo electrónico y te enviaremos las instrucciones para
          restablecer tu contraseña.
        </p>
      </div>

      {/* TODO: Conectar cuando se haga el forgot-password */}
      <Card className="rounded-lg border border-neutral-100 bg-neutral-50 p-4 text-center text-sm text-neutral-500">
        Funcionalidad en desarrollo.
      </Card>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-sm font-semibold text-primary-700 hover:underline"
        >
          Volver al inicio de sesión
        </Link>
      </div>
    </Card>
  );
}
