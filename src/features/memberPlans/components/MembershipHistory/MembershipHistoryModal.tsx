import { Modal, Badge, Spinner } from "@shared/ui";
import { formatDate } from "@shared/utils/date.utils";
import { MEMBER_PLAN_TYPE_LABELS } from "../../constants";
import { useMembershipHistoryQuery } from "../../hooks/queries/useMembershipHistoryQuery";

interface MembershipHistoryModalProps {
  memberId: string;
  memberName?: string;
  open: boolean;
  onClose: () => void;
}

export function MembershipHistoryModal({
  memberId,
  memberName,
  open,
  onClose,
}: MembershipHistoryModalProps) {
  const { data, isLoading, isError } = useMembershipHistoryQuery(
    memberId,
    open,
  );

  const history = data ?? [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Historial de membresías"
      size="md"
    >
      <div className="flex flex-col gap-4 px-6 py-5">
        {memberName && (
          <p className="text-sm text-neutral-500">
            Alumno:{" "}
            <span className="font-medium text-neutral-900">{memberName}</span>
          </p>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : isError ? (
          <p role="alert" className="text-sm text-error">
            No se pudo cargar el historial. Intentá de nuevo más tarde.
          </p>
        ) : history.length === 0 ? (
          <p className="text-sm text-neutral-400">
            El alumno todavía no tiene membresías registradas.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-neutral-100">
            {history.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-900">
                    {MEMBER_PLAN_TYPE_LABELS[item.planType]}
                  </span>
                  <span className="text-xs text-neutral-500">
                    Desde {formatDate(item.startDate)}
                    {item.endDate ? ` hasta ${formatDate(item.endDate)}` : ""}
                  </span>
                </div>
                <Badge intent={item.isActive ? "success" : "neutral"} size="sm">
                  {item.isActive ? "Activa" : "Finalizada"}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}

MembershipHistoryModal.displayName = "MembershipHistoryModal";
