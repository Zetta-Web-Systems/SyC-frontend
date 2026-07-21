import { User } from "lucide-react";
import { Button, Input } from "@shared/ui";
import {
  Form,
  FormField,
  FormError,
  FormUnsavedChangesGuard,
} from "@shared/components/Form";
import { MarkdownEditor } from "@shared/components/MarkdownEditor/";
import type { MutationLike } from "@shared/types/mutations.types";
import { normalizeEmptyStrings } from "@shared/utils/normalizeFormData.utils";
import { pickDirtyFields } from "@shared/utils/pickDirtyFields.utils";
import { BodyZoneSelector } from "@shared/components/BodyZoneSelector";
import type { BodyZone } from "@shared/types/bodyZone.types";
import {
  registerRiskFlagSchema,
  updateRiskFlagSchema,
  type RegisterRiskFlagSchema,
  type UpdateRiskFlagSchema,
} from "../../../schemas/riskFlag.schema";
import type { RiskFlag } from "../../../types";

interface RiskFlagFormCreateProps {
  riskFlag?: undefined;
  defaultName?: string;
  onSubmit: (data: RegisterRiskFlagSchema) => void;
  onCancel: () => void;
  isPending: boolean;
  mutation: MutationLike;
  guardUnsavedChanges?: boolean;
}

interface RiskFlagFormEditProps {
  riskFlag: RiskFlag;
  defaultName?: string;
  onSubmit: (data: UpdateRiskFlagSchema) => void;
  onCancel: () => void;
  isPending: boolean;
  mutation: MutationLike;
  guardUnsavedChanges?: boolean;
}

type RiskFlagFormProps = RiskFlagFormCreateProps | RiskFlagFormEditProps;

export function RiskFlagForm({
  riskFlag,
  defaultName,
  onSubmit,
  onCancel,
  isPending,
  mutation,
  guardUnsavedChanges = false,
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
          affectedZones: riskFlag.affectedZones ?? [],
          medicalGuideline: riskFlag.medicalGuideline ?? "",
        }}
        className="flex flex-col gap-5"
      >
        <FormField<UpdateRiskFlagSchema> name="name" label="Nombre" required>
          {(field) => (
            <Input
              {...field}
              type="text"
              placeholder="Nombre de bandera de riesgo"
              leftElement={<User size={16} aria-hidden="true" />}
            />
          )}
        </FormField>

        <FormField<UpdateRiskFlagSchema>
          name="affectedZones"
          label="Zonas afectadas"
        >
          {(field) => (
            <BodyZoneSelector
              id={field.id}
              value={(field.value as BodyZone[] | undefined) ?? []}
              onChange={field.onChange}
              error={field.error}
              aria-describedby={field["aria-describedby"]}
              disabled={field.disabled}
            />
          )}
        </FormField>

        <FormField<UpdateRiskFlagSchema>
          name="medicalGuideline"
          label="Guía médica"
        >
          {(field) => (
            <MarkdownEditor
              id={field.id}
              value={(field.value as string | undefined) ?? ""}
              onChange={field.onChange}
              error={field.error}
              aria-describedby={field["aria-describedby"]}
              disabled={field.disabled}
              placeholder="Indicaciones para el profesional"
            />
          )}
        </FormField>

        <FormUnsavedChangesGuard active={guardUnsavedChanges} />

        <FormError mutation={mutation} />

        <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button intent="neutral" variant="outline" onClick={onCancel}>
            Volver
          </Button>
          <Button type="submit" intent="primary" isLoading={isPending}>
            Guardar cambios
          </Button>
        </div>
      </Form>
    );
  }

  return (
    <Form<RegisterRiskFlagSchema>
      schema={registerRiskFlagSchema}
      onSubmit={(data) =>
        onSubmit(normalizeEmptyStrings(data) as RegisterRiskFlagSchema)
      }
      defaultValues={{ name: defaultName ?? "" }}
      className="flex flex-col gap-5"
    >
      <FormField<RegisterRiskFlagSchema> name="name" label="Nombre" required>
        {(field) => (
          <Input
            {...field}
            type="text"
            placeholder="Nombre de bandera de riesgo"
            leftElement={<User size={16} aria-hidden="true" />}
          />
        )}
      </FormField>

      <FormField<RegisterRiskFlagSchema>
        name="affectedZones"
        label="Zonas afectadas"
      >
        {(field) => (
          <BodyZoneSelector
            id={field.id}
            value={(field.value as BodyZone[] | undefined) ?? []}
            onChange={field.onChange}
            error={field.error}
            aria-describedby={field["aria-describedby"]}
            disabled={field.disabled}
          />
        )}
      </FormField>

      <FormField<RegisterRiskFlagSchema>
        name="medicalGuideline"
        label="Guía médica"
      >
        {(field) => (
          <MarkdownEditor
            id={field.id}
            value={(field.value as string | undefined) ?? ""}
            onChange={field.onChange}
            error={field.error}
            aria-describedby={field["aria-describedby"]}
            disabled={field.disabled}
            placeholder="Indicaciones para el profesional"
          />
        )}
      </FormField>

      <FormError mutation={mutation} />

      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button intent="neutral" variant="outline" onClick={onCancel}>
          Volver
        </Button>
        <Button type="submit" intent="primary" isLoading={isPending}>
          Registrar bandera de riesgo
        </Button>
      </div>
    </Form>
  );
}

RiskFlagForm.displayName = "RiskFlagForm";
