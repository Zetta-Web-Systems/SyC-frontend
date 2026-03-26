interface SidebarTooltipProps {
  label: string;
}

export function SidebarTooltip({ label }: SidebarTooltipProps) {
  return (
    <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
      {label}
      <span className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-neutral-900" />
    </span>
  );
}
