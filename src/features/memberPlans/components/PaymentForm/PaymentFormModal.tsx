import { Modal, Button, Input, Select } from "@shared/ui";
import { Form, FormField, FormError } from "@shared/components/Form";
import { formatCurrency } from "@shared/utils/currency.utils";
import type { Fee } from "../../types";
import { PAYMENT_METHOD } from "../../types";
import { PAYMENT_METHOD_OPTIONS } from "../../constants";
import {
  buildPaymentSchema,
  type PaymentSchema,
} from "../../schemas/payment.schema";
import { useRegisterPaymentMutation } from "../../hooks/mutations/useRegisterPaymentMutation";

interface PaymentFormModalProps {
  fee: Fee | null;
  open: boolean;
  onClose: () => void;
}

export function PaymentFormModal({
  fee,
  open,
  onClose,
}: PaymentFormModalProps) {
  const mutation = useRegisterPaymentMutation();

  if (!fee) return null;

  const amountDue =
    fee.totalAmount + (fee.lateChargeAmount ?? 0) - fee.amountPaid;
  const fullName = `${fee.member.name} ${fee.member.lastname}`;

  const handleSubmit = (data: PaymentSchema) => {
    mutation.mutate(
      { feeId: fee.id, amount: data.amount, paymentMethod: data.paymentMethod },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <Modal open={open} onClose={onClose} title="Registrar pago" size="sm">
      <div className="flex flex-col gap-4 px-6 py-5">
        <div className="flex flex-col gap-1 rounded-lg bg-neutral-50 p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Alumno</span>
            <span className="font-medium text-neutral-900">{fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Adeudado</span>
            <span className="font-semibold text-neutral-900">
              {formatCurrency(amountDue)}
            </span>
          </div>
        </div>

        <Form<PaymentSchema>
          schema={buildPaymentSchema(amountDue)}
          onSubmit={handleSubmit}
          defaultValues={{
            amount: undefined,
            paymentMethod: PAYMENT_METHOD.CASH,
          }}
          className="flex flex-col gap-4"
        >
          <FormField<PaymentSchema> name="amount" label="Monto" required>
            {(field) => (
              <Input
                id={field.id}
                name={field.name}
                type="number"
                min={1}
                max={amountDue}
                placeholder="0"
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

          <FormField<PaymentSchema>
            name="paymentMethod"
            label="Método de pago"
            required
          >
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
                {PAYMENT_METHOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
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
              Registrar pago
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

PaymentFormModal.displayName = "PaymentFormModal";
