import { useCallback } from "react";
import type { Ref } from "react";
import { Phone } from "lucide-react";
import { Input } from "@shared/ui";

export interface PhoneInputProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
  ref?: Ref<HTMLInputElement>;
  error?: boolean;
  placeholder?: string;
  disabled?: boolean;
  "aria-describedby"?: string;
  className?: string;
}

/**
 * Extrae el núcleo argentino de 10 dígitos de cualquier entrada con formato libre.
 *
 * Tolera prefijos de código de país (`+54`, `54`, `549` móvil), un `0` nacional
 * inicial, y cualquier cantidad de espacios/guiones. Devuelve `null` cuando el
 * resultado no tiene exactamente 10 dígitos.
 */
function extractCore(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");

  if (digits.startsWith("549") && digits.length === 13)
    digits = digits.slice(3);
  else if (digits.startsWith("54") && digits.length === 12)
    digits = digits.slice(2);
  else if (digits.startsWith("0") && digits.length === 11)
    digits = digits.slice(1);

  return digits.length === 10 ? digits : null;
}

/**
 * Forma un número de teléfono argentino en el formato canónico de WhatsApp:
 * `+54 {area} {firstHalf}-{secondHalf}`.
 *
 * @example
 * format("03534086534") // "+54 353 408-6534" acá leakeando mi número ahre
 */
function format(raw: string): string | null {
  const core = extractCore(raw);
  if (core === null) return null;

  let areaLen = 3;
  for (const i of [2, 3, 4]) {
    if (core[i] === "4" || core[i] === "5") {
      areaLen = i;
      break;
    }
  }

  const area = core.slice(0, areaLen);
  const local = core.slice(areaLen);
  const cut = Math.floor(local.length / 2);
  const firstHalf = local.slice(0, cut);
  const secondHalf = local.slice(cut);

  return `+54 ${area} ${firstHalf}-${secondHalf}`;
}

export function PhoneInput({
  value = "",
  onChange,
  onBlur,
  name,
  id,
  ref,
  error,
  placeholder,
  disabled,
  "aria-describedby": ariaDescribedBy,
  className,
}: PhoneInputProps) {
  const sanitizePhoneInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value.replace(/[^\d+\- ]/g, ""));
    },
    [onChange],
  );

  const formatPhoneOnBlur = useCallback(() => {
    if (value) {
      const formatted = format(value);
      if (formatted !== null && formatted !== value) onChange(formatted);
    }
    onBlur?.();
  }, [value, onChange, onBlur]);

  return (
    <Input
      ref={ref}
      id={id}
      name={name}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      maxLength={20}
      value={value}
      onChange={sanitizePhoneInput}
      onBlur={formatPhoneOnBlur}
      disabled={disabled}
      error={error}
      placeholder={placeholder}
      aria-describedby={ariaDescribedBy}
      className={className}
      leftElement={<Phone size={16} aria-hidden="true" />}
    />
  );
}

PhoneInput.displayName = "PhoneInput";
