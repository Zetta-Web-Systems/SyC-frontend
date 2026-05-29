import { useMemo } from "react";
import { Pill, SelectMenu } from "@shared/ui";
import type { SelectMenuOption } from "@shared/ui";
import type { DayName } from "../../../../constants";
import { DAY_ORDER } from "../../../../lib/dayOrder";

interface DaySelectorProps {
  value: DayName;
  usedDayNames: ReadonlySet<DayName>;
  onChange: (next: DayName) => void;
}

export function DaySelector({
  value,
  usedDayNames,
  onChange,
}: DaySelectorProps) {
  const options = useMemo<SelectMenuOption<DayName>[]>(
    () =>
      DAY_ORDER.map((dn) => {
        const isUsed = dn !== value && usedDayNames.has(dn);
        return {
          value: dn,
          label: dn,
          disabled: isUsed,
          endAdornment: isUsed ? (
            <Pill size="xs" intent="neutral" tone="soft" uppercase>
              En uso
            </Pill>
          ) : undefined,
        };
      }),
    [value, usedDayNames],
  );

  return (
    <SelectMenu<DayName>
      variant="ghost"
      size="md"
      value={value}
      onChange={onChange}
      options={options}
      panelWidth="160px"
      ariaLabel="Cambiar día de la semana"
    />
  );
}

DaySelector.displayName = "DaySelector";
