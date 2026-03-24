import { Copy } from "lucide-react";

type Props = {
  name: string;
  chosen: [string, string];
  colors: string[];
};

export function ColorScale({ name, chosen, colors }: Props) {
  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const [chosenHex, chosenStep] = chosen;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
          {name}
        </h3>

        <div className="flex items-center gap-2.5">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-neutral-900 leading-none">
              {chosenStep}
            </span>
            <span className="text-[9px] font-mono font-bold text-neutral-400 leading-none mt-1.5 uppercase">
              {chosenHex}
            </span>
          </div>
          <div
            className="w-9 h-9 rounded-lg shadow-sm border border-neutral-200 ring-4 ring-white flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: chosenHex }}
          >
            <div className="opacity-0 bg-black/10 w-full h-full flex items-center justify-center">
              <Copy size={14} strokeWidth={3} className="text-white" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="flex h-12 overflow-hidden rounded-xl border border-neutral-100 shadow-inner bg-neutral-50">
          {colors.map((color, i) => {
            const isChosen = String(steps[i]) === String(chosenStep);
            return (
              <div
                key={steps[i]}
                className={`relative flex-1 transition-all duration-500 ease-out ${
                  isChosen
                    ? "z-10 ring-2 ring-inset ring-white/40"
                    : "hover:flex-[1.8] cursor-crosshair"
                }`}
                style={{ backgroundColor: color }}
                title={`${name} ${steps[i]}: ${color}`}
              >
                {isChosen && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,1)] animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex text-[10px] font-bold font-mono text-neutral-400">
        {steps.map((step) => {
          const isChosen = String(step) === String(chosenStep);
          return (
            <div
              key={step}
              className={`flex-1 text-center transition-all duration-300 ${
                isChosen ? "text-neutral-900 scale-110" : "opacity-60"
              }`}
            >
              {step}
            </div>
          );
        })}
      </div>
    </div>
  );
}
