import { useState } from "react";
import { Dumbbell } from "lucide-react";
import { SearchableSelect } from "@shared/ui";
import { GroupExerciseModal } from "../../GroupExerciseModal/GroupExerciseModal";
import type { ExerciseGroup } from "../../../types";

interface GroupExerciseSelectFieldProps {
  value: ExerciseGroup | null;
  onChange: (group: ExerciseGroup | null) => void;
  groups: ExerciseGroup[];
  isLoading?: boolean;
  onSearch?: (q: string) => void;
  onCreated?: (group: ExerciseGroup) => void;
  error?: boolean;
  disabled?: boolean;
  id?: string;
  "aria-describedby"?: string;
}

export function GroupExerciseSelectField({
  value,
  onChange,
  groups,
  isLoading,
  onSearch,
  onCreated,
  error,
  disabled,
  id,
  "aria-describedby": ariaDescribedBy,
}: GroupExerciseSelectFieldProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingName, setPendingName] = useState("");

  return (
    <>
      <SearchableSelect<ExerciseGroup>
        value={value}
        onChange={onChange}
        items={groups}
        isLoading={isLoading}
        onSearch={onSearch}
        getKey={(g) => g.id}
        getLabel={(g) => g.name}
        placeholder="Seleccionar grupo de ejercicios"
        searchPlaceholder="Buscar grupo..."
        emptyMessage="No se encontraron grupos."
        renderItem={(g) => (
          <span className="flex items-center gap-2">
            <Dumbbell size={14} aria-hidden="true" className="text-neutral-400" />
            <span>{g.name}</span>
          </span>
        )}
        onCreate={(query) => {
          setPendingName(query);
          setModalOpen(true);
        }}
        createLabel={(query) => `Crear nuevo grupo "${query}"`}
        error={error}
        disabled={disabled}
        id={id}
        aria-describedby={ariaDescribedBy}
        clearable={false}
      />

      <GroupExerciseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(group) => {
          onChange(group);
          onCreated?.(group);
          setModalOpen(false);
        }}
        defaultName={pendingName}
      />
    </>
  );
}

GroupExerciseSelectField.displayName = "GroupExerciseSelectField";
