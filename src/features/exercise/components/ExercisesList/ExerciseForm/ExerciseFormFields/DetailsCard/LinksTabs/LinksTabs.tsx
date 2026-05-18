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

  function setLinks(updater: (prev: string[]) => string[]) {
    const current =
      (form.getValues("links") as string[] | undefined) ?? ([] as string[]);
    form.setValue("links", updater(current), { shouldDirty: true });
    form.clearErrors("links");
  }

  function handleAdd() {
    setIds((prev) => [...prev, nextLinkId()]);
    const current =
      (form.getValues("links") as string[] | undefined) ?? ([] as string[]);
    setLinks((prev) => [...prev, ""]);
    setActiveIndex(current.length);
  }

  function handleRemove(index: number) {
    setIds((prev) => prev.filter((_, i) => i !== index));
    const current =
      (form.getValues("links") as string[] | undefined) ?? ([] as string[]);
    setLinks((prev) => prev.filter((_, i) => i !== index));
    const nextLength = current.length - 1;
    setActiveIndex((prev) => Math.max(0, Math.min(prev, nextLength - 1)));
  }

  function handleChange(index: number, value: string) {
    setLinks((prev) => prev.map((l, i) => (i === index ? value : l)));
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
