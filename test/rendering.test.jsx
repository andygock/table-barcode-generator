import test from "node:test";
import assert from "node:assert/strict";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";
import useQRCodes from "../src/useQRCodes.js";
import PrintableOutput from "../src/PrintableOutput.jsx";

// DOM component tests exercise lifecycle and events without launching a browser.
const dom = new JSDOM('<!doctype html><div id="root"></div>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { window } = dom;
const { document } = window;
const container = document.getElementById("root");
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test("generation hides stale results immediately and recovers from input errors", async () => {
  const root = createRoot(container);
  let latest;
  function Harness({ input, header = false, delimiter = "," }) {
    latest = useQRCodes(input, delimiter, header, 30);
    return null;
  }
  try {
    await act(async () => root.render(<Harness input="Alice,A-001" />));
    await act(async () => {
      await pause(350);
    });
    assert.equal(latest.pending, false);
    assert.equal(latest.barcodes.length, 1);
    const oldBarcode = latest.barcodes[0];

    await act(async () =>
      root.render(<Harness input={'Name,Code\nAlice,"broken'} header />),
    );
    assert.equal(latest.pending, true);
    assert.deepEqual(latest.barcodes, []);
    await act(async () => {
      await pause(350);
    });
    assert.match(latest.errors[0], /unterminated/);

    await act(async () =>
      root.render(
        <Harness input={"Name\tCode\nBob\tB-002"} delimiter={"\t"} header />,
      ),
    );
    await act(async () => {
      await pause(350);
    });
    assert.deepEqual(latest.errors, []);
    assert.equal(latest.rows.length, 1);
    assert.deepEqual(latest.header.cells, ["Name", "Code"]);
    assert.notEqual(latest.barcodes[0], oldBarcode);
  } finally {
    await act(async () => root.unmount());
  }
});

test("both layouts hide print controls and expose output only when images are ready", async () => {
  const result = {
    rows: [
      { cells: ["Alice", "A-001"], line: 3 },
      { cells: ["Bob", "B-002"], line: 4 },
    ],
    header: { cells: ["Name", "Code"], line: 2 },
    barcodes: ["data:image/svg+xml,test1", "data:image/svg+xml,test2"],
  };
  const root = createRoot(container);
  try {
    for (const outputType of ["table", "inline"]) {
      await act(async () =>
        root.render(
          <PrintableOutput
            key={outputType}
            result={result}
            title="Labels"
            outputType={outputType}
            barcodeWidth={30}
            barcodeMargin={4}
          />,
        ),
      );
      const images = [...container.querySelectorAll("img")];
      assert.equal(container.querySelector("button"), null);
      assert.doesNotMatch(
        container.textContent,
        /ready to print|loading barcode/i,
      );
      assert.ok(container.querySelector(".print-pending"));
      assert.ok(
        container
          .querySelector(".printable-output")
          .classList.contains(`printable-output--${outputType}`),
      );
      assert.ok(
        images.every(
          (img) => img.style.width === "30mm" && img.style.height === "30mm",
        ),
      );
      if (outputType === "table") {
        assert.equal(container.querySelectorAll("th").length, 3);
        assert.ok(
          [...container.querySelectorAll("td.data")].every(
            (cell) => cell.style.padding === "",
          ),
        );
      }
      await act(async () => images[0].dispatchEvent(new window.Event("load")));
      assert.ok(container.querySelector(".print-pending"));
      await act(async () => images[1].dispatchEvent(new window.Event("load")));
      assert.equal(container.querySelector(".print-pending"), null);
    }
    await act(async () =>
      container.querySelector("img").dispatchEvent(new window.Event("error")),
    );
    assert.ok(container.querySelector(".print-pending"));
  } finally {
    await act(async () => root.unmount());
  }
});
