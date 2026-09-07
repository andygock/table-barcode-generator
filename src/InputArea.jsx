import React from "react";

// The example remains editable; changing it immediately invalidates printable output.
export const defaultContent = `1\tdry flyer rule
2\tcome rebel wrist
3\tlion duct cone`;

const InputArea = ({ value, onChange, invalid }) => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current.focus();
  }, []);
  return (
    <>
      <label htmlFor="source-input">TSV or CSV contents</label>
      <textarea
        id="source-input"
        ref={ref}
        className="textarea is-family-monospace"
        aria-describedby="input-help output-status"
        aria-invalid={invalid}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </>
  );
};
export default InputArea;
