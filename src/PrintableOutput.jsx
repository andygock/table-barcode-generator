import React from "react";
import OutputTable from "./OutputTable";
import OutputInline from "./OutputInline";

// Track readiness silently so browser printing cannot include partially loaded
// barcodes. Dedicated print controls are intentionally hidden for now.
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
  const className = [
    "printable-output",
    `printable-output--${outputType}`,
    ready ? null : "print-pending",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={className}>
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
  );
}
