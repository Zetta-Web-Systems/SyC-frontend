type Props = {
  name: string;
  colors: string[];
};

export function ColorScale({ name, colors }: Props) {
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-neutral-500">{name}</p>

      <div className="flex overflow-hidden rounded-xl border border-neutral-200">
        {colors.map((color, i) => (
          <div
            key={steps[i]}
            className="h-10 flex-1"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="flex text-[10px] text-neutral-400">
        {steps.map((step) => (
          <div key={step} className="flex-1 text-center">
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
