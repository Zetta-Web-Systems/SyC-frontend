import { useState } from "react";
import { ChevronDown, Dumbbell } from "lucide-react";
import { SearchableSelect } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import { GroupExerciseModal } from "../../GroupExerciseModal/GroupExerciseModal";
import type { ExerciseGroup } from "../../../types";

interface GroupContextSwitcherProps {
  value: ExerciseGroup | null;
  onChange: (group: ExerciseGroup) => void;
  groups: ExerciseGroup[];
  isLoading?: boolean;
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export function GroupContextSwitcher({
  value,
  onChange,
  groups,
  isLoading,
  onSearch,
  placeholder = "...",
}: GroupContextSwitcherProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingName, setPendingName] = useState("");

  return (
    <>
      <SearchableSelect<ExerciseGroup>
        value={value}
        onChange={(group) => {
          if (group) onChange(group);
        }}
        items={groups}
        isLoading={isLoading}
        onSearch={onSearch}
        getKey={(g) => g.id}
        getLabel={(g) => g.name}
        placeholder={placeholder}
        searchPlaceholder="Buscar grupo..."
        emptyMessage="No se encontraron grupos."
        renderItem={(g) => (
          <span className="flex items-center gap-2">
            <Dumbbell
              size={14}
              aria-hidden="true"
              className="text-neutral-400"
            />
            <span>{g.name}</span>
          </span>
        )}
        onCreate={(query) => {
          setPendingName(query);
          setModalOpen(true);
        }}
        createLabel={(query) => `Crear nuevo grupo "${query}"`}
        clearable={false}
        maxVisibleItems={3}
        renderTrigger={({ open, toggle, label, disabled }) => (
          <button
            type="button"
            onClick={toggle}
            disabled={disabled}
            aria-expanded={open}
            aria-haspopup="listbox"
            className={cn(
              "inline-flex max-w-full items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-0.5 align-baseline text-primary-700 transition-colors xs:px-3 xs:py-1",
              "hover:border-primary-300 hover:bg-primary-50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40",
              open && "border-primary-400 bg-primary-50",
            )}
          >
            <span className="truncate">{label}</span>
            <ChevronDown
              size={20}
              aria-hidden="true"
              className={cn(
                "shrink-0 text-primary-500 transition-transform",
                open && "rotate-180",
              )}
            />
          </button>
        )}
      />

      <GroupExerciseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(group) => {
          onChange(group);
          setModalOpen(false);
        }}
        defaultName={pendingName}
      />
    </>
  );
}

GroupContextSwitcher.displayName = "GroupContextSwitcher";
