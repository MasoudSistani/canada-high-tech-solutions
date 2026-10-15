# Status

Production: https://canada-high-tech-solutions.vercel.app
Repository: MasoudSistani/canada-high-tech-solutions
Local: `/root/projects/canada-high-tech-solutions`

## Company presentation correction
Removed all experimental projects, Snake links, interaction lab, preview modes, dot game and associated unused JavaScript/CSS. Retained brand typography/palette and replaced the hero widget with static brand geometry. No fictional portfolio or business credentials added. Normal navigation, disclosures, brief builder and direct contact remain.

## Verification
Run `npm test`, `npm run build`, `npm run test:browser`, and `node tests/extended-browser.mjs`. Evidence reports contain the tested URL, viewport results and screenshots. Production verification compares all public asset bytes against the commit, and records the GitHub deployment status.

Native mailto regression tests retain exact URI decoding, literal plus signs, Unicode/reserved characters, CRLF normalization and subject control sanitization. No email sent.

## Verified correction release
- Implementation commit: `8d522e5ef83c4a6c3f19d4a29a8bc924e065efc8`.
- Four unit/source tests pass, including all three native mailto regressions. Build and both browser suites pass locally and on production.
- Core screenshots: `evidence/375.png`, `evidence/768.png`, `evidence/1440.png`. Desktop/mobile visually inspected. No experimental widgets or links remain.
- Production tested at 375, 650, 768, 1024 and 1440px. Zero detected JS errors, horizontal overflow or axe WCAG A/AA violations, including every open service disclosure. Brief validation, service-prefill, mobile menu, reduced motion and no-JavaScript email fallback pass.
- All 10 public assets return HTTP 200 and match local bytes exactly. Hashes and successful Vercel deployment record: `evidence/company-production.json`. Live browser results: `evidence/qa.json`, `evidence/extended-qa.json`.

## Limitations
Email drafting requires a configured email client. Automated accessibility scans do not replace a human assistive-technology audit. No custom domain changes, ads, billing or other projects touched.
