import React from "react";
import InputArea, { defaultContent } from "./InputArea";
import PrintableOutput from "./PrintableOutput";
import useQRCodes from "./useQRCodes";
import { limits, sanitizeIntegerInput } from "./inputUtils";
import "./styles/app.css";

const App = () => {
  const [input, setInput] = React.useState(defaultContent);
  const [hasHeaderRow, setHasHeaderRow] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [outputType, setOutputType] = React.useState("table");
  const [delimiter, setDelimiter] = React.useState("\t");
  // Keep drafts as text: users must be able to clear a field while editing it.
  const [widthText, setWidthText] = React.useState("30");
  const [marginText, setMarginText] = React.useState("4");
  const width = sanitizeIntegerInput(
    widthText,
    null,
    limits.minWidth,
    limits.maxWidth,
  );
  const margin = sanitizeIntegerInput(marginText, null, 0, limits.maxMargin);
  const result = useQRCodes(input, delimiter, hasHeaderRow, width);
  const settingErrors = [];
  if (width === null)
    settingErrors.push(
      `Barcode width must be a whole number from ${limits.minWidth} to ${limits.maxWidth} mm.`,
    );
  if (margin === null)
    settingErrors.push(
      `Barcode spacing must be a whole number from 0 to ${limits.maxMargin} mm.`,
    );
  const errors = [...settingErrors, ...result.errors];
  const canShowOutput =
    !result.pending && !errors.length && result.rows.length > 0;

  // Match the document title so the browser's print/PDF filename follows the user's title.
  React.useEffect(() => {
    document.title = title || "TSV/CSV to Barcode Table Generator";
  }, [title]);

  return (
    <div className="container">
      <div className="screen-only content">
        <h1 className="title">TSV/CSV to Barcode Table Generator</h1>
        <div className="columns is-desktop">
          <div className="column">
            <h2>Input</h2>
            <p id="input-help">
              Paste TSV or CSV contents to add a QR code for the last column.
              All rows must have the same number of columns. Whitespace padding
              is trimmed from the last column. Empty lines and lines starting
              with &quot;#&quot; are ignored. Maximum 500 data rows, 50 columns,
              250,000 characters and 2,000 UTF-8 bytes per barcode value.
            </p>
            <InputArea
              value={input}
              onChange={setInput}
              invalid={result.errors.length > 0}
            />
          </div>
          <div className="column">
            <h2>Options</h2>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={hasHeaderRow}
                onChange={(event) => setHasHeaderRow(event.target.checked)}
              />
              &nbsp;Contains header row
            </label>
            <fieldset className="control">
              <legend>Output type</legend>
              {[
                ["table", "Table"],
                ["inline", "Grid"],
              ].map(([value, label]) => (
                <label className="radio" key={value}>
                  <input
                    type="radio"
                    name="outputType"
                    value={value}
                    checked={outputType === value}
                    onChange={(event) => setOutputType(event.target.value)}
                  />
                  &nbsp;{label}
                </label>
              ))}
            </fieldset>
            <fieldset className="control">
              <legend>Delimiter</legend>
              {[
                ["\t", "Tab"],
                [",", "Comma"],
              ].map(([value, label]) => (
                <label className="radio" key={value}>
                  <input
                    type="radio"
                    name="delimiter"
                    value={value}
                    checked={delimiter === value}
                    onChange={(event) => setDelimiter(event.target.value)}
                  />
                  &nbsp;{label}
                </label>
              ))}
            </fieldset>
            <div className="columns">
              <div className="column">
                <label htmlFor="barcode-width">Barcode width (mm)</label>
                <input
                  id="barcode-width"
                  className="input"
                  type="number"
                  min={limits.minWidth}
                  max={limits.maxWidth}
                  step="1"
                  value={widthText}
                  aria-invalid={width === null}
                  aria-describedby="size-help output-status"
                  onChange={(event) => setWidthText(event.target.value)}
                />
              </div>
              <div className="column">
                <label htmlFor="barcode-margin">Barcode spacing (mm)</label>
                <input
                  id="barcode-margin"
                  className="input"
                  type="number"
                  min="0"
                  max={limits.maxMargin}
                  step="1"
                  value={marginText}
                  aria-invalid={margin === null}
                  aria-describedby="size-help output-status"
                  onChange={(event) => setMarginText(event.target.value)}
                />
              </div>
            </div>
            <p id="size-help">
              Width includes the clear QR margin. Dense codes may need a larger
              width. Spacing controls the surrounding layout.
            </p>
            <label htmlFor="output-title">Title (optional)</label>
            <input
              id="output-title"
              className="input"
              type="text"
              maxLength={200}
              value={title}
              placeholder="Set output title (optional)..."
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
        </div>
        <h2>Output</h2>
        <div
          id="output-status"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {errors.length > 0 ? (
            <div className="notification is-danger">
              <p>Correct these errors to continue:</p>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          ) : result.pending ? (
            <p>Preparing barcodes…</p>
          ) : !result.rows.length ? (
            <p>Enter at least one data row to generate barcodes.</p>
          ) : null}
        </div>
      </div>
      {canShowOutput ? (
        <PrintableOutput
          key={outputType}
          result={result}
          title={title}
          outputType={outputType}
          barcodeWidth={width}
          barcodeMargin={margin}
        />
      ) : null}
      <footer className="screen-only">
        <a href="https://github.com/andygock/table-barcode-generator/">
          GitHub
        </a>
      </footer>
    </div>
  );
};
export default App;
