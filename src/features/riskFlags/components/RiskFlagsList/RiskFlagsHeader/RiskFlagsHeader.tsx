import { ArrowLeft, Plus, Users } from "lucide-react";
import { Button } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";

interface RiskFlagsHeaderProps {
  onCreate: () => void;
  onBack: () => void;
  onGoToMembers: () => void;
}

export function RiskFlagsHeader({
  onCreate,
  onBack,
  onGoToMembers,
}: RiskFlagsHeaderProps) {
  return (
    <PageHeader
      title="Banderas de Riesgo"
      description="Administra las banderas de riesgo asociadas a los alumnos"
      actions={
        <>
          <Button intent="neutral" variant="outline" onClick={onBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span className="hidden xs:inline">Volver a Configuración</span>
          </Button>
          <Button intent="neutral" variant="outline" onClick={onGoToMembers}>
            <Users size={16} aria-hidden="true" />
            <span className="hidden xs:inline">Alumnos</span>
          </Button>
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
