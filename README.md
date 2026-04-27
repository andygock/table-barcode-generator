# Table Barcode Generator

Paste TSV or CSV contents to generate a table with a barcode added
for the last column. Output is printer-friendly. Works with
pasting in from a spreadsheet. Last column and barcode data will
have whitespace padding trimmed.

[Live web site](https://barcode.gock.net/)

This was developed using pnpm and the commands below are based on that. You can use standard `npm` commands if you prefer.

Install [pnpm](https://pnpm.io/)

    npm install -g pnpm

Install dependencies

    pnpm install

Start development server

    pnpm dev

    pnpm start

Build for production into `dist/`

    pnpm build

If required, use the following Netlify build command

    pnpm build || ( npm install pnpm && pnpm build )
