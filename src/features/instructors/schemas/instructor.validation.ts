export const INSTRUCTOR_VALIDATION = {
  dni: {
    minLength: 7,
    maxLength: 8,
  },
  phone: {
    // minLength: 16,
    // maxLength: 16,
    regex: /^\+54 (?:\d{2} \d{4}-\d{4}|\d{3} \d{3}-\d{4}|\d{4} \d{3}-\d{3})$/,
  },
  address: {
    maxLength: 255,
  },
} as const;
