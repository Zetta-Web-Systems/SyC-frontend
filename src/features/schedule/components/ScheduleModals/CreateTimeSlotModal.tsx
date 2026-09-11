import { Button, Input, Modal } from "@shared/ui";
import { Form, FormError, FormField } from "@shared/components/Form";
import {
  DEFAULT_SLOT_CAPACITY,
  MAX_SLOT_CAPACITY,
  MIN_SLOT_CAPACITY,
  SCHEDULE_DAYS,
  TIME_PATTERN,
  type ScheduleDay,
} from "../../constants";
import { useCreateTimeSlotsMutation } from "../../hooks/mutations/useCreateTimeSlotsMutation";
import { describeDaySelection, formatDayList } from "../../lib/scheduleDays";
import { findOverlappingSlots } from "../../lib/scheduleOverlap";
import { formatSlotRange, getSlotEndTime } from "../../lib/slotStatus";
import {
  createTimeSlotSchema,
  type CreateTimeSlotSchema,
} from "../../schemas/createTimeSlot.schema";
import type { TimeSlot } from "../../types";
import { SlotDaysPicker } from "./SlotDaysPicker";

interface CreateTimeSlotModalProps {
  open: boolean;
  onClose: () => void;
  weekSlots: TimeSlot[];
}

function getConflictingDays(
  weekSlots: TimeSlot[],
  startTime: string,
): Set<ScheduleDay> {
  if (!TIME_PATTERN.test(startTime)) return new Set();

  const conflicts = findOverlappingSlots(weekSlots, {
    startTime,
    endTime: getSlotEndTime(startTime),
  });

  return new Set(conflicts.map((slot) => slot.dayOfWeek));
}

export function CreateTimeSlotModal({
  open,
  onClose,
  weekSlots,
}: CreateTimeSlotModalProps) {
  const mutation = useCreateTimeSlotsMutation();

  function handleSubmit(data: CreateTimeSlotSchema) {
    mutation.mutate(
      {
        dto: {
          startTime: data.startTime,
          capacity: data.capacity,
          days: data.days,
        },
        weekSlots,
      },
      { onSuccess: () => onClose() },
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Agregar horario" size="sm">
      <div className="px-6 py-5">
        <Form<CreateTimeSlotSchema>
          schema={createTimeSlotSchema}
          onSubmit={handleSubmit}
          defaultValues={{
            startTime: "",
            capacity: DEFAULT_SLOT_CAPACITY,
            days: [...SCHEDULE_DAYS],
          }}
          className="flex flex-col gap-4"
        >
          {(form) => {
            const currentStartTime = form.watch("startTime");
            const selectedDays = form.watch("days");

            const isValidStartTime = TIME_PATTERN.test(currentStartTime);
            const conflictingDays = getConflictingDays(
              weekSlots,
              currentStartTime,
            );
            const selectedConflicts = selectedDays.filter((day) =>
              conflictingDays.has(day),
            );

            return (
              <>
                <div className="flex gap-3">
                  <FormField<CreateTimeSlotSchema>
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

                  <FormField<CreateTimeSlotSchema>
                    name="capacity"
                    label="Capacidad"
                    required
                    className="flex-1"
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
                            e.target.value === ""
                              ? undefined
                              : e.target.valueAsNumber,
                          )
                        }
                        onBlur={field.onBlur}
                        error={field.error}
                        aria-describedby={field["aria-describedby"]}
                      />
                    )}
                  </FormField>
                </div>

                <FormField<CreateTimeSlotSchema> name="days" label="Días">
                  {(field) => (
                    <SlotDaysPicker
                      id={field.id}
                      value={field.value}
                      conflictingDays={conflictingDays}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={field.error}
                      describedBy={field["aria-describedby"]}
                    />
                  )}
                </FormField>

                {selectedConflicts.length > 0 && (
                  <p role="status" className="-mt-2 text-xs text-error">
                    Los {formatDayList(selectedConflicts).toLowerCase()} ya
                    tienen un horario que se pisa con ese rango. Quita esos días
                    o cambiá la hora.
                  </p>
                )}

                <p className="-mt-2 text-xs text-neutral-400">
                  {isValidStartTime && selectedDays.length > 0
                    ? `El horario se agrega ${describeDaySelection(selectedDays)}, de ${formatSlotRange(currentStartTime, getSlotEndTime(currentStartTime))}.`
                    : "Los turnos duran una hora, así que la hora de fin se calcula sola."}{" "}
                  Cada día se puede cerrar o etiquetar después desde el menú de
                  su celda.
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
                    Agregar horario
                  </Button>
                </div>
              </>
            );
          }}
        </Form>
      </div>
    </Modal>
  );
}

CreateTimeSlotModal.displayName = "CreateTimeSlotModal";
