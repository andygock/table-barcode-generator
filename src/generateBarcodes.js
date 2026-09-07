import QRCode from "qrcode";
import { limits, sanitizeIntegerInput } from "./inputUtils.js";

const yieldToBrowser = () => new Promise((resolve) => setTimeout(resolve, 0));

// SVG avoids large canvas allocations and remains sharp in print. Yield between
// rows so edits can cancel a bounded batch before more encoding work starts.
export async function generateBarcodes(
  rows,
  width,
  isCancelled = () => false,
  render = QRCode.toString,
) {
  if (
    rows.length > limits.rows ||
    sanitizeIntegerInput(width, null, limits.minWidth, limits.maxWidth) === null
  ) {
    throw new Error("Barcode generation limits exceeded.");
  }
  const barcodes = [];
  const errors = [];
  for (const row of rows) {
    await yieldToBrowser();
    if (isCancelled()) return null;
    try {
      const payload = row.cells.at(-1);
      if (
        !payload ||
        new TextEncoder().encode(payload).length > limits.payloadBytes
      ) {
        throw new Error("Barcode value is empty or too large.");
      }
      const svg = await render(payload, {
        type: "svg",
        margin: 4,
        errorCorrectionLevel: "M",
      });
      // The viewBox includes the quiet zone, with one unit per QR module.
      // A 0.25 mm minimum module size is our print-density guardrail.
      const modules = Number(svg.match(/viewBox="0 0 (\d+) (\d+)"/)?.[1]);
      if (!modules) throw new Error("Could not determine barcode dimensions.");
      const minimumWidth = Math.ceil(modules * 0.25);
      if (width < minimumWidth)
        throw new Error(
          `Increase barcode width to at least ${minimumWidth} mm for this value.`,
        );
      barcodes.push(
        `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
      );
    } catch (error) {
      barcodes.push(null);
      errors.push(`Line ${row.line}: ${error.message}`);
    }
  }
  return isCancelled() ? null : { barcodes, errors };
}
