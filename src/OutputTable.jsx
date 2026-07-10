import React from "react";
import useQRCodes from "./useQRCodes";

const OutputTable = ({
  records,
  barcodeType = "qrcode",
  barcodeWidth = 100,
  barcodeMargin = 10,
  hasHeaderRow = false,
  errorCorrectionLevel = "M",
}) => {
  const { barcodes, barcodeError } = useQRCodes(
    records,
    hasHeaderRow,
    barcodeType,
    barcodeWidth,
    {
      errorCorrectionLevel,
      printScale: 4, // Generate larger QR images so print output stays sharp.
    },
  );

  // display nothing if empty rows
  if (records.length === 0) return null;

  if (barcodeError) {
    return <div className="notification is-danger">{barcodeError}</div>;
  }

  // return HTML <table>
  return (
    <table className="table-custom">
      {hasHeaderRow && (
        <thead>
          <tr>
            {records[0].map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {records.map((row, rowIndex) => {
          if (hasHeaderRow && rowIndex === 0) return null;
          const barcodeIndex = hasHeaderRow ? rowIndex - 1 : rowIndex;

          return (
            <tr key={rowIndex}>
              {row.map((column, columnIndex) => (
                <td
                  key={columnIndex}
                  style={{ padding: barcodeMargin }}
                  className="data is-family-monospace"
                >
                  {column}
                </td>
              ))}
              {
                <td className="barcode" style={{ padding: barcodeMargin }}>
                  <img
                    src={barcodes[barcodeIndex]}
                    alt={`Barcode for row ${rowIndex + 1}`}
                    width={barcodeWidth}
                    height={barcodeWidth}
                  />
                </td>
              }
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default OutputTable;
