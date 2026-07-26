import { LoadingState } from "@shared/components/LoadingState/LoadingState";
import { useSettingsQuery, useUpdateSettingMutation } from "@features/settings";
import type { MemberPlanType } from "./types";
import { MEMBER_PLAN_TYPES_ORDER, MEMBER_PLAN_TYPE_LABELS } from "./constants";
import { MembershipPlanCard } from "./components/Memberships/MembershipPlanCard";

export default function MembershipsPage() {
  const { data: settings, isLoading, isError } = useSettingsQuery();
  const { mutate: updateSetting } = useUpdateSettingMutation();

  const priceByKey = new Map(
    (settings ?? []).map((setting) => [setting.key, Number(setting.value)]),
  );

  const handlePriceChange = (planType: MemberPlanType, price: number) => {
    updateSetting({ key: planType, value: String(price) });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-neutral-900 text-xl md:text-3xl">Membresías</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Tipos de membresía y su precio mensual
        </p>
      </div>

      {isLoading ? (
        <LoadingState message="Cargando planes..." />
      ) : isError || !settings ? (
        <p className="text-sm text-neutral-500">
          No se pudieron cargar los planes. Intentá de nuevo más tarde.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MEMBER_PLAN_TYPES_ORDER.map((planType) => (
            <MembershipPlanCard
              key={planType}
              planType={planType}
              label={MEMBER_PLAN_TYPE_LABELS[planType]}
              price={priceByKey.get(planType) ?? 0}
              onPriceChange={handlePriceChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
