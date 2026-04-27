import React from "react";
import QRCode from "qrcode";
import { getBarcodeContents } from "./barcodeRows";

const OutputInline = ({
  records: rows,
  barcodeType = "qrcode",
  barcodeWidth = 100,
  barcodeMargin = 0.75,
  hasHeaderRow = false,
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
            width: barcodeWidth,
            margin: 0,
          }),
        ),
      );
      return qrcodes;
    },
    [barcodeWidth],
  );

  React.useEffect(() => {
    const createBarcodes = async () => {
      // Only generate barcodes for rows that will actually be rendered.
      const barcodeContent = getBarcodeContents(rows, hasHeaderRow);

      if (barcodeType === "qrcode") {
        // create array of base64 encodings of barcodes
        const qrcodes = await createQRCodes(barcodeContent);

        // update state
        setBarcodes(qrcodes);
      }
    };

    createBarcodes();
  }, [rows, hasHeaderRow, barcodeType, createQRCodes]);

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
              <img src={barcodes[barcodeIndex]} />
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
