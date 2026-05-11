interface GroupExerciseHeaderProps {
  name: string;
}

export function GroupExerciseHeader({ name }: GroupExerciseHeaderProps) {
  return (
    <div className="min-w-0 flex-1">
      <h3 className="truncate text-base font-semibold leading-tight text-neutral-900">
        {name}
      </h3>
    </div>
  );
}

GroupExerciseHeader.displayName = "GroupExerciseHeader";
