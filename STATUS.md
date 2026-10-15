# Status

Production: https://canada-high-tech-solutions.vercel.app
Repository: MasoudSistani/canada-high-tech-solutions
Local: `/root/projects/canada-high-tech-solutions`

## Company presentation correction
Removed all experimental projects, Snake links, interaction lab, preview modes, dot game and associated unused JavaScript/CSS. Retained brand typography/palette and replaced the hero widget with static brand geometry. No fictional portfolio or business credentials added. Normal navigation, disclosures, brief builder and direct contact remain.

## Verification
Run `npm test`, `npm run build`, `npm run test:browser`, and `node tests/extended-browser.mjs`. Evidence reports contain the tested URL, viewport results and screenshots. Production verification compares all public asset bytes against the commit, and records the GitHub deployment status.

Native mailto regression tests retain exact URI decoding, literal plus signs, Unicode/reserved characters, CRLF normalization and subject control sanitization. No email sent.

## Limitations
Email drafting requires a configured email client. Automated accessibility scans do not replace a human assistive-technology audit. No custom domain changes, ads, billing or other projects touched.
