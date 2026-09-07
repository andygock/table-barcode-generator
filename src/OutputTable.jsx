import React from "react";
import BarcodeImage from "./BarcodeImage";

// Source lines remain stable identities even when the header is excluded.
const OutputTable = ({
  rows,
  header,
  barcodes,
  barcodeWidth,
  barcodeMargin,
  onImageLoad,
  onImageError,
}) => (
  <table className="table-custom">
    {header && (
      <thead>
        <tr>
          {header.cells.map((cell, index) => (
            <th scope="col" key={index}>
              {cell}
            </th>
          ))}
          <th scope="col">Barcode</th>
        </tr>
      </thead>
    )}
    <tbody>
      {rows.map((row, index) => (
        <tr key={row.line}>
          {row.cells.map((cell, column) => (
            <td key={column} className="data is-family-monospace">
              {cell}
            </td>
          ))}
          <td className="barcode" style={{ padding: `${barcodeMargin}mm` }}>
            <BarcodeImage
              src={barcodes[index]}
              line={row.line}
              width={barcodeWidth}
              onLoad={() => onImageLoad(index)}
              onError={onImageError}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
export default OutputTable;
