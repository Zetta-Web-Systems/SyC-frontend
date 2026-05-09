import { Plus } from "lucide-react";
import { Button } from "@shared/ui";

interface EmptyStateProps {
  onAdd: () => void;
}

export function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-lg border border-dashed border-neutral-300 bg-neutral-50/50 p-4">
      <p className="text-xs text-neutral-500">
        Agregá links de YouTube u otras URLs como referencia del ejercicio. Se
        previsualizan automáticamente.
      </p>
      <Button intent="neutral" variant="outline" size="sm" onClick={onAdd}>
        <Plus size={14} aria-hidden="true" />
        Agregar primer link
      </Button>
    </div>
  );
}
