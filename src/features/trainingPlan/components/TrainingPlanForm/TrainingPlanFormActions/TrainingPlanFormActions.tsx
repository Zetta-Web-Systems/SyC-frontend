import { useEffect, useRef, useState } from "react";
import { useWatch } from "react-hook-form";
import { BookMarked } from "lucide-react";
import { Button, Portal } from "@shared/ui";
import type { RegisterTrainingPlanFormSchema } from "../../../schemas/registerTrainingPlan.schema";
import { FloatingActionsFab } from "./FloatingActionsFab";

interface TrainingPlanFormActionsProps {
  formId: string;
  onCancel: () => void;
  isPending: boolean;
  onOpenLibrary?: () => void;
}

export function TrainingPlanFormActions({
  formId,
  onCancel,
  isPending,
  onOpenLibrary,
}: TrainingPlanFormActionsProps) {
  const mode = useWatch<RegisterTrainingPlanFormSchema>({ name: "mode" });
  const submitLabel =
    mode === "template" ? "Guardar plantilla" : "Guardar plan";

  const inlineRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);
  const [scrollHidden, setScrollHidden] = useState(false);

  useEffect(() => {
    const el = inlineRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setAtBottom(entry.isIntersecting),
      { rootMargin: "0px 0px -64px 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        if (Math.abs(delta) > 6) {
          setScrollHidden(delta > 0 && y > 120);
          lastY = y;
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fabVisible = !atBottom && !scrollHidden;

  return (
    <>
      <div
        ref={inlineRef}
        className="mt-2 flex flex-col-reverse gap-3 border-t border-neutral-200 px-4 py-3 sm:flex-row sm:justify-end"
      >
        {onOpenLibrary && (
          <Button intent="neutral" variant="outline" onClick={onOpenLibrary}>
            <BookMarked size={16} aria-hidden="true" />
            Ver biblioteca
          </Button>
        )}
        <Button intent="danger" variant="solid" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          form={formId}
          intent="primary"
          isLoading={isPending}
        >
          {submitLabel}
        </Button>
      </div>

      <Portal>
        <FloatingActionsFab
          formId={formId}
          submitLabel={submitLabel}
          onCancel={onCancel}
          isPending={isPending}
          onOpenLibrary={onOpenLibrary}
          visible={fabVisible}
        />
      </Portal>
    </>
  );
}

TrainingPlanFormActions.displayName = "TrainingPlanFormActions";
