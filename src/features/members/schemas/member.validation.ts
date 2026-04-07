export const MEMBER_VALIDATION = {
  dni: {
    minLength: 7,
    maxLength: 8,
  },
  phone: {
    regex: /^\+54 (?:\d{2} \d{4}-\d{4}|\d{3} \d{3}-\d{4}|\d{4} \d{3}-\d{3})$/,
  },
  address: {
    maxLength: 255,
  },
  currentWeight: {
    min: 1,
    max: 500,
  },
} as const;
