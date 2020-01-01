import React from "react";
import InputArea from "./InputArea";
import OutputTable from "./OutputTable";
import "./style.scss";

const App = () => {
  const [records, setRecords] = React.useState([]);
  const [hasHeaderRow, setHasHeaderRow] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [error, setError] = React.useState(null);
  const [barcodeWidth, setBarcodeWidth] = React.useState();
  const [delimiter, setDelimiter] = React.useState("\t");
  const [margin, setMargin] = React.useState(); // not used

  // this only handles delimiter change at the moment, only radio group used here
  const handleRadioChange = e => {
    setDelimiter(e.target.value === "tab" ? "\t" : ",");
  };

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
              have whitespace padding trimmed. Lines starting with "#" are
              ignored.
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
                onChange={e => setHasHeaderRow(e.target.checked)}
              />
              &nbsp;Contains header row
            </label>

            <div className="control">
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

            <div>
              Title (optional):
              <input
                className="input"
                type="text"
                placeholder="Set output title (optional)..."
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
          </div>
        </div>

        <h2>Output</h2>
      </div>

      {title !== "" && <h2 className="title">{title}</h2>}

      <OutputTable records={records} hasHeaderRow={hasHeaderRow} />

      <footer className="screen-only">
        &copy; <a href="https://gock.net/">Andy Gock</a> | source @
        <a href="https://github.com/andygock/table-barcode-generator/">
          GitHub
        </a>
      </footer>
    </div>
  );
};

export default App;
