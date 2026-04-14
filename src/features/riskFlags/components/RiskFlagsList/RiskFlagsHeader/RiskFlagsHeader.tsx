import { Plus } from "lucide-react";
import { Button } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";

interface RiskFlagsHeaderProps {
  onCreate: () => void;
}

export function RiskFlagsHeader({ onCreate }: RiskFlagsHeaderProps) {
  return (
    <PageHeader
      title="Banderas de Riesgo"
      description="Administra las banderas de riesgo asociadas a los alumnos"
      actions={
        <>
          <Button intent="primary" onClick={onCreate}>
            <Plus size={16} aria-hidden="true" />
            <span className="hidden xs:inline">
              Registrar bandera de riesgo
            </span>
          </Button>
        </>
      }
    />
  );
}
