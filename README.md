# Table Barcode Generator

Paste TSV or CSV contents to generate a table with a barcode added
for the last column. Output is printer-friendly. Works with
pasting in from a spreadsheet. Last column and barcode data will
have whitespace padding trimmed.

[Live web site](https://barcode.gock.net/) hosted on Cloudflare Pages.

This was developed using pnpm and the commands below require pnpm. Do not use npm or yarn for project scripts because they can change dependency resolution.

Install [pnpm](https://pnpm.io/) using the method recommended for your environment.

Install dependencies

    pnpm install

Start development server

    pnpm dev

    pnpm start

Build for production into `dist/`

    pnpm build

If required, use the following Netlify build command

    pnpm build
