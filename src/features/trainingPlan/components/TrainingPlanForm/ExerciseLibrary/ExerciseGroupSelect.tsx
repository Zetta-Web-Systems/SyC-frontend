import { Dumbbell } from "lucide-react";
import { SearchableSelect } from "@shared/ui";
import type { ExerciseGroup } from "@features/exercise";

interface ExerciseGroupSelectProps {
  value: ExerciseGroup | null;
  onChange: (group: ExerciseGroup | null) => void;
  groups: ExerciseGroup[];
  isLoading?: boolean;
}

export function ExerciseGroupSelect({
  value,
  onChange,
  groups,
  isLoading,
}: ExerciseGroupSelectProps) {
  return (
    <SearchableSelect<ExerciseGroup>
      value={value}
      onChange={onChange}
      items={groups}
      isLoading={isLoading}
      getKey={(g) => g.id}
      getLabel={(g) => g.name}
      placeholder="Todos los grupos"
      searchPlaceholder="Buscar grupo..."
      emptyMessage="Sin grupos."
      clearable
      renderItem={(g) => (
        <span className="flex items-center gap-2">
          <Dumbbell size={14} aria-hidden="true" className="text-neutral-400" />
          <span>{g.name}</span>
        </span>
      )}
    />
  );
}

ExerciseGroupSelect.displayName = "ExerciseGroupSelect";
