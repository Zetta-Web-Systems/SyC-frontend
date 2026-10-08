import { z } from "zod";
import { Button, Modal, Textarea } from "@shared/ui";
import { Form, FormError, FormField } from "@shared/components/Form";
import { SCHEDULE_DAY_LABELS, formatSlotRange } from "@features/schedule";
import { ATTENDANCE_STATE } from "../../../constants";
import { useRegisterAbsenceMutation } from "../../../hooks/mutations/useRegisterAbsenceMutation";
import type { SessionMember, SessionTurn } from "../../../types";

const absenceSchema = z.object({ absentReason: z.string() });
type AbsenceSchema = z.infer<typeof absenceSchema>;

interface AbsenceModalProps {
  open: boolean;
  onClose: () => void;
  sessionMember: SessionMember;
  turn: SessionTurn;
}

export function AbsenceModal({
  open,
  onClose,
  sessionMember,
  turn,
}: AbsenceModalProps) {
  const mutation = useRegisterAbsenceMutation();
  const { member, attendanceState } = sessionMember;

  function handleSubmit(data: AbsenceSchema) {
    const reason = data.absentReason.trim();

    mutation.mutate(
      {
        dto: {
          memberId: member.id,
          timeSlotid: turn.timeSlotId,
          absentReason: reason || undefined,
        },
        isPresent: attendanceState === ATTENDANCE_STATE.PRESENT,
        turnStartTime: turn.startTime,
      },
      { onSuccess: () => onClose() },
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Marcar ausente" size="sm">
      <div className="flex flex-col gap-4 px-6 py-5">
        <dl className="flex flex-col gap-2 rounded-lg bg-neutral-50 p-3 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">Alumno</dt>
            <dd className="font-medium text-neutral-900">
              {member.name} {member.lastname}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">Horario</dt>
            <dd className="font-medium text-neutral-900">
              {SCHEDULE_DAY_LABELS[turn.dayOfWeek]},{" "}
              {formatSlotRange(turn.startTime, turn.endTime)}
            </dd>
          </div>
        </dl>

        <Form<AbsenceSchema>
          schema={absenceSchema}
          onSubmit={handleSubmit}
          defaultValues={{ absentReason: "" }}
          className="flex flex-col gap-4"
        >
          <FormField<AbsenceSchema> name="absentReason" label="Motivo">
            {(field) => (
              <Textarea
                ref={field.ref}
                id={field.id}
                name={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                rows={3}
                placeholder="Ingresar motivo (opcional)"
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
              intent="danger"
              isLoading={mutation.isPending}
            >
              Registrar ausencia
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

AbsenceModal.displayName = "AbsenceModal";
