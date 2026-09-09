import { Button, Input, Modal, Select } from "@shared/ui";
import { Form, FormError, FormField } from "@shared/components/Form";
import {
  MAX_SLOT_CAPACITY,
  MIN_SLOT_CAPACITY,
  SCHEDULE_DAY_LABELS,
  SLOT_TAG,
  type SlotTag,
} from "../../constants";
import { useUpdateTimeSlotMutation } from "../../hooks/mutations/useUpdateTimeSlotMutation";
import { formatDayList } from "../../lib/scheduleDays";
import { getSlotsInRow } from "../../lib/scheduleRows";
import { formatSlotRange, normalizeTime } from "../../lib/slotStatus";
import {
  editTimeSlotSchema,
  type EditTimeSlotSchema,
} from "../../schemas/editTimeSlot.schema";
import type { TimeSlot } from "../../types";

interface SlotTagSelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: boolean;
  describedBy?: string;
}

function SlotTagSelect({
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  describedBy,
}: SlotTagSelectProps) {
  return (
    <Select
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder="Sin etiqueta"
      error={error}
      aria-describedby={describedBy}
    >
      {Object.values(SLOT_TAG).map((tag) => (
        <option key={tag} value={tag}>
          {tag}
        </option>
      ))}
    </Select>
  );
}

interface EditTimeSlotModalProps {
  open: boolean;
  onClose: () => void;
  slot: TimeSlot;
  weekSlots: TimeSlot[];
}

export function EditTimeSlotModal({
  open,
  onClose,
  slot,
  weekSlots,
}: EditTimeSlotModalProps) {
  const mutation = useUpdateTimeSlotMutation();

  const dayLabel = SCHEDULE_DAY_LABELS[slot.dayOfWeek];
  const rowDays = getSlotsInRow(weekSlots, slot.startTime).map(
    (rowSlot) => rowSlot.dayOfWeek,
  );
  const canEditRow = rowDays.length > 1;

  function handleSubmit(data: EditTimeSlotSchema) {
    mutation.mutate(
      {
        slot,
        dto: {
          startTime: data.startTime,
          endTime: data.endTime,
          capacity: data.capacity,
          tag: (data.tag || null) as SlotTag | null,
        },
        scope: data.scope,
        weekSlots,
      },
      { onSuccess: () => onClose() },
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Editar horario" size="sm">
      <div className="flex flex-col gap-4 px-6 py-5">
        <div className="flex justify-between rounded-lg bg-neutral-50 p-3 text-sm">
          <span className="text-neutral-500">Horario</span>
          <span className="font-medium text-neutral-900">
            {dayLabel}, {formatSlotRange(slot.startTime, slot.endTime)}
          </span>
        </div>

        <Form<EditTimeSlotSchema>
          schema={editTimeSlotSchema}
          onSubmit={handleSubmit}
          defaultValues={{
            startTime: normalizeTime(slot.startTime),
            endTime: normalizeTime(slot.endTime),
            capacity: slot.capacity,
            tag: slot.tag ?? "",
            scope: "cell",
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex gap-3">
            <FormField<EditTimeSlotSchema>
              name="startTime"
              label="Desde"
              required
              className="flex-1"
            >
              {(field) => (
                <Input
                  ref={field.ref}
                  id={field.id}
                  name={field.name}
                  type="time"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  error={field.error}
                  aria-describedby={field["aria-describedby"]}
                />
              )}
            </FormField>

            <FormField<EditTimeSlotSchema>
              name="endTime"
              label="Hasta"
              required
              className="flex-1"
            >
              {(field) => (
                <Input
                  ref={field.ref}
                  id={field.id}
                  name={field.name}
                  type="time"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  error={field.error}
                  aria-describedby={field["aria-describedby"]}
                />
              )}
            </FormField>
          </div>

          {canEditRow && (
            <FormField<EditTimeSlotSchema> name="scope" label="Cambiar la hora">
              {(field) => (
                <Select
                  id={field.id}
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={field.error}
                  aria-describedby={field["aria-describedby"]}
                >
                  <option value="cell">
                    Sólo los {dayLabel.toLowerCase()}
                  </option>
                  <option value="row">
                    Todos los días de esta fila ({formatDayList(rowDays)})
                  </option>
                </Select>
              )}
            </FormField>
          )}

          <FormField<EditTimeSlotSchema>
            name="capacity"
            label="Capacidad"
            required
          >
            {(field) => (
              <Input
                id={field.id}
                name={field.name}
                type="number"
                min={MIN_SLOT_CAPACITY}
                max={MAX_SLOT_CAPACITY}
                value={field.value === "" ? "" : field.value}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? undefined : e.target.valueAsNumber,
                  )
                }
                onBlur={field.onBlur}
                error={field.error}
                aria-describedby={field["aria-describedby"]}
              />
            )}
          </FormField>

          <FormField<EditTimeSlotSchema> name="tag" label="Etiqueta">
            {(field) => (
              <SlotTagSelect
                id={field.id}
                name={field.name}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={field.error}
                describedBy={field["aria-describedby"]}
              />
            )}
          </FormField>

          <p className="-mt-2 text-xs text-neutral-400">
            La capacidad y la etiqueta son de este día solo.
            {canEditRow
              ? " La hora puede aplicarse a toda la fila; si se cambia para un día solo, ese día pasa a tener su propia fila."
              : ""}{" "}
            Una capacidad de 0 marca la celda como no asignable.
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
              Guardar
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

EditTimeSlotModal.displayName = "EditTimeSlotModal";
