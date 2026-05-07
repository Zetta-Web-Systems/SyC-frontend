import { Select } from "@shared/ui";
import {
  WEIGHT_EVOLUTION_PERIOD_OPTIONS,
  type WeightEvolutionPeriodValue,
} from "../../constants/weightEvolution";

interface WeightEvolutionPeriodSelectorProps {
  value: WeightEvolutionPeriodValue;
  onChange: (value: WeightEvolutionPeriodValue) => void;
}

export function WeightEvolutionPeriodSelector({
  value,
  onChange,
}: WeightEvolutionPeriodSelectorProps) {
  return (
    <div className="w-44">
      <Select
        size="sm"
        value={value}
        onChange={(event) =>
          onChange(event.target.value as WeightEvolutionPeriodValue)
        }
        aria-label="Período del gráfico"
      >
        {WEIGHT_EVOLUTION_PERIOD_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

WeightEvolutionPeriodSelector.displayName = "WeightEvolutionPeriodSelector";
