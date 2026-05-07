import { Mail, Phone, MapPin, Calendar, IdCard } from "lucide-react";
import { Card } from "@shared/ui";
import { formatDate } from "@shared/utils/date.utils";
import { ProfileContactRow } from "@features/members/components/common";
import type { Member } from "../../../types";

interface MemberProfileContactProps {
  member: Member;
}

export function MemberProfileContact({ member }: MemberProfileContactProps) {
  return (
    <Card className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-col gap-4">
        <h6 className="text-neutral-500">Datos personales</h6>

        <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 xl:grid-cols-3">
          <ProfileContactRow
            icon={IdCard}
            label="DNI"
            value={member.dni}
            empty={!member.dni}
            iconColor={"text-primary-400"}
            iconBg={"bg-primary-50"}
          />

          <ProfileContactRow
            icon={Mail}
            label="Email"
            value={member.email || "Sin email registrado"}
            empty={!member.email}
            iconColor={member.email ? "text-purple-500" : "text-neutral-400"}
            iconBg={member.email ? "bg-purple-50" : "bg-neutral-100"}
          />

          <ProfileContactRow
            icon={Calendar}
            label="Fecha de nacimiento"
            value={
              member.bornDate ? formatDate(member.bornDate) : "Sin registro"
            }
            iconColor={member.bornDate ? "text-orange-500" : "text-neutral-400"}
            iconBg="bg-orange-50"
          />

          <ProfileContactRow
            icon={MapPin}
            label="Dirección"
            value={member.address || "Sin dirección registrada"}
            empty={!member.address}
            iconColor={member.address ? "text-red-500" : "text-neutral-400"}
            iconBg={member.address ? "bg-red-50" : "bg-neutral-100"}
          />

          <ProfileContactRow
            icon={Phone}
            label="Teléfono"
            value={member.phone || "Sin registro"}
            empty={!member.phone}
            iconColor={member.phone ? "text-emerald-600" : "text-neutral-400"}
            iconBg={member.phone ? "bg-emerald-50" : "bg-neutral-100"}
          />

          <ProfileContactRow
            icon={Phone}
            label="Teléfono de emergencia"
            value={member.emergencyPhone || "Sin registro"}
            empty={!member.emergencyPhone}
            iconColor={
              member.emergencyPhone ? "text-blue-500" : "text-neutral-400"
            }
            iconBg={member.emergencyPhone ? "bg-blue-50" : "bg-neutral-100"}
          />
        </div>
      </div>
    </Card>
  );
}

MemberProfileContact.displayName = "MemberProfileContact";
