import type { FilterOption } from "@shared/types/filters.types";

export interface ToolbarTab {
  label: string;
  value: string;
}

export interface ToolbarFilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
}

export interface ExtraFilterChip {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}
