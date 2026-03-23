export const DEFAULT_PAGE_SIZE = 10;

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50] as const;

const ORDER_TYPE = {
  ASC: "ASC",
  DESC: "DESC",
} as const;

type OrderType = (typeof ORDER_TYPE)[keyof typeof ORDER_TYPE];

export { ORDER_TYPE };
export type { OrderType };
