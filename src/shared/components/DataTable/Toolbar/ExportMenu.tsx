import { useState } from "react";
import { EllipsisVertical, FileText, FileSpreadsheet } from "lucide-react";
import { Button, Popover, PopoverItem, PopoverSeparator } from "@shared/ui";

interface ExportMenuProps {
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

export function ExportMenu({ onExportPDF, onExportExcel }: ExportMenuProps) {
  const [open, setOpen] = useState(false);

  if (!onExportPDF && !onExportExcel) return null;

  return (
    <Popover
      open={open}
      onClose={() => setOpen(false)}
      side="bottom"
      align="end"
      trigger={
        <Button
          variant="ghost"
          intent="neutral"
          size="icon"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Mas opciones"
        >
          <EllipsisVertical size={16} aria-hidden="true" />
        </Button>
      }
    >
      {onExportPDF && (
        <PopoverItem
          icon={<FileText size={16} color="red" />}
          onClick={() => {
            onExportPDF();
            setOpen(false);
          }}
        >
          Exportar a PDF
        </PopoverItem>
      )}
      {onExportPDF && onExportExcel && <PopoverSeparator />}
      {onExportExcel && (
        <PopoverItem
          icon={<FileSpreadsheet size={16} color="green" />}
          onClick={() => {
            onExportExcel();
            setOpen(false);
          }}
        >
          Exportar a Excel
        </PopoverItem>
      )}
    </Popover>
  );
}

ExportMenu.displayName = "ExportMenu";
