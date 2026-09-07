// Shared bounds keep user input, layout and generation in agreement.
export const limits = {
  inputCharacters: 250_000,
  rows: 500,
  columns: 50,
  payloadBytes: 2_000,
  minWidth: 15,
  maxWidth: 100,
  maxMargin: 20,
};

// Reject incomplete/non-finite values instead of interpreting "1e3" as 1.
// A null fallback lets the form retain editable text separately from valid settings.
export const sanitizeIntegerInput = (
  value,
  fallback,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
) => {
  if (String(value).trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= min && parsed <= max
    ? parsed
    : fallback;
};
