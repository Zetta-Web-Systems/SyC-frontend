import { DataTableToolbar } from "@shared/components/DataTable";
import { InstructorsFilterContent } from "./InstructorsFilterContent";
import { STATUS_TABS } from "../../constants/instructors.constants";

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
    <DataTableToolbar
      tabs={STATUS_TABS}
      activeTab={statusFilter}
      searchPlaceholder="Buscar"
      onTabChange={onStatusChange}
      onSearch={onSearch}
      // onExportExcel={() => {}}
      // onExportPdf={() => {}}
      filterContent={
        <InstructorsFilterContent
          statusFilter={statusFilter}
          onStatusChange={onStatusChange}
          orderByValue={orderByValue}
          onOrderByChange={onOrderByChange}
        />
      }
    />
  );
}

InstructorsFilters.displayName = "InstructorsFilters";
