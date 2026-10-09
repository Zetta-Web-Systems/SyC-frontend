import { z } from "zod";
import { Avatar, Badge, Button, Modal, Textarea } from "@shared/ui";
import { Form, FormError, FormField } from "@shared/components/Form";
import { SCHEDULE_DAY_LABELS, formatSlotRange } from "@features/schedule";
import { useAuthStore } from "@features/auth";
import {
  ATTENDANCE_STATE,
  ATTENDANCE_STATE_INTENT,
  ATTENDANCE_STATE_ORDER,
} from "../../constants";
import { useRegisterSessionMutation } from "../../hooks/mutations/useRegisterSessionMutation";
import {
  countByAttendanceState,
  formatMemberNames,
  formatStateCount,
} from "../../lib/sessionSummary";
import type { SessionBoard } from "../../types";

const finishSessionSchema = z.object({ observations: z.string() });
type FinishSessionSchema = z.infer<typeof finishSessionSchema>;

const MAX_PENDING_AVATARS = 4;

interface FinishSessionModalProps {
  open: boolean;
  onClose: () => void;
  board: SessionBoard;
}

export function FinishSessionModal({
  open,
  onClose,
  board,
}: FinishSessionModalProps) {
  const mutation = useRegisterSessionMutation();
  const user = useAuthStore((s) => s.user);
  const { turn, members } = board;
  const counts = countByAttendanceState(members);
  const pending = members.filter(
    (m) => m.attendanceState === ATTENDANCE_STATE.PENDING,
  );

  function handleSubmit(data: FinishSessionSchema) {
    const observations = data.observations.trim();
    mutation.mutate(
      { turn, observations: observations || undefined },
      { onSuccess: () => onClose() },
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Finalizar sesión" size="sm">
      <div className="flex flex-col gap-4 px-6 py-5">
        <dl className="flex flex-col gap-2 rounded-lg bg-neutral-50 p-3 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">Turno</dt>
            <dd className="font-medium text-neutral-900">
              {SCHEDULE_DAY_LABELS[turn.dayOfWeek]},{" "}
              {formatSlotRange(turn.startTime, turn.endTime)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">Profe</dt>
            <dd className="font-medium text-neutral-900">
              {user?.firstName} {user?.lastName}
            </dd>
          </div>
          <div className="flex flex-wrap justify-between gap-x-3 gap-y-1.5">
            <dt className="text-neutral-500">Asistencia</dt>
            <dd className="flex flex-wrap justify-end gap-x-3 gap-y-1">
              {ATTENDANCE_STATE_ORDER.filter((state) => counts[state] > 0).map(
                (state) => (
                  <Badge
                    key={state}
                    variant="dot"
                    intent={ATTENDANCE_STATE_INTENT[state]}
                    size="sm"
                    className="px-0"
                  >
                    {formatStateCount(state, counts[state])}
                  </Badge>
                ),
              )}
            </dd>
          </div>
        </dl>

        {pending.length > 0 && (
          <div className="flex items-center gap-3 rounded-lg border-[1.5px] border-dashed border-neutral-300 px-3 py-2.5">
            <span className="flex shrink-0 -space-x-2">
              {pending.slice(0, MAX_PENDING_AVATARS).map(({ member }) => (
                <Avatar
                  key={member.id}
                  size="sm"
                  color="neutral"
                  src={member.image ?? null}
                  fallback={(
                    member.name.charAt(0) + member.lastname.charAt(0)
                  ).toUpperCase()}
                  alt={`${member.name} ${member.lastname}`}
                  className="ring-2 ring-white"
                />
              ))}
            </span>
            <p className="text-sm text-neutral-600">
              <span className="font-semibold text-neutral-800">
                {formatMemberNames(pending)}
              </span>{" "}
              {pending.length === 1 ? "sigue pendiente" : "siguen pendientes"}.
              Si faltaron, marcalos ausentes antes de finalizar.
            </p>
          </div>
        )}

        <Form<FinishSessionSchema>
          schema={finishSessionSchema}
          onSubmit={handleSubmit}
          defaultValues={{ observations: "" }}
          className="flex flex-col gap-4"
        >
          <FormField<FinishSessionSchema>
            name="observations"
            label="Observaciones"
          >
            {(field) => (
              <Textarea
                ref={field.ref}
                id={field.id}
                name={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                rows={3}
                placeholder="Ingresar observación (opcional)"
                error={field.error}
                aria-describedby={field["aria-describedby"]}
              />
            )}
          </FormField>

          <FormError mutation={mutation} />

          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button intent="neutral" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              intent="primary"
              isLoading={mutation.isPending}
            >
              Finalizar sesión
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

FinishSessionModal.displayName = "FinishSessionModal";
