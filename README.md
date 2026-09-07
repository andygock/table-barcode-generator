# Table Barcode Generator

Paste TSV or CSV contents to generate a table with a barcode added
for the last column. Output is printer-friendly. Works with
pasting in from a spreadsheet. Last column and barcode data will
have whitespace padding trimmed.

[Live web site](https://barcode.gock.net/) hosted on Cloudflare Pages.

This was developed using pnpm and the commands below require pnpm. Do not use npm or yarn for project scripts because they can change dependency resolution.

Install [pnpm](https://pnpm.io/) using the method recommended for your environment.

Use pnpm 11.1.1 and Node.js 22.22.2+, 24.15.0+, or 26+ (supported
versions are declared in `package.json`). Dependency selection retains a
seven-day minimum release age. `pnpm-workspace.yaml` pins verified older
releases where registry metadata has omitted publication times. Do not disable
release-age checks when updating dependencies.

Install dependencies

    pnpm install

Start development server

    pnpm dev

Build for production into `dist/`

    pnpm build

## Input and printing

- Choose Tab for pasted spreadsheets or Comma for CSV. All records must have
  the same column count as the header, or the first data row without a header.
- Enable **Contains header row** to exclude the first record from QR generation.
  Empty lines and lines beginning with `#` are ignored; quoted multiline fields
  and escaped quotes are supported. Errors identify physical input lines.
- The last cell is trimmed for both display and encoding. Invalid CSV, missing
  values and generation errors must be corrected before output can be printed.
- Input is limited to 250,000 UTF-16 code units (the textarea's JavaScript string
  length), 500 data rows, 50 columns and 2,000 UTF-8 bytes per barcode payload.
  The payload limit is deliberately conservative; it is not a claim about every
  QR encoding mode's maximum capacity.
- Barcode width is 15–100 mm, including an embedded four-module quiet zone.
  Layout spacing is 0–20 mm. Both layouts use SVG images for sharp printing.
  Dense codes require a larger width to maintain the application's minimum
  module size of 0.25 mm. Actual scanner and printer performance still varies.
- The dedicated print button and readiness text are currently hidden. The
  browser's print command still hides pending or invalid output. Print at **100%
  scale** to preserve dimensions; use landscape paper or the grid layout for
  wide data. Rows/cards are kept together where they fit on a page.

Parsing is debounced and QR generation yields between rows. Editing input or
encoding settings cancels obsolete work and immediately removes stale output.
All parsing and generation happen locally in the browser.

## Development checks

    pnpm test
    pnpm lint
    pnpm build
    pnpm audit

Tests cover parsing, input limits, quiet zones, per-line failures, cancellation,
stale-result handling and print readiness. Component tests use a simulated DOM;
they do not launch a browser or validate physical scanning/pagination.

Run `pnpm format` to format the source and tests. The active ESLint configuration
is `eslint.config.cjs`; the obsolete legacy configuration has been removed.

The data flow is `InputArea` → `useQRCodes` → `parseInput` / `generateBarcodes` →
`PrintableOutput`. Output layouts share `BarcodeImage`, while `PrintableOutput`
owns image readiness and printing. Tests use `tsx` for JSX; pnpm permits only
esbuild's required binary setup script through the checked-in build allowlist.
