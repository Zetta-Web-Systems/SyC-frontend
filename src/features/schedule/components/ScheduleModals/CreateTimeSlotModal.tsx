import type { UseFormReturn } from "react-hook-form";
import { Button, Checkbox, Input, Modal } from "@shared/ui";
import { Form, FormError, FormField } from "@shared/components/Form";
import {
  DEFAULT_SLOT_CAPACITY,
  MAX_SLOT_CAPACITY,
  MIN_SLOT_CAPACITY,
  SCHEDULE_DAYS,
  SLOT_DURATION_MINUTES,
  TIME_PATTERN,
  type ScheduleDay,
} from "../../constants";
import { useCreateTimeSlotsMutation } from "../../hooks/mutations/useCreateTimeSlotsMutation";
import { describeDaySelection, formatDayList } from "../../lib/scheduleDays";
import { findOverlappingSlots } from "../../lib/scheduleOverlap";
import {
  addMinutesToTime,
  formatSlotDuration,
  formatSlotRange,
  getSlotDurationMinutes,
  getSlotEndTime,
} from "../../lib/slotStatus";
import {
  createTimeSlotSchema,
  type CreateTimeSlotSchema,
} from "../../schemas/createTimeSlot.schema";
import type { TimeSlot } from "../../types";
import { SlotDaysPicker } from "./SlotDaysPicker";

type CreateTimeSlotForm = UseFormReturn<CreateTimeSlotSchema>;

interface CreateTimeSlotModalProps {
  open: boolean;
  onClose: () => void;
  weekSlots: TimeSlot[];
}

function getConflictingDays(
  weekSlots: TimeSlot[],
  startTime: string,
  endTime: string,
): Set<ScheduleDay> {
  if (!endTime) return new Set();

  const conflicts = findOverlappingSlots(weekSlots, { startTime, endTime });

  return new Set(conflicts.map((slot) => slot.dayOfWeek));
}

function keepDurationOnStartChange(
  form: CreateTimeSlotForm,
  previousStart: string,
  nextStart: string,
): void {
  if (!form.getValues("hasCustomEnd")) return;
  if (!TIME_PATTERN.test(nextStart)) return;

  const previousEnd = form.getValues("endTime");
  const duration =
    TIME_PATTERN.test(previousStart) && TIME_PATTERN.test(previousEnd)
      ? getSlotDurationMinutes(previousStart, previousEnd)
      : 0;

  form.setValue(
    "endTime",
    addMinutesToTime(
      nextStart,
      duration > 0 ? duration : SLOT_DURATION_MINUTES,
    ),
  );
}

function prefillEndTime(form: CreateTimeSlotForm): void {
  const startTime = form.getValues("startTime");
  const endTime = form.getValues("endTime");

  if (!TIME_PATTERN.test(startTime) || TIME_PATTERN.test(endTime)) return;

  form.setValue("endTime", getSlotEndTime(startTime));
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
          endTime: data.hasCustomEnd ? data.endTime : undefined,
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
            endTime: "",
            capacity: DEFAULT_SLOT_CAPACITY,
            days: [...SCHEDULE_DAYS],
            hasCustomEnd: false,
          }}
          className="flex flex-col gap-4"
        >
          {(form) => {
            const startTime = form.watch("startTime");
            const endTime = form.watch("endTime");
            const hasCustomEnd = form.watch("hasCustomEnd");
            const selectedDays = form.watch("days");

            const isValidStart = TIME_PATTERN.test(startTime);
            const isValidCustomEnd =
              TIME_PATTERN.test(endTime) && endTime > startTime;

            const effectiveEnd = !isValidStart
              ? ""
              : hasCustomEnd
                ? isValidCustomEnd
                  ? endTime
                  : ""
                : getSlotEndTime(startTime);

            const conflictingDays = getConflictingDays(
              weekSlots,
              startTime,
              effectiveEnd,
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
                        onChange={(e) => {
                          const previousStart = form.getValues("startTime");
                          field.onChange(e.target.value);
                          keepDurationOnStartChange(
                            form,
                            previousStart,
                            e.target.value,
                          );
                        }}
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

                <FormField<CreateTimeSlotSchema> name="hasCustomEnd">
                  {(field) => (
                    <label
                      htmlFor={field.id}
                      className="flex w-fit cursor-pointer items-center gap-2 text-sm text-neutral-700"
                    >
                      <Checkbox
                        id={field.id}
                        name={field.name}
                        checked={field.value}
                        onChange={(e) => {
                          field.onChange(e.currentTarget.checked);
                          if (e.currentTarget.checked) prefillEndTime(form);
                        }}
                        onBlur={field.onBlur}
                      />
                      El turno no dura una hora
                    </label>
                  )}
                </FormField>

                {hasCustomEnd && (
                  <div className="-mt-1 flex gap-3">
                    <FormField<CreateTimeSlotSchema>
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

                    <div className="flex flex-1 flex-col gap-1.5">
                      <span aria-hidden="true" className="h-5" />

                      <p className="flex h-10 items-center text-xs text-neutral-400">
                        {isValidStart && isValidCustomEnd
                          ? `Dura ${formatSlotDuration(startTime, endTime)}`
                          : ""}
                      </p>
                    </div>
                  </div>
                )}

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
                    tienen un horario que se pisa con ese rango. Sacá esos días
                    o cambiá la hora.
                  </p>
                )}

                <p className="-mt-2 text-xs text-neutral-400">
                  {effectiveEnd && selectedDays.length > 0
                    ? `El horario se agrega ${describeDaySelection(selectedDays)}, de ${formatSlotRange(startTime, effectiveEnd)}.`
                    : hasCustomEnd
                      ? "Poné desde y hasta: el turno puede durar lo que necesites."
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
