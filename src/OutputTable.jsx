import React from "react";
import QRCode from "qrcode";
import { getBarcodeContents } from "./barcodeRows";

const OutputTable = ({
  records,
  barcodeType = "qrcode",
  barcodeWidth = 100,
  barcodeMargin = 10,
  hasHeaderRow = false,
  errorCorrectionLevel = "M",
}) => {
  const [barcodes, setBarcodes] = React.useState([]);

  // generate qr code for each row's last column, returns array of Promise resolving to an array of data URLs
  const createQRCodes = React.useCallback(
    async (barcodeContent) => {
      // https://github.com/soldair/node-qrcode
      // https://github.com/soldair/node-qrcode#qr-code-options
      const qrcodes = await Promise.all(
        barcodeContent.map((data) =>
          QRCode.toDataURL(data, {
            width: barcodeWidth * 4, // scale it 4x, for print quality
            margin: 0,
            errorCorrectionLevel,
          })
        )
      );
      return qrcodes;
    },
    [barcodeWidth, errorCorrectionLevel]
  );

  React.useEffect(() => {
    const createBarcodes = async () => {
      // Only generate barcodes for rows that will actually be rendered.
      const barcodeContent = getBarcodeContents(records, hasHeaderRow);

      if (barcodeType === "qrcode") {
        // create array of base64 encodings of barcodes
        const qrcodes = await createQRCodes(barcodeContent);

        // update state
        setBarcodes(qrcodes);
      }
    };

    createBarcodes();
  }, [records, hasHeaderRow, barcodeWidth, barcodeMargin, barcodeType, createQRCodes]);

  // display nothing if empty rows
  if (records.length === 0) return null;

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
