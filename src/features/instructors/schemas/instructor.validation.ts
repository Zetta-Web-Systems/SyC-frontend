export const INSTRUCTOR_VALIDATION = {
  dni: {
    minLength: 7,
    maxLength: 8,
  },
  phone: {
    minLength: 9,
    maxLength: 15,
    regex: /^\d{2,4}-\d{7}$/,
  },
  address: {
    maxLength: 255,
  },
} as const;
