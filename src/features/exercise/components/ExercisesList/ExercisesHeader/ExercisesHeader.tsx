import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";
import { GroupContextSwitcher } from "../GroupContextSwitcher/GroupContextSwitcher";
import type { ExerciseGroup } from "../../../types";

interface ExercisesHeaderProps {
  currentGroup: ExerciseGroup | null;
  groups: ExerciseGroup[];
  isLoadingGroups?: boolean;
  onGroupSearch?: (query: string) => void;
  onGroupChange: (group: ExerciseGroup) => void;
  onCreate: () => void;
  onBack: () => void;
}

export function ExercisesHeader({
  currentGroup,
  groups,
  isLoadingGroups,
  onGroupSearch,
  onGroupChange,
  onCreate,
  onBack,
}: ExercisesHeaderProps) {
  return (
    <PageHeader
      title={
        <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>Ejercicios de</span>
          <GroupContextSwitcher
            value={currentGroup}
            onChange={onGroupChange}
            groups={groups}
            isLoading={isLoadingGroups}
            onSearch={onGroupSearch}
          />
        </span>
      }
      actions={
        <>
          <Button intent="neutral" variant="outline" onClick={onBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span className="hidden xs:inline">Volver</span>
          </Button>
          <Button intent="primary" onClick={onCreate}>
            <Plus size={16} aria-hidden="true" />
            <span className="hidden xs:inline">Registrar ejercicio</span>
          </Button>
        </>
      }
    />
  );
}

ExercisesHeader.displayName = "ExercisesHeader";
