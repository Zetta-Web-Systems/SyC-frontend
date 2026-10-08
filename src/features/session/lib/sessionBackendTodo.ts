const warned = new Set<string>();

export function warnBackendTodo(
  code: string,
  message: string,
  once = false,
): void {
  if (once && warned.has(code)) return;
  warned.add(code);
  console.warn(`TODO (back ${code}): ${message}`);
}
