import { Children, isValidElement, useEffect, useMemo, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../Button/Button";
import { Modal } from "../Modal/Modal";
import { WizardContext } from "./WizardModal.context";
import { useWizardSteps } from "./useWizardSteps";

export interface WizardStepProps {
  name: string;
  stepLabel: string;
  onNext?: () => boolean | Promise<boolean>;
  onSubmit?: () => boolean | Promise<boolean>;
  nextLabel?: string;
  submitLabel?: string;
  children: ReactNode;
}

function WizardModalStep(_props: WizardStepProps) {
  return null;
}
WizardModalStep.displayName = "WizardModal.Step";

interface WizardModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg" | "xl";
  cancelLabel?: string;
  backLabel?: string;
  closeOnBackdropClick?: boolean;
  children: ReactNode;
}

export function WizardModal({
  open,
  onClose,
  title,
  size = "lg",
  cancelLabel = "Cancelar",
  backLabel = "Atrás",
  closeOnBackdropClick = true,
  children,
}: WizardModalProps) {
  const stepElements = useMemo(
    () =>
      Children.toArray(children).filter(
        (child): child is ReactElement<WizardStepProps> =>
          isValidElement(child) && child.type === WizardModalStep,
      ),
    [children],
  );

  const stepNames = useMemo(
    () => stepElements.map((el) => el.props.name),
    [stepElements],
  );

  const wizard = useWizardSteps(stepNames);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) wizard.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const activeStep = stepElements[wizard.index];
  const activeProps = activeStep?.props;

  async function handleAdvance() {
    if (!activeProps) return;
    setBusy(true);
    try {
      if (wizard.isLast) {
        const ok = activeProps.onSubmit ? await activeProps.onSubmit() : true;
        if (ok) {
          wizard.reset();
          onClose();
        }
      } else {
        const ok = activeProps.onNext ? await activeProps.onNext() : true;
        if (ok) wizard.next();
      }
    } finally {
      setBusy(false);
    }
  }

  function handleClose() {
    wizard.reset();
    onClose();
  }

  const advanceLabel = wizard.isLast
    ? (activeProps?.submitLabel ?? "Guardar cambios")
    : (activeProps?.nextLabel ?? "Siguiente");

  const ctxValue = useMemo(
    () => ({
      current: wizard.current,
      index: wizard.index,
      total: stepNames.length,
      isFirst: wizard.isFirst,
      isLast: wizard.isLast,
      next: wizard.next,
      back: wizard.back,
      goTo: wizard.goTo,
    }),
    [wizard, stepNames.length],
  );

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeOnBackdropClick={closeOnBackdropClick}
      size={size}
      title={title}
      bodyClassName="p-0"
      footer={
        <>
          {wizard.isFirst ? (
            <Button
              type="button"
              variant="ghost"
              intent="neutral"
              onClick={handleClose}
              disabled={busy}
            >
              {cancelLabel}
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              intent="neutral"
              onClick={wizard.back}
              disabled={busy}
            >
              <ArrowLeft size={14} aria-hidden="true" />
              {backLabel}
            </Button>
          )}
          <Button type="button" onClick={handleAdvance} isLoading={busy}>
            {advanceLabel}
            {!wizard.isLast && <ArrowRight size={14} aria-hidden="true" />}
          </Button>
        </>
      }
    >
      {open && activeProps && (
        <WizardContext.Provider value={ctxValue}>
          <div className="border-b border-neutral-100 px-6 py-3 text-xs font-medium text-neutral-500">
            Paso {wizard.index + 1} de {stepNames.length} ·{" "}
            {activeProps.stepLabel}
          </div>
          <div className="p-6">{activeProps.children}</div>
        </WizardContext.Provider>
      )}
    </Modal>
  );
}

WizardModal.Step = WizardModalStep;
WizardModal.displayName = "WizardModal";
