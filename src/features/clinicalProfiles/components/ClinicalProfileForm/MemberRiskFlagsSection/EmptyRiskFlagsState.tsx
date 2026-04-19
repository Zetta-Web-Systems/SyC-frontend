import { ShieldAlert } from "lucide-react";

export function EmptyRiskFlagsState() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
      <ShieldAlert size={24} aria-hidden="true" className="text-neutral-400" />
      <p className="text-sm text-neutral-500">
        Este alumno todavía no tiene risk flags asignados.
      </p>
      <p className="text-xs text-neutral-400">
        Usá el buscador de arriba para agregar uno.
      </p>
    </div>
  );
}

EmptyRiskFlagsState.displayName = "EmptyRiskFlagsState";
