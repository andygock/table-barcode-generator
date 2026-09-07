import test from "node:test";
import assert from "node:assert/strict";
import QRCode from "qrcode";
import { generateBarcodes } from "../src/generateBarcodes.js";

const row = (payload, line = 1) => ({ cells: ["Name", payload], line });

test("generates vector images with an embedded four-module quiet zone", async () => {
  const result = await generateBarcodes([row("A-001")], 30);
  assert.deepEqual(result.errors, []);
  const svg = decodeURIComponent(
    result.barcodes[0].split(",").slice(1).join(","),
  );
  const size =
    QRCode.create("A-001", { errorCorrectionLevel: "M" }).modules.size + 8;
  assert.ok(svg.includes(`viewBox="0 0 ${size} ${size}"`));
  assert.match(svg, /stroke="#000000"/);
});

test("reports a failing source line while collecting other row results", async () => {
  const result = await generateBarcodes(
    [row("A-001", 3), row("x".repeat(2400), 8), row("B-002", 10)],
    30,
  );
  assert.equal(result.barcodes.length, 3);
  assert.ok(result.barcodes[0]);
  assert.equal(result.barcodes[1], null);
  assert.ok(result.barcodes[2]);
  assert.match(result.errors[0], /^Line 8:/);
  assert.deepEqual((await generateBarcodes([row("fixed", 8)], 30)).errors, []);
});

test("gives actionable size guidance for dense codes", async () => {
  const result = await generateBarcodes([row("x".repeat(1000), 9)], 15);
  assert.match(
    result.errors[0],
    /Line 9: Increase barcode width to at least \d+ mm/,
  );
  assert.deepEqual(
    (await generateBarcodes([row("x".repeat(1000), 9)], 100)).errors,
    [],
  );
});

test("enforces generation bounds before invoking the encoder", async () => {
  const render = () => {
    throw new Error("encoder must not be called");
  };
  for (const width of [Infinity, 0, 101, 30.5]) {
    await assert.rejects(
      generateBarcodes([row("code")], width, () => false, render),
      /limits exceeded/,
    );
  }
  await assert.rejects(
    generateBarcodes(Array(501).fill(row("code")), 30),
    /limits exceeded/,
  );
});

test("yields and stops encoding when the batch is cancelled", async () => {
  let cancelled = false;
  let calls = 0;
  const result = await generateBarcodes(
    [row("first"), row("second")],
    30,
    () => cancelled,
    async (...args) => {
      calls++;
      cancelled = true;
      return QRCode.toString(...args);
    },
  );
  assert.equal(calls, 1);
  assert.equal(result, null);
});

test("arbitrary markup in a payload is encoded, not injected into the SVG", async () => {
  const result = await generateBarcodes(
    [row('<script>alert("test")</script>')],
    30,
  );
  assert.deepEqual(result.errors, []);
  const svg = decodeURIComponent(result.barcodes[0]);
  assert.doesNotMatch(svg, /<script|alert\(/);
});
