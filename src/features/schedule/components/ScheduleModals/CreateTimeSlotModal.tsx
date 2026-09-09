import { Button, Input, Modal } from "@shared/ui";
import { Form, FormError, FormField } from "@shared/components/Form";
import {
  DEFAULT_SLOT_CAPACITY,
  MAX_SLOT_CAPACITY,
  MIN_SLOT_CAPACITY,
} from "../../constants";
import { useCreateTimeSlotsMutation } from "../../hooks/mutations/useCreateTimeSlotsMutation";
import { formatSlotRange, getSlotEndTime } from "../../lib/slotStatus";
import {
  createTimeSlotSchema,
  type CreateTimeSlotSchema,
} from "../../schemas/createTimeSlot.schema";
import type { TimeSlot } from "../../types";

interface CreateTimeSlotModalProps {
  open: boolean;
  onClose: () => void;
  weekSlots: TimeSlot[];
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
        dto: { startTime: data.startTime, capacity: data.capacity },
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
          }}
          className="flex flex-col gap-4"
        >
          {(form) => {
            const currentStartTime = form.watch("startTime");

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

                <p className="-mt-2 text-xs text-neutral-400">
                  El horario se agrega de lunes a viernes
                  {currentStartTime
                    ? `, de ${formatSlotRange(currentStartTime, getSlotEndTime(currentStartTime))}.`
                    : ". Los turnos duran una hora, así que la hora de fin se calcula sola."}{" "}
                  Después se cierran los días que no se usen y se les pone
                  etiqueta desde cada celda.
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
