import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormFieldArray, FormMessage } from "@shared/components/Form";
import { RiskFlagModal } from "@features/riskFlags";
import type { RiskFlag } from "@features/riskFlags";
import { useCreateRiskFlagFromProfile } from "../../../hooks/useCreateRiskFlagFromProfile";
import { buildMemberRiskFlag } from "../../../lib/memberRiskFlagFactory";
import type { ClinicalProfileFormSchema } from "../../../schemas/clinicalProfile.schema";
import { RiskFlagSearchField } from "../ClinicalProfileFormFields/RiskFlagSearchField";
import { EmptyRiskFlagsState } from "./EmptyRiskFlagsState";
import { MemberRiskFlagCard } from "./MemberRiskFlagCard";
import { MissingRiskFlagCard } from "./MissingRiskFlagCard";

interface MemberRiskFlagsSectionProps {
  availableRiskFlags: RiskFlag[];
}

export function MemberRiskFlagsSection({
  availableRiskFlags,
}: MemberRiskFlagsSectionProps) {
  const createModal = useCreateRiskFlagFromProfile();
  const { control } = useFormContext<ClinicalProfileFormSchema>();

  const memberRiskFlags = useWatch({
    control,
    name: "memberRiskFlags",
  }) as Array<{ riskFlagId: string }> | undefined;

  const excludeIds = (memberRiskFlags ?? []).map((mrf) => mrf.riskFlagId);

  const lookupPool = useMemo<RiskFlag[]>(() => {
    const byId = new Map<string, RiskFlag>();
    for (const rf of availableRiskFlags) byId.set(rf.id, rf);
    for (const rf of createModal.newlyCreated) {
      if (!byId.has(rf.id)) byId.set(rf.id, rf);
    }
    return [...byId.values()];
  }, [availableRiskFlags, createModal.newlyCreated]);

  return (
    <FormFieldArray<ClinicalProfileFormSchema> name="memberRiskFlags">
      {({ fields, append, remove }) => {
        function handleSelect(riskFlag: RiskFlag) {
          append(buildMemberRiskFlag(riskFlag));
        }

        function handleRiskFlagCreated(riskFlag: RiskFlag) {
          createModal.registerCreated(riskFlag);
          handleSelect(riskFlag);
          createModal.close();
        }

        return (
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold text-neutral-800">
                Risk flags del alumno
              </h3>
              <p className="text-xs text-neutral-500">
                Buscá y asociá risk flags al perfil clínico del alumno.
              </p>
            </div>

            <RiskFlagSearchField
              availableRiskFlags={lookupPool}
              excludeIds={excludeIds}
              onSelect={handleSelect}
              onCreateNew={createModal.open}
            />

            {fields.length === 0 ? (
              <EmptyRiskFlagsState />
            ) : (
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                {fields.map((field, index) => {
                  const riskFlagId = memberRiskFlags?.[index]?.riskFlagId;
                  const riskFlag = lookupPool.find(
                    (rf) => rf.id === riskFlagId,
                  );

                  if (!riskFlag) {
                    return (
                      <MissingRiskFlagCard
                        key={field.id}
                        onRemove={() => remove(index)}
                      />
                    );
                  }

                  return (
                    <MemberRiskFlagCard
                      key={field.id}
                      index={index}
                      riskFlag={riskFlag}
                      onRemove={() => remove(index)}
                    />
                  );
                })}
              </div>
            )}

            <FormMessage<ClinicalProfileFormSchema> name="memberRiskFlags" />

            <RiskFlagModal
              open={createModal.isOpen}
              onClose={createModal.close}
              onCreated={handleRiskFlagCreated}
              defaultName={createModal.defaultName}
            />
          </section>
        );
      }}
    </FormFieldArray>
  );
}

MemberRiskFlagsSection.displayName = "MemberRiskFlagsSection";
