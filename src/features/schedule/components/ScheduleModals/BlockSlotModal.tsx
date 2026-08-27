import { Button, Input, Modal, Textarea } from "@shared/ui";
import { Form, FormError, FormField } from "@shared/components/Form";
import { SCHEDULE_DAY_LABELS } from "../../constants";
import { useCreateOverrideMutation } from "../../hooks/mutations/useCreateOverrideMutation";
import { formatSlotRange } from "../../lib/slotStatus";
import {
  blockSlotSchema,
  BLOCK_REASON_MAX_LENGTH,
  type BlockSlotSchema,
} from "../../schemas/blockSlot.schema";
import type { TimeSlot } from "../../types";

interface BlockSlotModalProps {
  open: boolean;
  onClose: () => void;
  slot: TimeSlot;
  date: string;
}

export function BlockSlotModal({
  open,
  onClose,
  slot,
  date,
}: BlockSlotModalProps) {
  const mutation = useCreateOverrideMutation();

  function handleSubmit(data: BlockSlotSchema) {
    const reason = data.reason?.trim();

    mutation.mutate(
      {
        timeSlotId: slot.id,
        date: data.date,
        reason: reason || undefined,
      },
      { onSuccess: () => onClose() },
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Bloquear horario" size="sm">
      <div className="flex flex-col gap-4 px-6 py-5">
        <div className="flex justify-between rounded-lg bg-neutral-50 p-3 text-sm">
          <span className="text-neutral-500">Horario</span>
          <span className="font-medium text-neutral-900">
            {SCHEDULE_DAY_LABELS[slot.dayOfWeek]},{" "}
            {formatSlotRange(slot.startTime, slot.endTime)}
          </span>
        </div>

        <Form<BlockSlotSchema>
          schema={blockSlotSchema}
          onSubmit={handleSubmit}
          defaultValues={{ date, reason: "" }}
          className="flex flex-col gap-4"
        >
          <FormField<BlockSlotSchema> name="date" label="Fecha" required>
            {(field) => (
              <Input
                ref={field.ref}
                id={field.id}
                name={field.name}
                type="date"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                error={field.error}
                aria-describedby={field["aria-describedby"]}
              />
            )}
          </FormField>

          <FormField<BlockSlotSchema> name="reason" label="Motivo">
            {(field) => (
              <Textarea
                ref={field.ref}
                id={field.id}
                name={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                rows={3}
                maxLength={BLOCK_REASON_MAX_LENGTH}
                placeholder="Motivo de cierre del horario (opcional)"
                error={field.error}
                aria-describedby={field["aria-describedby"]}
              />
            )}
          </FormField>

          <p className="-mt-2 text-xs text-neutral-400">
            Solo se bloquea esa fecha. El horario sigue existiendo el resto de
            las semanas.
          </p>

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
              Bloquear
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

BlockSlotModal.displayName = "BlockSlotModal";
