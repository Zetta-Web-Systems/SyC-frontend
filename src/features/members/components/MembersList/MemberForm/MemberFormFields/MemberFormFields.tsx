import { ContactCard } from "./ContactCard";
import { IdentityCard } from "./IdentityCard";
import { PhysicalCard } from "./PhysicalCard";
import { MembershipCard } from "./MembershipCard";

interface MemberFormFieldsProps {
  mode: "create" | "edit";
  dni?: string;
  isActive?: boolean;
  initialImagePreview?: string | null;
}

export function MemberFormFields({
  mode,
  dni,
  initialImagePreview,
}: MemberFormFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <IdentityCard
        mode={mode}
        dni={dni}
        initialImagePreview={initialImagePreview}
      />
      <ContactCard />
      <PhysicalCard />
      {mode === "create" && <MembershipCard />}
    </div>
  );
}

MemberFormFields.displayName = "MemberFormFields";
