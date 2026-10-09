import { useState } from "react";
import { MessageSquare, Pencil } from "lucide-react";
import { Button, IconButton, Label, Textarea } from "@shared/ui";

interface ObservationEditorProps {
  inputId: string;
  initialValue: string;
  onCancel: () => void;
  onSave: (text: string) => void;
}

function ObservationEditor({
  inputId,
  initialValue,
  onCancel,
  onSave,
}: ObservationEditorProps) {
  const [draft, setDraft] = useState(initialValue);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={inputId}>Observación</Label>
      <Textarea
        id={inputId}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={2}
        autoFocus
        placeholder="Ingresar observación (opcional)"
      />
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          intent="neutral"
          onClick={onCancel}
          className="h-11"
        >
          Cancelar
        </Button>
        <Button
          intent="primary"
          onClick={() => onSave(draft.trim())}
          className="h-11"
        >
          Guardar
        </Button>
      </div>
    </div>
  );
}

interface ExecutionObservationFieldProps {
  inputId: string;
  value: string | null;
  hint?: string;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (text: string) => void;
}

export function ExecutionObservationField({
  inputId,
  value,
  hint,
  editing,
  onEdit,
  onCancel,
  onSave,
}: ExecutionObservationFieldProps) {
  if (editing) {
    return (
      <ObservationEditor
        inputId={inputId}
        initialValue={value ?? ""}
        onCancel={onCancel}
        onSave={onSave}
      />
    );
  }

  if (!value) return null;

  return (
    <div className="flex items-start gap-2 rounded-lg border border-neutral-200 bg-white py-1 pr-1 pl-3 text-sm">
      <MessageSquare
        size={14}
        aria-hidden="true"
        className="mt-2.5 shrink-0 text-neutral-400"
      />
      <div className="flex-1 py-2">
        <p className="whitespace-pre-line text-neutral-700">{value}</p>
        {hint && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
      </div>
      <IconButton
        size="md"
        intent="primary"
        aria-label="Editar observación"
        onClick={onEdit}
        className="size-11"
      >
        <Pencil size={14} aria-hidden="true" />
      </IconButton>
    </div>
  );
}

ExecutionObservationField.displayName = "ExecutionObservationField";
