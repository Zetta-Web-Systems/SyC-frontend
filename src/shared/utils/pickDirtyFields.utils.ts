/**
 * Filtra un objeto de valores dejando únicamente las claves marcadas como
 * "dirty" por React Hook Form. Útil para construir payloads PATCH que sólo
 * contengan los campos que el usuario efectivamente modificó.
 */
export function pickDirtyFields<T extends Record<string, unknown>>(
  values: T,
  dirtyFields: Partial<Record<keyof T, unknown>>,
): Partial<T> {
  const result: Partial<T> = {};
  for (const key of Object.keys(values) as (keyof T)[]) {
    if (dirtyFields[key]) {
      result[key] = values[key];
    }
  }
  return result;
}
