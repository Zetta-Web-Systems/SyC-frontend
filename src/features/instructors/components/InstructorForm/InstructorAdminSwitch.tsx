import { ShieldCheck } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { Switch } from "@shared/ui";

interface AdminFields {
  isAdmin?: boolean;
}

export function InstructorAdminSwitch() {
  const { control, setValue } = useFormContext<AdminFields>();
  const isAdmin = useWatch({ control, name: "isAdmin" }) ?? false;

  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 md:col-span-2">
      <span className="flex items-center gap-2.5">
        <ShieldCheck size={18} className="text-violet" aria-hidden="true" />
        <span className="flex flex-col">
          <span className="text-sm font-medium text-neutral-900">
            Administrador
          </span>
          <span className="text-xs text-neutral-500">
            Le da acceso de administrador al profesor
          </span>
        </span>
      </span>
      <Switch
        checked={isAdmin}
        onChange={(e) =>
          setValue("isAdmin", e.target.checked, { shouldDirty: true })
        }
      />
    </label>
  );
}

InstructorAdminSwitch.displayName = "InstructorAdminSwitch";
