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
import {
  PAIN_EVOLUTION_Y_DOMAIN,
  PAIN_EVOLUTION_Y_TICKS,
} from "../../constants/painEvolution";
import { isRealPoint } from "../../lib/painEvolution";
import type { PainChartRow, PainSeries } from "../../types";

interface PainEvolutionLineChartProps {
  rows: PainChartRow[];
  series: PainSeries[];
}

interface PainDotProps {
  cx?: number;
  cy?: number;
  payload?: PainChartRow;
  seriesKey: string;
  color: string;
}

function PainDot({ cx, cy, payload, seriesKey, color }: PainDotProps) {
  if (
    cx === undefined ||
    cy === undefined ||
    !isRealPoint(payload, seriesKey)
  ) {
    return <g aria-hidden="true" />;
  }
  return <circle cx={cx} cy={cy} r={3} fill={color} aria-hidden="true" />;
}

interface TooltipPayloadItem {
  dataKey: string;
  value: number;
  color: string;
  name: string;
  payload?: PainChartRow;
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

  const realItems = payload.filter((item) =>
    isRealPoint(item.payload, item.dataKey),
  );
  if (realItems.length === 0) return null;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium text-neutral-700">{formatDate(label)}</p>
      <ul className="flex flex-col gap-1">
        {realItems.map((item) => (
          <li key={item.dataKey} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-neutral-600">{item.name}:</span>
            <span className="font-semibold text-neutral-800">
              {item.value}/10
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PainEvolutionLineChart({
  rows,
  series,
}: PainEvolutionLineChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={rows}
          margin={{ top: 8, right: 12, bottom: 0, left: -16 }}
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
            domain={[...PAIN_EVOLUTION_Y_DOMAIN]}
            ticks={[...PAIN_EVOLUTION_Y_TICKS]}
            tick={{ fontSize: 11, fill: "var(--color-neutral-500)" }}
            stroke="var(--color-neutral-300)"
          />
          <Tooltip content={<CustomTooltip />} />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              dot={<PainDot seriesKey={s.key} color={s.color} />}
              activeDot={{ r: 5 }}
              connectNulls
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

PainEvolutionLineChart.displayName = "PainEvolutionLineChart";
