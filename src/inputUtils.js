// Normalize numeric text input so component state always contains a valid number.
export const sanitizeIntegerInput = (value, fallback, min = 0) => {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) return fallback;

  return Math.max(min, parsed);
};
