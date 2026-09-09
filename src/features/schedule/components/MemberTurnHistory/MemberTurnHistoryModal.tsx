import { Badge, Modal, Pill, Spinner } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import { formatDate } from "@shared/utils/date.utils";
import { SCHEDULE_DAY_LABELS, SLOT_TAG_TINT } from "../../constants";
import { useMemberTurnHistoryQuery } from "../../hooks/queries/useMemberTurnHistoryQuery";
import { formatSlotRange } from "../../lib/slotStatus";
import type { MemberTurnHistoryEntry } from "../../types";

interface HistoryRowProps {
  entry: MemberTurnHistoryEntry;
}

function HistoryRow({ entry }: HistoryRowProps) {
  const { timeSlot } = entry;

  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-900">
            {SCHEDULE_DAY_LABELS[timeSlot.dayOfWeek]},{" "}
            {formatSlotRange(timeSlot.startTime, timeSlot.endTime)}
          </span>

          {timeSlot.tag && (
            <Pill
              size="xs"
              uppercase
              intent="neutral"
              className={cn("shrink-0", SLOT_TAG_TINT[timeSlot.tag])}
            >
              {timeSlot.tag}
            </Pill>
          )}
        </div>

        <span className="text-xs text-neutral-500">
          Desde {formatDate(entry.startDate)}
          {entry.endDate ? ` hasta ${formatDate(entry.endDate)}` : ""}
        </span>
      </div>

      <Badge intent={entry.isActive ? "success" : "neutral"} size="sm">
        {entry.isActive ? "Actual" : "Finalizado"}
      </Badge>
    </li>
  );
}

interface MemberTurnHistoryModalProps {
  memberId: string;
  memberName?: string;
  open: boolean;
  onClose: () => void;
}

export function MemberTurnHistoryModal({
  memberId,
  memberName,
  open,
  onClose,
}: MemberTurnHistoryModalProps) {
  const { data, isLoading, isError } = useMemberTurnHistoryQuery(
    memberId,
    open,
  );

  const history = data ?? [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Historial de horarios"
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
            El alumno todavía no estuvo anotado en ningún horario.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-neutral-100">
            {history.map((entry) => (
              <HistoryRow key={entry.id} entry={entry} />
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}

MemberTurnHistoryModal.displayName = "MemberTurnHistoryModal";
