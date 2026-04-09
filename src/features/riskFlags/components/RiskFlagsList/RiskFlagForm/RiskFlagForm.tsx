import { User } from "lucide-react";
import { Button, Input } from "@shared/ui";
import { Form, FormField, FormError } from "@shared/components/Form";
import type { MutationLike } from "@shared/types/mutations.types";
import { normalizeEmptyStrings } from "@shared/utils/normalizeFormData.utils";
import { pickDirtyFields } from "@shared/utils/pickDirtyFields.utils";
import {
  registerRiskFlagSchema,
  updateRiskFlagSchema,
  type RegisterRiskFlagSchema,
  type UpdateRiskFlagSchema,
} from "../../../schemas/riskFlag.schema";
import type { RiskFlag } from "../../../types";

interface RiskFlagFormCreateProps {
  riskFlag?: undefined;
  onSubmit: (data: RegisterRiskFlagSchema) => void;
  isPending: boolean;
  mutation: MutationLike;
}

interface RiskFlagFormEditProps {
  riskFlag: RiskFlag;
  onSubmit: (data: UpdateRiskFlagSchema) => void;
  isPending: boolean;
  mutation: MutationLike;
}

type RiskFlagFormProps = RiskFlagFormCreateProps | RiskFlagFormEditProps;

export function RiskFlagForm({
  riskFlag,
  onSubmit,
  isPending,
  mutation,
}: RiskFlagFormProps) {
  const isEditing = !!riskFlag;

  if (isEditing) {
    return (
      <Form<UpdateRiskFlagSchema>
        schema={updateRiskFlagSchema}
        onSubmit={(data, form) =>
          onSubmit(
            pickDirtyFields(
              data,
              form.formState.dirtyFields,
            ) as UpdateRiskFlagSchema,
          )
        }
        defaultValues={{
          name: riskFlag.name,
        }}
        className="flex flex-col gap-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField<UpdateRiskFlagSchema> name="name" label="Nombre" required>
            {(field) => (
              <Input
                {...field}
                type="text"
                placeholder="Nombre del flag de riesgo"
                leftElement={<User size={16} aria-hidden="true" />}
              />
            )}
          </FormField>
        </div>

        <FormError mutation={mutation} />

        <Button
          type="submit"
          intent="primary"
          className="mt-2 w-full"
          isLoading={isPending}
        >
          Guardar cambios
        </Button>
      </Form>
    );
  }

  return (
    <Form<RegisterRiskFlagSchema>
      schema={registerRiskFlagSchema}
      onSubmit={(data) =>
        onSubmit(normalizeEmptyStrings(data) as RegisterRiskFlagSchema)
      }
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField<RegisterRiskFlagSchema> name="name" label="Nombre" required>
          {(field) => (
            <Input
              {...field}
              type="text"
              placeholder="Nombre del flag de riesgo"
              leftElement={<User size={16} aria-hidden="true" />}
            />
          )}
        </FormField>
      </div>

      <FormError mutation={mutation} />

      <Button
        type="submit"
        intent="primary"
        className="mt-2 w-full"
        isLoading={isPending}
      >
        Registrar flag de riesgo
      </Button>
    </Form>
  );
}

RiskFlagForm.displayName = "RiskFlagForm";
