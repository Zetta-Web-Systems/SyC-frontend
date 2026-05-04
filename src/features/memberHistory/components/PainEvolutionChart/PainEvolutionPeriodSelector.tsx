import { Select } from "@shared/ui";
import {
  PAIN_EVOLUTION_PERIOD_OPTIONS,
  type PainEvolutionPeriodValue,
} from "../../constants/painEvolution";

interface PainEvolutionPeriodSelectorProps {
  value: PainEvolutionPeriodValue;
  onChange: (value: PainEvolutionPeriodValue) => void;
}

export function PainEvolutionPeriodSelector({
  value,
  onChange,
}: PainEvolutionPeriodSelectorProps) {
  return (
    <div className="w-44">
      <Select
        size="sm"
        value={value}
        onChange={(event) =>
          onChange(event.target.value as PainEvolutionPeriodValue)
        }
        aria-label="Período del gráfico"
      >
        {PAIN_EVOLUTION_PERIOD_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

PainEvolutionPeriodSelector.displayName = "PainEvolutionPeriodSelector";
