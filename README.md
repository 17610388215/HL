# Everyday Tools

A production-ready, privacy-focused utility site built with Next.js App Router, React, TypeScript, and Tailwind CSS.

## Included tools

The first release contains 20 working tools across five categories:

- **PDF:** merge, split, rotate, and JPG to PDF
- **Images:** compress, resize, JPG to PNG, and PNG to JPG
- **Calculators:** percentage, loan, compound interest, and GPA
- **Text:** word counter, character counter, case converter, and text compare
- **Converters:** length, weight, temperature, and speed

PDF and image processing runs in the browser. No database, account, or paid API is required.

The architecture also includes future category pages for developer, AI, video, and audio tools.

## Local development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Verification

```bash
pnpm typecheck
pnpm test
pnpm build
```

The production build uses Next.js static export and writes the deployable site to `out/`.

## Architecture

- `app/` — routes, metadata, sitemap, robots, and page templates
- `components/` — reusable navigation, search, cards, and interactive tools
- `lib/tools.ts` — category and tool registry used to generate pages and internal links
- `lib/calculations.ts` — tested calculator formulas
- `lib/conversions.ts` — unit conversion reference factors
- `.openai/hosting.json` — private Sites deployment configuration

