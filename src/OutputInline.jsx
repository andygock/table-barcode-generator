import React from "react";
import QRCode from "qrcode";

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
      // get array of strings, to convert to barcodes
      const barcodeContent = rows.map((row) => row[row.length - 1]);

      if (barcodeType === "qrcode") {
        // create array of base64 encodings of barcodes
        const qrcodes = await createQRCodes(barcodeContent);

        // update state
        setBarcodes(qrcodes);
      }
    };

    createBarcodes();
  }, [rows, barcodeType, createQRCodes]);

  return (
    <div className="output-inline">
      {rows.map((row, rowIndex) => {
        if (hasHeaderRow && rowIndex === 0) return null;
        return (
          <div
            className="cell"
            key={rowIndex}
            style={{ margin: barcodeMargin }}
          >
            {/* barcode displayed always the last column of each row */}
            <div className="barcode">
              <img src={barcodes[rowIndex]} />
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
