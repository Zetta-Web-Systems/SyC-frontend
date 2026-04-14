import { useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@shared/ui";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";
import { confirm } from "@shared/stores/confirm.store";
import { MemberForm } from "../components/MembersList/MemberForm/MemberForm";
import { useRegisterMemberMutation } from "../hooks/mutations/useRegisterMemberMutation";
import type { RegisterMemberSchema } from "../schemas/member.schema";

export default function RegisterMemberPage() {
  const navigate = useNavigate();
  const mutation = useRegisterMemberMutation();
  const [navigating, setNavigating] = useState(false);

  function goToList() {
    flushSync(() => setNavigating(true));
    navigate({ to: "/members" });
  }

  function handleBack() {
    navigate({ to: "/members" });
  }

  function handleRegister(data: RegisterMemberSchema) {
    confirm({
      intent: "info",
      title: "Registrar alumno",
      description: "¿Estás seguro que deseas registrar el alumno?",
      confirmLabel: "Registrar",
      onConfirm: () => {
        const normalized = {
          ...data,
          image: data.image ?? undefined,
          currentWeight: data.currentWeight ?? undefined,
        };
        mutation.mutate(normalized, {
          onSuccess: () => goToList(),
        });
      },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Registrar alumno"
        description="Completa la información para registrar un nuevo alumno."
        actions={
          <Button variant="outline" intent="neutral" onClick={handleBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span className="hidden xs:inline">Volver</span>
          </Button>
        }
      />

      <MemberForm
        onSubmit={handleRegister}
        onCancel={handleBack}
        isPending={mutation.isPending}
        mutation={mutation}
        guardUnsavedChanges={!navigating}
      />
    </div>
  );
}
