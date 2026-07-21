import { useConfirmStore } from "@shared/stores/confirm.store";
import { ConfirmDialog } from "./ConfirmDialog";

export function ConfirmDialogContainer() {
  const options = useConfirmStore((s) => s.options);
  const isLoading = useConfirmStore((s) => s.isLoading);
  const handleConfirm = useConfirmStore((s) => s.handleConfirm);
  const handleTertiary = useConfirmStore((s) => s.handleTertiary);
  const close = useConfirmStore((s) => s.close);

  if (!options) return null;

  return (
    <ConfirmDialog
      open
      onClose={close}
      onConfirm={handleConfirm}
      onTertiary={options.onTertiary ? handleTertiary : undefined}
      intent={options.intent}
      icon={options.icon}
      title={options.title}
      description={options.description}
      body={options.body}
      size={options.size}
      confirmLabel={options.confirmLabel}
      cancelLabel={options.cancelLabel}
      tertiaryLabel={options.tertiaryLabel}
      isLoading={isLoading}
    />
  );
}

ConfirmDialogContainer.displayName = "ConfirmDialogContainer";
