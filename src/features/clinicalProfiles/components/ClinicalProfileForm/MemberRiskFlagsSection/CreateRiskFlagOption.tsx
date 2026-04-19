import { Plus } from "lucide-react";

interface CreateRiskFlagOptionProps {
  query: string;
}

export function CreateRiskFlagOption({ query }: CreateRiskFlagOptionProps) {
  return (
    <>
      <Plus size={14} aria-hidden="true" />
      <span>Crear &ldquo;{query}&rdquo;</span>
    </>
  );
}

CreateRiskFlagOption.displayName = "CreateRiskFlagOption";
