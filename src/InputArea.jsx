import React from "react";
import Papa from "papaparse";

const defaultContent = `1\tdry flyer rule
2\tcome rebel wrist
3\tlion duct cone`;

const InputArea = ({ onUpdate, delimiter = "\t", onError = () => {} }) => {
  const [value, setValue] = React.useState(defaultContent);
  const ref = React.useRef();

  const parseInput = React.useCallback(
    async (data) => {
      Papa.parse(data, {
        delimiter: delimiter,
        skipEmptyLines: true,
        comments: "#",
        error: (error) => onError(error.message),
        complete: (results) => {
          onError(null);
          onUpdate(results.data);
        },
      });
    },
    [delimiter, onError, onUpdate],
  );

  React.useEffect(() => {
    parseInput(value);
  }, [value, parseInput]);

  React.useEffect(() => {
    ref.current.focus();
  }, []);

  const handleOnFocus = (e) => e.target.select();

  return (
    <textarea
      ref={ref}
      className="textarea is-family-monospace"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      onFocus={handleOnFocus}
      value={value}
    />
  );
};

export default InputArea;
