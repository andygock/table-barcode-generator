import React from "react";
import useQRCodes from "./useQRCodes";

const OutputInline = ({
  records: rows,
  barcodeType = "qrcode",
  barcodeWidth = 100,
  barcodeMargin = 0.75,
  hasHeaderRow = false,
}) => {
  const { barcodes, barcodeError } = useQRCodes(
    rows,
    hasHeaderRow,
    barcodeType,
    barcodeWidth,
  );

  if (barcodeError) {
    return <div className="notification is-danger">{barcodeError}</div>;
  }

  return (
    <div className="output-inline">
      {rows.map((row, rowIndex) => {
        if (hasHeaderRow && rowIndex === 0) return null;
        const barcodeIndex = hasHeaderRow ? rowIndex - 1 : rowIndex;

        return (
          <div
            className="cell"
            key={rowIndex}
            style={{ margin: barcodeMargin }}
          >
            {/* barcode displayed always the last column of each row */}
            <div className="barcode">
              <img src={barcodes[barcodeIndex]} alt={`Barcode for row ${rowIndex + 1}`} />
            </div>

            {/* display each column of the row in its own div */}
            {row.map((col, colIndex) => (
              <div key={colIndex} className="text is-family-monospace">
                {col}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default OutputInline;
