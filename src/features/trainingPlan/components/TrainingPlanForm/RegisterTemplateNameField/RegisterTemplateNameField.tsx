import { useId, useState } from "react";
import { Input } from "@shared/ui";

interface RegisterTemplateNameFieldProps {
  defaultValue: string;
  onValueChange: (value: string) => void;
}

export function RegisterTemplateNameField({
  defaultValue,
  onValueChange,
}: RegisterTemplateNameFieldProps) {
  const inputId = useId();
  const [value, setValue] = useState(defaultValue);

  function handleChange(next: string) {
    setValue(next);
    onValueChange(next);
  }

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1 block text-xs font-semibold tracking-wider text-neutral-500 uppercase"
      >
        Nombre de la plantilla{" "}
        <span className="font-normal normal-case text-neutral-400">
          (opcional)
        </span>
      </label>
      <Input
        id={inputId}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Opcional"
        size="sm"
        autoFocus
      />
    </div>
  );
}

RegisterTemplateNameField.displayName = "RegisterTemplateNameField";
