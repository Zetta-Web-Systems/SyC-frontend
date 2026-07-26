const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

/**
 * Formatea un número como moneda argentina (ARS) sin decimales.
 * @example formatCurrency(57000) // "$ 57.000"
 */
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}
