/**
 * Normaliza los campos de un formulario, convirtiendo las cadenas vacías en `undefined`.
 * Esto es útil para evitar enviar datos vacíos al backend (salvandole la vida al feli)
 * @param data
 */
export function normalizeEmptyStrings<T extends Record<string, unknown>>(
  data: T,
): Partial<{
  [K in keyof T]: T[K] extends string ? string | undefined : T[K];
}> {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      typeof value === "string" && value.trim() === "" ? undefined : value,
    ]),
  ) as Partial<{
    [K in keyof T]: T[K] extends string ? string | undefined : T[K];
  }>;
}
