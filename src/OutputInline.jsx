import React from "react";
import BarcodeImage from "./BarcodeImage";

const OutputInline = ({
  rows,
  barcodes,
  barcodeWidth,
  barcodeMargin,
  onImageLoad,
  onImageError,
}) => (
  <div
    className="output-inline"
    style={{
      "--cell-width": `${barcodeWidth + 8}mm`,
      gap: `${barcodeMargin}mm`,
    }}
  >
    {rows.map((row, index) => (
      <div className="cell" key={row.line}>
        {/* The barcode encodes the last column of each row. */}
        <div className="barcode">
          <BarcodeImage
            src={barcodes[index]}
            line={row.line}
            width={barcodeWidth}
            onLoad={() => onImageLoad(index)}
            onError={onImageError}
          />
        </div>
        {/* Display each column of the row on its own line. */}
        {row.cells.map((cell, column) => (
          <div key={column} className="text is-family-monospace">
            {cell}
          </div>
        ))}
      </div>
    ))}
  </div>
);
export default OutputInline;
