import { BookMarked, Save, X } from "lucide-react";
import { FabSpeedDial } from "@shared/ui";
import type { FabSpeedDialItem } from "@shared/ui";

interface FloatingActionsFabProps {
  formId: string;
  submitLabel: string;
  onCancel: () => void;
  isPending: boolean;
  onOpenLibrary?: () => void;
  onSaveAndExit?: () => void;
  visible: boolean;
}

export function FloatingActionsFab({
  formId,
  submitLabel,
  onCancel,
  isPending,
  onOpenLibrary,
  onSaveAndExit,
  visible,
}: FloatingActionsFabProps) {
  const items: FabSpeedDialItem[] = [];
  if (onOpenLibrary) {
    items.push({
      key: "library",
      label: "Ver biblioteca",
      icon: <BookMarked size={16} aria-hidden="true" />,
      intent: "neutral",
      variant: "outline",
      onClick: onOpenLibrary,
    });
  }
  items.push({
    key: "cancel",
    label: "Cancelar",
    icon: <X size={16} aria-hidden="true" />,
    intent: "danger",
    variant: "solid",
    onClick: onCancel,
  });
  if (onSaveAndExit) {
    items.push({
      key: "save-exit",
      label: "Guardar y salir",
      icon: <Save size={16} aria-hidden="true" />,
      intent: "secondary",
      variant: "solid",
      onClick: onSaveAndExit,
    });
  }
  items.push({
    key: "submit",
    label: submitLabel,
    intent: "primary",
    variant: "solid",
    type: "submit",
    form: formId,
    isLoading: isPending,
    onClick: () => {},
  });

  return (
    <FabSpeedDial
      items={items}
      visible={visible}
      ariaLabel="Acciones de la planificación"
    />
  );
}

FloatingActionsFab.displayName = "FloatingActionsFab";
