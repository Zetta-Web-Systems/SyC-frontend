interface SidebarTooltipProps {
  label: string;
}

export function SidebarTooltip({ label }: SidebarTooltipProps) {
  return (
    <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md bg-neutral-800 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
      {label}
    </span>
  );
}
