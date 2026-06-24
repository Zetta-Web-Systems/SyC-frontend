import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutTemplate } from "lucide-react";
import { Modal } from "@shared/ui";
import { SearchableInfiniteList } from "@shared/components/SearchableInfiniteList";
import { toast } from "@shared/stores/toast.store";
import type { RegisterTrainingPlanFormSchema } from "../../../schemas/registerTrainingPlan.schema";
import type { TrainingPlanSimple } from "../../../types";
import { TRAINING_PLANS_KEYS } from "../../../constants";
import { getTrainingPlanById } from "../../../services/trainingPlans.api";
import { useTemplateSearchInfinite } from "../../../hooks/ui/useTemplateSearchInfinite";
import { templateToFormValues } from "../../../lib/trainingPlanFormMapping";
import { TrainingPlanCard } from "../../common";

interface LoadTemplateModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (values: RegisterTrainingPlanFormSchema) => void;
}

export function LoadTemplateModal({
  open,
  onClose,
  onApply,
}: LoadTemplateModalProps) {
  const queryClient = useQueryClient();
  const templateSearch = useTemplateSearchInfinite({ enabled: open });
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleSelect(plan: TrainingPlanSimple) {
    if (loadingId) return;
    setLoadingId(plan.id);
    try {
      const full = await queryClient.fetchQuery({
        queryKey: TRAINING_PLANS_KEYS.detail(plan.id),
        queryFn: () => getTrainingPlanById(plan.id),
      });
      onApply(templateToFormValues(full));
    } catch {
      toast.error("No se pudo cargar la plantilla", {
        description: "Intentá de nuevo en unos segundos.",
      });
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Cargar plantilla"
      size="form"
      closeOnBackdropClick
      bodyClassName="flex flex-col"
    >
      <SearchableInfiniteList<TrainingPlanSimple>
        search={templateSearch.search}
        searchSlot={{
          onSearchChange: templateSearch.setSearch,
          searchPlaceholder: "Buscar plantilla por nombre",
          searchSlotClassName: "px-6 pt-3 pb-1",
        }}
        items={templateSearch.items}
        total={templateSearch.total}
        isLoading={templateSearch.isLoading}
        isFetchingNextPage={templateSearch.isFetchingNextPage}
        hasNextPage={templateSearch.hasNextPage}
        isError={templateSearch.isError}
        scrollRef={templateSearch.scrollRef}
        sentinelRef={templateSearch.sentinelRef}
        keyFor={(p) => p.id}
        renderItem={(p) => (
          <TrainingPlanCard
            plan={p}
            loading={loadingId === p.id}
            onSelect={handleSelect}
          />
        )}
        sectionTitle="Plantillas"
        sectionLabelClassName="px-6 pt-1 pb-1"
        countLabel={({ total, hasSearch }) =>
          hasSearch ? `${total} resultados` : `${total} plantillas`
        }
        emptyIcon={<LayoutTemplate size={18} aria-hidden="true" />}
        emptyMessage="Todavía no hay plantillas guardadas"
        emptySearchMessage={(search) => (
          <>
            Sin plantillas para <b>"{search}"</b>
          </>
        )}
        errorMessage="Error al cargar las plantillas."
        listClassName="max-h-[65vh] px-6"
        listContainerClassName="grid grid-cols-1 gap-3 py-2 lg:grid-cols-2"
      />
    </Modal>
  );
}

LoadTemplateModal.displayName = "LoadTemplateModal";
