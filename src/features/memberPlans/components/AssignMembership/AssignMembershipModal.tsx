import { Modal, Button, Select } from "@shared/ui";
import { Form, FormField, FormError } from "@shared/components/Form";
import { MEMBER_PLAN_TYPE } from "../../types";
import { MEMBER_PLAN_TYPE_FILTER_OPTIONS } from "../../constants";
import {
  assignMembershipSchema,
  type AssignMembershipSchema,
} from "../../schemas/assignMembership.schema";
import { useAssignMembershipMutation } from "../../hooks/mutations/useAssignMembershipMutation";

interface AssignMembershipModalProps {
  memberId: string;
  memberName?: string;
  open: boolean;
  onClose: () => void;
}

export function AssignMembershipModal({
  memberId,
  memberName,
  open,
  onClose,
}: AssignMembershipModalProps) {
  const mutation = useAssignMembershipMutation();

  const handleSubmit = (data: AssignMembershipSchema) => {
    mutation.mutate(
      { memberId, memberPlanType: data.memberPlanType },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <Modal open={open} onClose={onClose} title="Asignar membresía" size="sm">
      <div className="flex flex-col gap-4 px-6 py-5">
        {memberName && (
          <p className="text-sm text-neutral-500">
            Alumno:{" "}
            <span className="font-medium text-neutral-900">{memberName}</span>
          </p>
        )}

        <Form<AssignMembershipSchema>
          schema={assignMembershipSchema}
          onSubmit={handleSubmit}
          defaultValues={{
            memberPlanType: MEMBER_PLAN_TYPE.MEMBER_PLAN_1_DAY_PER_WEEK,
          }}
          className="flex flex-col gap-4"
        >
          <FormField<AssignMembershipSchema>
            name="memberPlanType"
            label="Tipo de membresía"
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
                {MEMBER_PLAN_TYPE_FILTER_OPTIONS.map((option) => (
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
              Asignar
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}

AssignMembershipModal.displayName = "AssignMembershipModal";
