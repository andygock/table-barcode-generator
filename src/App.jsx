import React from "react";
import InputArea from "./InputArea";
import OutputTable from "./OutputTable";
import "./style.css";
import OutputInline from "./OutputInline";

const App = () => {
  const [records, setRecords] = React.useState([]);
  const [hasHeaderRow, setHasHeaderRow] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [error, setError] = React.useState(null);
  const [outputType, setOutputType] = React.useState("table");
  const [delimiter, setDelimiter] = React.useState("\t");
  const [barcodeType, setBarcodeType] = React.useState("qrcode");

  const [barcodeWidth, setBarcodeWidth] = React.useState(100);
  const [barcodeMargin, setBarcodeMargin] = React.useState(15);

  // this only handles delimiter change at the moment, only radio group used here
  const handleRadioChange = (e) => {
    if (e.target.name === "delimiter")
      setDelimiter(e.target.value === "tab" ? "\t" : ",");

    if (e.target.name === "outputType") setOutputType(e.target.value);

    if (e.target.name === "barcodeType") setBarcodeType(e.target.value);
  };

  // change html <title> to match state title, if it is not ""
  React.useEffect(() => {
    if (title !== "") document.title = title;

    // if it is "", set it back to default
    if (title === "") document.title = "TSV/CSV to Barcode Table Generator";
  }, [title]);

  return (
    <div className="container">
      <div className="screen-only content">
        <h1 className="title">TSV/CSV to Barcode Table Generator</h1>

        <div className="columns is-desktop">
          <div className="column">
            <h2>Input</h2>

            <p>
              Paste TSV or CSV contents to generate a table with a barcode added
              for the last column. Output is printer-friendly. Works with
              pasting in from a spreadsheet. Last column and barcode data will
              have whitespace padding trimmed. Lines starting with &quot;#&quot;
              are ignored.
            </p>

            <InputArea
              onUpdate={setRecords}
              onError={setError}
              delimiter={delimiter}
            />

            {error && <div className="notification is-danger">{error}</div>}
          </div>
          <div className="column">
            <h2>Options</h2>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={hasHeaderRow}
                onChange={(e) => setHasHeaderRow(e.target.checked)}
              />
              &nbsp;Contains header row
            </label>

            <div className="control">
              Output type:&nbsp;
              <label className="radio">
                <input
                  type="radio"
                  name="outputType"
                  value="table"
                  checked={outputType === "table"}
                  onChange={handleRadioChange}
                />
                &nbsp;Table
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="outputType"
                  value="inline"
                  checked={outputType === "inline"}
                  onChange={handleRadioChange}
                />
                &nbsp;Grid
              </label>
            </div>

            <div className="control">
              Delimiter:&nbsp;
              <label className="radio">
                <input
                  type="radio"
                  name="delimiter"
                  value="tab"
                  checked={delimiter === "\t"}
                  onChange={handleRadioChange}
                />
                &nbsp;Tab
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="delimiter"
                  value="comma"
                  checked={delimiter === ","}
                  onChange={handleRadioChange}
                />
                &nbsp;Comma
              </label>
            </div>

            <div className="columns">
              <div className="column">
                <div className="control">
                  <div>
                    Barcode width (px):
                    <input
                      className="input"
                      type="number"
                      placeholder="Barcode width (px)"
                      value={barcodeWidth}
                      onChange={(e) =>
                        setBarcodeWidth(parseInt(e.target.value), 10)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="column">
                <div className="control">
                  <div>
                    Barcode margin (px):
                    <input
                      className="input"
                      type="number"
                      placeholder="Barcode margin (px)"
                      value={barcodeMargin}
                      onChange={(e) =>
                        setBarcodeMargin(parseInt(e.target.value), 10)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              Title (optional):
              <input
                className="input"
                type="text"
                placeholder="Set output title (optional)..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
        </div>

        <h2>Output</h2>
      </div>

      {title !== "" && <h2 className="title">{title}</h2>}

      {outputType === "table" && (
        <OutputTable
          records={records}
          hasHeaderRow={hasHeaderRow}
          barcodeType={barcodeType}
          barcodeWidth={barcodeWidth}
          barcodeMargin={barcodeMargin}
        />
      )}

      {outputType === "inline" && (
        <OutputInline
          records={records}
          hasHeaderRow={hasHeaderRow}
          barcodeType={barcodeType}
          barcodeWidth={barcodeWidth}
          barcodeMargin={barcodeMargin}
        />
      )}

      <footer className="screen-only">
        <a href="https://github.com/andygock/table-barcode-generator/">
          GitHub
        </a>
      </footer>
    </div>
  );
};

export default App;
