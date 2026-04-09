import { Plus } from "lucide-react";
import { Button } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";

interface RiskFlagsHeaderProps {
  onCreate: () => void;
}

export function RiskFlagsHeader({ onCreate }: RiskFlagsHeaderProps) {
  return (
    <PageHeader
      title="Flags de Riesgo"
      description="Administra los flags de riesgo asociados a los alumnos"
      actions={
        <>
          <Button intent="primary" onClick={onCreate}>
            <Plus size={16} aria-hidden="true" />
            <span className="hidden xs:inline">Registrar flag de riesgo</span>
          </Button>
        </>
      }
    />
  );
}
