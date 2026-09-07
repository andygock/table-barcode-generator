import React from "react";

// Both layouts share physical dimensions and report image readiness before printing.
export default function BarcodeImage({ src, line, width, onLoad, onError }) {
  return (
    <img
      src={src}
      alt={`Barcode for input line ${line}`}
      style={{ width: `${width}mm`, height: `${width}mm` }}
      onLoad={onLoad}
      onError={onError}
    />
  );
}
