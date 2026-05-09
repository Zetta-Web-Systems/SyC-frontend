import { createFileRoute, Link } from "@tanstack/react-router";
import { Flag, ChevronRight, Dumbbell } from "lucide-react";
import { buttonVariants } from "@shared/ui";
import { cn } from "@shared/lib/cn";

export const Route = createFileRoute("/_authenticated/_admin/settings/")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Configuración</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Administra los ajustes de la aplicación.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/settings/risk-flags"
          className={cn(
            buttonVariants({
              variant: "outline",
              intent: "neutral",
              size: "lg",
            }),
            "h-auto justify-between gap-3 rounded-xl px-4 py-4 text-left",
          )}
        >
          <span className="flex items-center gap-3">
            <Flag size={20} className="text-primary-500" aria-hidden="true" />
            <span className="flex flex-col">
              <span className="text-sm font-semibold text-neutral-900">
                Banderas de riesgo
              </span>
              <span className="text-xs font-normal text-neutral-500">
                Gestiona las condiciones médicas y zonas afectadas.
              </span>
            </span>
          </span>
          <ChevronRight
            size={18}
            className="text-neutral-400"
            aria-hidden="true"
          />
        </Link>

        <Link
          to="/settings/group-exercises"
          className={cn(
            buttonVariants({
              variant: "outline",
              intent: "neutral",
              size: "lg",
            }),
            "h-auto justify-between gap-3 rounded-xl px-4 py-4 text-left",
          )}
        >
          <span className="flex items-center gap-3">
            <Dumbbell
              size={20}
              className="text-primary-500"
              aria-hidden="true"
            />
            <span className="flex flex-col">
              <span className="text-sm font-semibold text-neutral-900">
                Grupos de ejercicios
              </span>
              <span className="text-xs font-normal text-neutral-500">
                Administra los grupos de ejercicios y sus zonas afectadas.
              </span>
            </span>
          </span>
          <ChevronRight
            size={18}
            className="text-neutral-400"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}
