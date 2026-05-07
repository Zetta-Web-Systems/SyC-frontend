import { Modal } from "@shared/ui";
import { RiskFlagForm } from "../RiskFlagsList/RiskFlagForm/RiskFlagForm";
import { useRegisterRiskFlagMutation } from "../../hooks/mutations/useRegisterRiskFlagMutation";
import type { RegisterRiskFlag, RiskFlag } from "../../types";
import type { RegisterRiskFlagSchema } from "../../schemas/riskFlag.schema";

interface RiskFlagModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (riskFlag: RiskFlag) => void;
  defaultName?: string;
}

export function RiskFlagModal({
  open,
  onClose,
  onCreated,
  defaultName,
}: RiskFlagModalProps) {
  const mutation = useRegisterRiskFlagMutation();

  function handleSubmit(data: RegisterRiskFlagSchema) {
    mutation.mutate(data as RegisterRiskFlag, {
      onSuccess: (created) => {
        onCreated(created);
        onClose();
      },
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeOnBackdropClick
      size="form"
      title="Crear nueva bandera de riesgo"
      bodyClassName="p-6"
    >
      {open && (
        <RiskFlagForm
          defaultName={defaultName}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isPending={mutation.isPending}
          mutation={mutation}
        />
      )}
    </Modal>
  );
}

RiskFlagModal.displayName = "RiskFlagModal";
