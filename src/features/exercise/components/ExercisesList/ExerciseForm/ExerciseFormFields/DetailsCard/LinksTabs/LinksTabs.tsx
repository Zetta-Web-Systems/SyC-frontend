import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { ActiveLinkPanel } from "./ActiveLinkPanel";
import { EmptyState } from "./EmptyState";
import { TabStrip } from "./TabStrip";

let linkIdCounter = 0;
const nextLinkId = () => `link-${++linkIdCounter}`;

export function LinksTabs() {
  const form = useFormContext();
  const links =
    (form.watch("links") as string[] | undefined) ?? ([] as string[]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ids, setIds] = useState<string[]>(() => links.map(() => nextLinkId()));

  if (ids.length !== links.length) {
    setIds((current) => {
      if (current.length === links.length) return current;
      if (current.length < links.length) {
        const extra = Array.from(
          { length: links.length - current.length },
          () => nextLinkId(),
        );
        return [...current, ...extra];
      }
      return current.slice(0, links.length);
    });
  }

  const tabItems = links.map((value, i) => ({
    id: ids[i] ?? `pending-${i}`,
    value,
  }));

  function setLinks(next: string[]) {
    form.setValue("links", next, { shouldDirty: true });
    form.clearErrors("links");
  }

  function handleAdd() {
    setIds((prev) => [...prev, nextLinkId()]);
    setLinks([...links, ""]);
    setActiveIndex(links.length);
  }

  function handleRemove(index: number) {
    setIds((prev) => prev.filter((_, i) => i !== index));
    const next = links.filter((_, i) => i !== index);
    setLinks(next);
    setActiveIndex((prev) => Math.max(0, Math.min(prev, next.length - 1)));
  }

  function handleChange(index: number, value: string) {
    setLinks(links.map((l, i) => (i === index ? value : l)));
  }

  const errorMessage = form.formState.errors.links?.message as
    | string
    | undefined;

  const safeIndex =
    links.length === 0 ? -1 : Math.min(activeIndex, links.length - 1);
  const activeLink = safeIndex >= 0 ? links[safeIndex] : null;

  return (
    <div className="flex flex-col gap-3">
      {links.length === 0 ? (
        <EmptyState onAdd={handleAdd} />
      ) : (
        <>
          <TabStrip
            items={tabItems}
            activeIndex={safeIndex}
            onSelect={setActiveIndex}
            onAdd={handleAdd}
          />

          {activeLink !== null && (
            <ActiveLinkPanel
              url={activeLink}
              onChange={(value) => handleChange(safeIndex, value)}
              onRemove={() => handleRemove(safeIndex)}
            />
          )}
        </>
      )}

      {errorMessage && (
        <p role="alert" className="text-xs text-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
