import React from "react";
import QRCode from "qrcode";
import { getBarcodeContents, getInvalidBarcodeRows } from "./barcodeRows";

const formatInvalidRows = (invalidRows) =>
  invalidRows.length === 1
    ? `Row ${invalidRows[0]} has no barcode value.`
    : `Rows ${invalidRows.join(", ")} have no barcode value.`;

const defaultOptions = {
  errorCorrectionLevel: "M",
  printScale: 1,
};

const useQRCodes = (
  records,
  hasHeaderRow = false,
  barcodeType = "qrcode",
  barcodeWidth = 100,
  options = defaultOptions,
) => {
  const [barcodes, setBarcodes] = React.useState([]);
  const [barcodeError, setBarcodeError] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;

    const createBarcodes = async () => {
      if (barcodeType !== "qrcode") {
        setBarcodes([]);
        setBarcodeError(`Unsupported barcode type: ${barcodeType}`);
        return;
      }

      // Validate payloads before calling the QR library so bad input is visible and recoverable.
      const invalidRows = getInvalidBarcodeRows(records, hasHeaderRow);

      if (invalidRows.length > 0) {
        setBarcodes([]);
        setBarcodeError(formatInvalidRows(invalidRows));
        return;
      }

      const barcodeContent = getBarcodeContents(records, hasHeaderRow);

      try {
        const qrcodes = await Promise.all(
          barcodeContent.map((data) =>
            QRCode.toDataURL(data, {
              width: barcodeWidth * options.printScale,
              margin: 0,
              errorCorrectionLevel: options.errorCorrectionLevel,
            }),
          ),
        );

        if (!cancelled) {
          setBarcodes(qrcodes);
          setBarcodeError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setBarcodes([]);
          setBarcodeError(error.message);
        }
      }
    };

    createBarcodes();

    return () => {
      cancelled = true;
    };
  }, [
    records,
    hasHeaderRow,
    barcodeType,
    barcodeWidth,
    options.errorCorrectionLevel,
    options.printScale,
  ]);

  return { barcodes, barcodeError };
};

export default useQRCodes;
