import { SearchInput, Select, Label } from "@shared/ui";
import {
  ORDER_OPTIONS,
  STATUS_OPTIONS,
} from "../../constants/instructors.constants";

interface InstructorsFiltersProps {
  onSearch: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  orderByValue: string;
  onOrderByChange: (value: string) => void;
}

export function InstructorsFilters({
  onSearch,
  statusFilter,
  onStatusChange,
  orderByValue,
  onOrderByChange,
}: InstructorsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4">
      <SearchInput
        placeholder="Buscar por nombre o apellido..."
        onSearch={onSearch}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-1 items-end gap-2 sm:flex-initial">
          <Label className="shrink-0 pb-2 text-sm text-neutral-500">
            Estado
          </Label>
          <Select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            size="sm"
            className="w-full sm:w-32"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-1 items-end gap-2 sm:flex-initial">
          <Label className="shrink-0 pb-2 text-sm text-neutral-500">
            Ordenar por
          </Label>
          <Select
            value={orderByValue}
            onChange={(e) => onOrderByChange(e.target.value)}
            size="sm"
            className="w-full sm:w-40"
          >
            {ORDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}

InstructorsFilters.displayName = "InstructorsFilters";
