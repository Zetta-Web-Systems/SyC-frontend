export interface ToolbarTab {
  label: string;
  value: string;
}

export interface FilterOption {
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
