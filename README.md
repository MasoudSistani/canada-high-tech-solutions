# Canada High-tech Solutions

A mobile-first design and development services site. Off-white, ink and coral, deliberate editorial typography and a small hands-on interaction lab.

- Production: https://canada-high-tech-solutions.vercel.app
- Repository: https://github.com/MasoudSistani/canada-high-tech-solutions
- Contact: canadahightechsolutions@gmail.com

## Run

Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:4173. The production site has no runtime packages, framework or third-party scripts. DM Sans is self-hosted under its SIL Open Font License in `public/FONT-LICENSE.txt`.

## Build and verify

```sh
npm test
npx playwright install chromium
npm run test:browser
node tests/extended-browser.mjs
npm run build
```

Set `TEST_URL=https://canada-high-tech-solutions.vercel.app` to run browser suites against production. Screenshots and JSON reports are in `evidence/`.

`public/` contains semantic HTML, CSS, browser JavaScript, favicon, Open Graph image, font and crawler metadata. `scripts/build.mjs` copies only public assets into `dist/`. `vercel.json` sets the build, output and security headers.

## Contact behaviour

The brief builder creates a `mailto:` URL locally. It opens the visitor's email app with a draft. The visitor reviews and sends that email. There is no server submission, success claim, database, analytics, cookie banner or SMTP credential. Without JavaScript, the direct email link still works.

## Deploy

The new Vercel project is linked to this GitHub repository. Push to `main` for production. Alternatively, from this directory only:

```sh
vercel --prod
```

Project name: `canada-high-tech-solutions`. Scope: `masouds-projects-320aa013`. Do not copy the `.vercel` directory into other projects. No changes to the existing Snake project are required.

## Content boundaries

The lab previews are concept studies. The linked Snake app is an internal demo, not client work. The site makes no testimonial, client, revenue, pricing, team-size or historical claims.
