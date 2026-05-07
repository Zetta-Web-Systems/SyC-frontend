interface LegendItem {
  label: string;
  className: string;
}

const LEGEND_ITEMS: LegendItem[] = [
  { label: "Sin dolor", className: "bg-clinical-none" },
  { label: "Muy leve", className: "bg-clinical-very-low" },
  { label: "Leve", className: "bg-clinical-low" },
  { label: "Moderado", className: "bg-clinical-mid" },
  { label: "Alto", className: "bg-clinical-high" },
  { label: "Muy alto", className: "bg-clinical-very-high" },
  { label: "Sin datos", className: "bg-neutral-400" },
];

export function ClinicalProfileBodyLegend() {
  return (
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs">
      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${item.className}`} />
          {item.label}
        </div>
      ))}
    </div>
  );
}

ClinicalProfileBodyLegend.displayName = "ClinicalProfileBodyLegend";
