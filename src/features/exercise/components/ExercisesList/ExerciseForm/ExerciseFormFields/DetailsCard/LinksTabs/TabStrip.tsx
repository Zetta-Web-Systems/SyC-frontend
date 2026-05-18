import { Plus } from "lucide-react";
import { TabButton } from "./TabButton";

interface TabItem {
  id: string;
  value: string;
}

interface TabStripProps {
  items: TabItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
}

export function TabStrip({
  items,
  activeIndex,
  onSelect,
  onAdd,
}: TabStripProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
      {items.map((item, i) => (
        <TabButton
          key={item.id}
          index={i}
          link={item.value}
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
