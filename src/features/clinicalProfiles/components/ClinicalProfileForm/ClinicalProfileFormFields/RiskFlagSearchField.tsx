import { SearchableCombobox } from "@shared/components/SearchableCombobox";
import type { RiskFlag } from "@features/riskFlags";
import { CreateRiskFlagOption } from "../MemberRiskFlagsSection/CreateRiskFlagOption";
import { RiskFlagListItem } from "../MemberRiskFlagsSection/RiskFlagListItem";

interface RiskFlagSearchFieldProps {
  availableRiskFlags: RiskFlag[];
  excludeIds: string[];
  onSelect: (riskFlag: RiskFlag) => void;
  onCreateNew: (searchTerm: string) => void;
}

export function RiskFlagSearchField({
  availableRiskFlags,
  excludeIds,
  onSelect,
  onCreateNew,
}: RiskFlagSearchFieldProps) {
  return (
    <SearchableCombobox<RiskFlag>
      items={availableRiskFlags}
      getKey={(rf) => rf.id}
      getLabel={(rf) => rf.name}
      excludeIds={excludeIds}
      placeholder="Buscar bandera de riesgo para agregar"
      listboxId="risk-flag-search-listbox"
      onSelect={onSelect}
      onCreate={onCreateNew}
      renderItem={({ item }) => <RiskFlagListItem riskFlag={item} />}
      renderCreateOption={({ query }) => <CreateRiskFlagOption query={query} />}
    />
  );
}

RiskFlagSearchField.displayName = "RiskFlagSearchField";
