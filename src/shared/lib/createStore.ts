import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { PersistOptions } from "zustand/middleware";
import type { StateCreator } from "zustand";

const IS_DEV = import.meta.env.DEV;

interface CreateStoreOptions<T> {
  persist?: PersistOptions<T, Partial<T>>;
}

export function createStore<T>(
  name: string,
  initializer: StateCreator<T, [["zustand/devtools", never]]>,
  options?: CreateStoreOptions<T>,
) {
  const withPersist = options?.persist
    ? (persist(
        initializer as StateCreator<T, []>,
        options.persist,
      ) as StateCreator<T, [["zustand/devtools", never]]>)
    : initializer;

  return IS_DEV
    ? create<T>()(devtools(withPersist, { name }))
    : create<T>()(withPersist as StateCreator<T>);
}
