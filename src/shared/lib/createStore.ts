import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { StateCreator } from "zustand";

const IS_DEV = import.meta.env.DEV;

export function createStore<T>(
  name: string,
  initializer: StateCreator<T, [["zustand/devtools", never]]>,
) {
  return IS_DEV
    ? create<T>()(devtools(initializer, { name }))
    : create<T>()(initializer as StateCreator<T>);
}
