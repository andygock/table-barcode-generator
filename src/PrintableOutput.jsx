import React from "react";
import OutputTable from "./OutputTable";
import OutputInline from "./OutputInline";

// This component mounts only for a fully validated batch. Layout changes remount it
// so the Print button waits for the images in the currently displayed layout.
export default function PrintableOutput({
  result,
  title,
  outputType,
  barcodeWidth,
  barcodeMargin,
}) {
  const [loaded, setLoaded] = React.useState(() => new Set());
  const [imageError, setImageError] = React.useState(false);
  const ready = !imageError && loaded.size === result.rows.length;
  const Output = outputType === "table" ? OutputTable : OutputInline;
  return (
    <>
      <div className="screen-only print-controls">
        <button type="button" disabled={!ready} onClick={() => window.print()}>
          Print
        </button>
        <span role="status" aria-live="polite">
          {imageError
            ? "A barcode image could not load. Change the input to retry."
            : ready
              ? `Ready to print ${result.rows.length} barcode${result.rows.length === 1 ? "" : "s"}.`
              : "Loading barcode images…"}
        </span>
      </div>
      {!ready && (
        <p className="print-only">
          Barcode images are not ready. Wait until Print is available.
        </p>
      )}
      <div
        className={
          ready ? "printable-output" : "printable-output print-pending"
        }
      >
        {title && <h2 className="title">{title}</h2>}
        <Output
          {...result}
          barcodeWidth={barcodeWidth}
          barcodeMargin={barcodeMargin}
          onImageLoad={(index) =>
            setLoaded((previous) => new Set(previous).add(index))
          }
          onImageError={() => setImageError(true)}
        />
      </div>
    </>
  );
}
