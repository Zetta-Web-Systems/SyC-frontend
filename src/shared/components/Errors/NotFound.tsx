import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@shared/ui";
import { cn } from "@shared/lib/cn";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-6 min-h-screen bg-neutral-50 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary-600">
        404
      </p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
        Página no encontrada
      </h1>
      <p className="mt-4 max-w-sm text-base text-neutral-500">
        La dirección que buscás no existe o fue movida. Verificá la URL o volvé
        al inicio.
      </p>
      <Link
        to="/"
        className={cn(
          buttonVariants({ variant: "solid", intent: "primary" }),
          "mt-8",
        )}
      >
        Volver al inicio
      </Link>
    </div>
  );
}
