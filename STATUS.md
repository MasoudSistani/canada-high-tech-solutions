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

## 3D services release
- Implementation commit: `8b3d35603dddef4dcda0af85bfe27f386f945b06`.
- Added 3D design, 3D printing and custom gift design, a matching inquiry choice, physical-project guidance and metadata. Examples are proposed project directions, not past work. Materials, dimensions, quantity, feasibility and timing are agreed per quote.
- Existing untracked `tests/physical-services.test.mjs` was preserved and included. Its initial failure (4 services versus expected 5) was verified before implementation.
- `npm test`: 5 passed, 0 failed. Static build passed. Both browser suites passed locally and on production, with zero detected JS errors, overflow or axe violations.
- Every service inquiry is checked against the exact native-decoded mail subject/body, including CRLF, reserved characters, Unicode and literal plus signs. No email was sent.
- Additional real mobile touch checks passed at 375x667 and 390x844. Open 3D service screenshot: `evidence/3d-390.png`.
- Deployment: `dpl_6ZTT6oAAdqmRmSu6TPMNNDpSZAuq`, Ready, production alias verified. Immutable URL: https://canada-high-tech-solutions-4u3xj75nk-masouds-projects-320aa013.vercel.app
- Live HTML HTTP 200, 13371 bytes, SHA-256 `b928152c9de761506a7eaba39e3ebe37da12f38593397ddf3b6ebdcb812203d5`. All 9 assets checked by `scripts/verify-production.mjs` match source bytes.
- GitHub Actions run `38734084613`: success. Remote implementation SHA read back and matched local.

## Limitations
Email drafting requires a configured email client. Automated accessibility scans do not replace a human assistive-technology audit. No custom domain changes, ads, billing or other projects touched.
