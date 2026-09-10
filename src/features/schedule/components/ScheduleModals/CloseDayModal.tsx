import { Button, Input, Modal, Select, Textarea } from "@shared/ui";
import { Form, FormError, FormField } from "@shared/components/Form";
import { formatDateToISO } from "@shared/utils/date.utils";
import { CLOSURE_TYPE, CLOSURE_TYPE_OPTIONS } from "../../constants";
import { useCreateClosureMutation } from "../../hooks/mutations/useCreateClosureMutation";
import {
  closeDaySchema,
  CLOSURE_REASON_MAX_LENGTH,
  type CloseDaySchema,
} from "../../schemas/closeDay.schema";

interface CloseDayModalProps {
  open: boolean;
  onClose: () => void;
  date?: string;
}

export function CloseDayModal({ open, onClose, date }: CloseDayModalProps) {
  const mutation = useCreateClosureMutation();
  const initialDate = date ?? formatDateToISO(new Date());

  function handleSubmit(data: CloseDaySchema) {
    const reason = data.reason?.trim();

    mutation.mutate(
      {
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: reason || undefined,
      },
      { onSuccess: () => onClose() },
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Cerrar día" size="sm">
      <div className="px-6 py-5">
        <Form<CloseDaySchema>
          schema={closeDaySchema}
          onSubmit={handleSubmit}
          defaultValues={{
            type: CLOSURE_TYPE.HOLIDAY,
            startDate: initialDate,
            endDate: initialDate,
            reason: "",
          }}
          className="flex flex-col gap-4"
        >
          <FormField<CloseDaySchema> name="type" label="Tipo" required>
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
                {CLOSURE_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
          </FormField>

          <div className="flex gap-3">
            <FormField<CloseDaySchema>
              name="startDate"
              label="Desde"
              required
              className="flex-1"
            >
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

            <FormField<CloseDaySchema>
              name="endDate"
              label="Hasta"
              required
              className="flex-1"
            >
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
          </div>

          <p className="-mt-2 text-xs text-neutral-400">
            El cierre aplica al día completo. Para tapar una sola hora, usá
            "Bloquear esta fecha" en el menú del horario.
          </p>

          <FormField<CloseDaySchema> name="reason" label="Motivo">
            {(field) => (
              <Textarea
                ref={field.ref}
                id={field.id}
                name={field.name}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                rows={3}
                maxLength={CLOSURE_REASON_MAX_LENGTH}
                placeholder="Motivo de cierre (opcional)"
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
              Cerrar día
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

CloseDayModal.displayName = "CloseDayModal";
