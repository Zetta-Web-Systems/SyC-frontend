import { Modal } from "@shared/ui";
import type { MutationLike } from "@shared/types/mutations.types";
import { RiskFlagForm } from "../RiskFlagForm/RiskFlagForm";
import type { RiskFlag } from "../../../types";
import type {
  RegisterRiskFlagSchema,
  UpdateRiskFlagSchema,
} from "../../../schemas/riskFlag.schema";

interface RiskFlagFormModalBaseProps {
  open: boolean;
  mutation: MutationLike;
  isPending: boolean;
  onClose: () => void;
}

interface RiskFlagFormModalCreateProps extends RiskFlagFormModalBaseProps {
  riskFlag?: undefined;
  onSubmit: (data: RegisterRiskFlagSchema) => void;
}

interface RiskFlagFormModalEditProps extends RiskFlagFormModalBaseProps {
  riskFlag: RiskFlag;
  onSubmit: (data: UpdateRiskFlagSchema) => void;
}

type RiskFlagFormModalProps =
  | RiskFlagFormModalCreateProps
  | RiskFlagFormModalEditProps;

export function RiskFlagFormModal({
  open,
  mutation,
  isPending,
  onClose,
  riskFlag,
  onSubmit,
}: RiskFlagFormModalProps) {
  const isEditing = !!riskFlag;
  const title = isEditing
    ? "Editar bandera de riesgo"
    : "Registrar bandera de riesgo";

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="form"
      title={title}
      bodyClassName="p-6"
    >
      {open &&
        (isEditing ? (
          <RiskFlagForm
            key={riskFlag.id}
            riskFlag={riskFlag}
            onSubmit={onSubmit as (data: UpdateRiskFlagSchema) => void}
            isPending={isPending}
            mutation={mutation}
          />
        ) : (
          <RiskFlagForm
            key="create"
            onSubmit={onSubmit as (data: RegisterRiskFlagSchema) => void}
            isPending={isPending}
            mutation={mutation}
          />
        ))}
    </Modal>
  );
}

RiskFlagFormModal.displayName = "RiskFlagFormModal";
