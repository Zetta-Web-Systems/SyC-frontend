import type { ReactNode } from "react";
import { DataTableToolbar } from "@shared/components/DataTable";

interface GroupExercisesFiltersProps {
  onSearch: (value: string) => void;
  actions?: ReactNode;
}

export function GroupExercisesFilters({
  onSearch,
  actions,
}: GroupExercisesFiltersProps) {
  return (
    <DataTableToolbar
      filters={[]}
      searchPlaceholder="Buscar"
      onSearch={onSearch}
      actions={actions}
    />
  );
}

GroupExercisesFilters.displayName = "GroupExercisesFilters";
