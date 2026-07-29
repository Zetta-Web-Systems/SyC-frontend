import { useState } from "react";
import { Input, Label } from "@shared/ui";

interface ExtendPlanWeeksFieldProps {
  defaultValue: number;
  onChange: (weeks: number) => void;
}

export function ExtendPlanWeeksField({
  defaultValue,
  onChange,
}: ExtendPlanWeeksFieldProps) {
  const [value, setValue] = useState<string>(String(defaultValue));

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="weeks-to-extend">Semanas a extender</Label>
      <Input
        id="weeks-to-extend"
        type="number"
        min={1}
        value={value}
        onChange={(e) => {
          const next = e.target.value;
          setValue(next);
          const parsed = Number(next);
          if (Number.isFinite(parsed) && parsed > 0) {
            onChange(parsed);
          }
        }}
      />
    </div>
  );
}

ExtendPlanWeeksField.displayName = "ExtendPlanWeeksField";
