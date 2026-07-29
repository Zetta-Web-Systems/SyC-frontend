import { ChevronDown, UserRoundCheck } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { SearchableSelect } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import {
  useInstructorNamesQuery,
  type InstructorName,
} from "@features/instructors";
import type { RegisterTrainingPlanFormSchema } from "../../../../schemas/registerTrainingPlan.schema";

interface InstructorSelectorProps {
  currentInstructorName?: string | null;
  className?: string;
}

function instructorFullName(instructor: InstructorName): string {
  return `${instructor.name} ${instructor.lastname}`;
}

export function InstructorSelector({
  currentInstructorName,
  className,
}: InstructorSelectorProps) {
  const { control, setValue } =
    useFormContext<RegisterTrainingPlanFormSchema>();
  const { data: instructors = [], isLoading } = useInstructorNamesQuery();
  const instructorId = useWatch({ control, name: "instructorId" });

  const currentName = currentInstructorName?.trim() || null;

  const selected = instructorId
    ? (instructors.find((i) => i.id === instructorId) ?? null)
    : null;

  function handleChange(instructor: InstructorName | null) {
    setValue("instructorId", instructor?.id, { shouldDirty: true });
  }

  const displayName = selected ? instructorFullName(selected) : currentName;

  return (
    <SearchableSelect<InstructorName>
      value={selected}
      onChange={handleChange}
      items={instructors}
      getKey={(i) => i.id}
      getLabel={instructorFullName}
      isLoading={isLoading}
      clearable={false}
      searchPlaceholder="Buscar profesor"
      emptyMessage="No hay profesores"
      renderTrigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          aria-label="Reasignar profesor"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 shadow-sm transition-colors hover:border-neutral-300",
            className,
          )}
        >
          <UserRoundCheck
            size={14}
            className="text-neutral-400"
            aria-hidden="true"
          />
          <span className="font-medium text-neutral-500">Profesor</span>
          {displayName ? (
            <span className="font-semibold text-neutral-900">
              {displayName}
            </span>
          ) : (
            <span className="italic text-neutral-400">Sin asignar</span>
          )}
          <ChevronDown
            size={14}
            className={cn(
              "text-neutral-400 transition-transform",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
      )}
    />
  );
}

InstructorSelector.displayName = "InstructorSelector";
