import React from "react";
import { parseInput } from "./parseInput.js";
import { generateBarcodes } from "./generateBarcodes.js";

// Results belong to an exact input snapshot: never combine old images with new text.
export default function useQRCodes(input, delimiter, hasHeaderRow, width) {
  const request = React.useMemo(
    () => ({ input, delimiter, hasHeaderRow, width }),
    [input, delimiter, hasHeaderRow, width],
  );
  const [result, setResult] = React.useState(null);
  React.useEffect(() => {
    let cancelled = false;
    // Debounce both parsing and encoding rather than starting full batches while typing.
    const timer = setTimeout(async () => {
      try {
        const parsed = parseInput(input, delimiter, hasHeaderRow);
        const rows = hasHeaderRow ? parsed.rows.slice(1) : parsed.rows;
        let generated = { barcodes: [], errors: [] };
        if (!parsed.errors.length && rows.length && width !== null) {
          generated = await generateBarcodes(rows, width, () => cancelled);
        }
        if (!cancelled && generated) {
          setResult({
            request,
            rows,
            header: hasHeaderRow ? parsed.rows[0] : null,
            barcodes: generated.barcodes,
            errors: [...parsed.errors, ...generated.errors],
          });
        }
      } catch (error) {
        if (!cancelled)
          setResult({
            request,
            rows: [],
            barcodes: [],
            errors: [error.message],
          });
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [request, input, delimiter, hasHeaderRow, width]);
  return result?.request === request
    ? { ...result, pending: false }
    : { rows: [], barcodes: [], errors: [], pending: true };
}
