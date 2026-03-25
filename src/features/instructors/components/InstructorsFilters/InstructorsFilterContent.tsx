import { Label, Select } from "@shared/ui";
import {
  ORDER_OPTIONS,
  STATUS_TABS,
} from "../../constants/instructors.constants";

interface InstructorsFilterContentProps {
  statusFilter: string;
  onStatusChange: (value: string) => void;
  orderByValue: string;
  onOrderByChange: (value: string) => void;
}

export function InstructorsFilterContent({
  statusFilter,
  onStatusChange,
  orderByValue,
  onOrderByChange,
}: InstructorsFilterContentProps) {
  return (
    <div className="flex min-w-48 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-neutral-700">Estado</Label>
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          size="sm"
        >
          {STATUS_TABS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-neutral-700">
          Ordenar por
        </Label>
        <Select
          value={orderByValue}
          onChange={(e) => onOrderByChange(e.target.value)}
          size="sm"
        >
          {ORDER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}

InstructorsFilterContent.displayName = "InstructorsFilterContent";
