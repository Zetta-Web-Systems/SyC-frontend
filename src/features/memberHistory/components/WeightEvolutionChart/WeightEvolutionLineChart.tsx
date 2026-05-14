import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDate, formatDateShort } from "@shared/utils/date.utils";
import { WEIGHT_EVOLUTION_LINE_COLOR } from "../../constants/weightEvolution";
import type { WeightChartRow } from "../../types";

interface WeightEvolutionLineChartProps {
  rows: WeightChartRow[];
  domain: [number, number];
}

interface TooltipPayloadItem {
  value: number;
  payload?: WeightChartRow;
}

interface CustomTooltipProps {
  active?: boolean;
  label?: number;
  payload?: TooltipPayloadItem[];
}

function CustomTooltip({ active, label, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0 || label === undefined) {
    return null;
  }
  const value = payload[0].value;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium text-neutral-700">{formatDate(label)}</p>
      <p className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="size-2 rounded-full"
          style={{ backgroundColor: WEIGHT_EVOLUTION_LINE_COLOR }}
        />
        <span className="text-neutral-600">Peso:</span>
        <span className="font-semibold text-neutral-800">{value} kg</span>
      </p>
    </div>
  );
}

export function WeightEvolutionLineChart({
  rows,
  domain,
}: WeightEvolutionLineChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={rows}
          margin={{ top: 8, right: 12, bottom: 0, left: -8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-neutral-200)"
          />
          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(value: number) => formatDateShort(value)}
            tick={{ fontSize: 11, fill: "var(--color-neutral-500)" }}
            tickMargin={6}
            stroke="var(--color-neutral-300)"
          />
          <YAxis
            domain={domain}
            tickFormatter={(value: number) => `${value} kg`}
            tick={{ fontSize: 11, fill: "var(--color-neutral-500)" }}
            stroke="var(--color-neutral-300)"
            width={56}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="weight"
            name="Peso"
            stroke={WEIGHT_EVOLUTION_LINE_COLOR}
            strokeWidth={2}
            dot={{ r: 3, fill: WEIGHT_EVOLUTION_LINE_COLOR }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

WeightEvolutionLineChart.displayName = "WeightEvolutionLineChart";
