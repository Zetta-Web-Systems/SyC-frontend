import { Plus } from "lucide-react";
import { TabButton } from "./TabButton";

interface TabStripProps {
  links: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
}

export function TabStrip({ links, activeIndex, onSelect, onAdd }: TabStripProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
      {links.map((link, i) => (
        <TabButton
          key={i}
          index={i}
          link={link}
          active={activeIndex === i}
          onClick={() => onSelect(i)}
        />
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="flex shrink-0 items-center gap-1 rounded-md border border-dashed border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-neutral-500 transition hover:border-primary-400 hover:bg-primary-50 hover:text-primary-700"
        aria-label="Agregar link"
      >
        <Plus size={14} aria-hidden="true" />
        Agregar
      </button>
    </div>
  );
}
