# Project Memory: Planned Improvements for v0.5

This document captures the intent, rationale, and scoped set of improvements proposed for the v0.5 evolution of the site. It serves as a high-level design + implementation memory so future contributors understand WHY changes were made (or deferred).

## 1. Redirect & Architecture
- Replace meta refresh redirect in root `index.html` with progressive enhancement (prefer server 301; temporary JS fallback).
- Maintain clean language-specific directories (`/en`, `/pt`).

## 2. Accessibility (A11y)
- Add `:focus-visible` styles; ensure focus rings always meet WCAG AA contrast.
- Provide explicit accessible label / landmark wrapper for language switcher.
- Audit color palette (hover, active, focus states) for contrast (target ≥ 4.5:1 normal text).
- Remove duplicate dynamic skip-link creation (already in markup); keep single static instance.
- Verify heading hierarchy on all pages; add visually hidden headings where needed for screen reader grouping.

## 3. Performance & Core Web Vitals
- Critical CSS extraction (fold: header, nav, hero, root layout) inline; load remainder with `media="print" onload` pattern or `rel=preload` + swap.
- Purge unused CSS selectors (initial target: reduce >30% from ~900 lines).
- Self‑host hero/profile image; generate responsive `<picture>` sources (AVIF/WebP + fallback), include explicit `width`/`height` and `fetchpriority="high"`.
- Add lazy loading and decoding hints to non-critical images (e.g., publication logos if added later).
- Preconnect to required origins (ORCID maybe) only if requests on initial load exist; otherwise keep minimal.
- Add optional Lighthouse CI budget (performance >= 90, accessibility >= 95, best-practices >= 90, SEO >= 90).

## 4. SEO & Structured Data
- Remove obsolete `<meta name="keywords">` across pages.
- Expand JSON-LD: add `Organization` nodes (affiliations) and generate `ScholarlyArticle` entries for publications (subset or all parsed from markdown).
- Regenerate `sitemap.xml` automatically in workflow (ensure hreflang pairs present).
- Improve root `index.html` (redirect page) with proper canonical + hreflang even if fast redirect.

## 5. Internationalization (i18n)
- Externalize user-visible strings into JSON (e.g., `i18n/en.json`, `i18n/pt.json`) consumed by a lightweight loader for future locale expansion.
- Add active locale semantics (`aria-current="language"` or `aria-label="Selected language"`).
- Preserve crawlable static HTML (static-first, dynamic enhancement only for minor UI elements).

## 6. Design & Theming
- Introduce fluid typography using `clamp()` for headings & body.
- Provide a dark mode toggle (persist with `localStorage`), augmenting current `prefers-color-scheme` auto-mode.
- Normalize spacing scale; replace ad-hoc negative margins with layout wrappers.
- Harmonize card hover motions; respect `prefers-reduced-motion` fully (already partially done—remove subtle translations or gate them under reduced-motion).

## 7. CSS Architecture
- Split stylesheet into: `base.css`, `components.css`, `utilities.css`, build concatenated file (no framework overhead).
- Introduce a simple build script (optional) to purge & minify; produce hashed output (`styles.[hash].css`).
- Add `content-hash` comment in HTML for cache busting reference.

## 8. JavaScript Enhancements
- Convert to ES module (`<script type="module">`) and isolate features; export small functions for testability.
- Remove console logs in production build.
- Add Web Vitals collection (deferred) with beacon (optional privacy-friendly analytics flag).
- Avoid injecting duplicate elements (skip link) when already present.

## 9. Publications Pipeline
- Parse markdown publications into structured JSON during workflow (fields: title, authors, year, doi/url).
- Generate JSON-LD `ScholarlyArticle` list dynamically (limit maybe first 25 for size) and embed.
- Only commit updated publications when diff exists (avoid noisy commits).

## 10. Automation & CI/CD
- Extend existing `site-validation.yml`:
  - Run HTMLProofer / link checker.
  - Run Lighthouse CI (using headless Chrome) with budgets.
  - Run CSS size threshold check (fail if > X KB after gzip) to prevent regressions.
- Add optional accessibility audit (axe) on a subset of pages.

## 11. Security & Headers
- Draft Content Security Policy (document in README; true enforcement requires server/CDN configuration):
  - `default-src 'self'; img-src 'self' https: data:; script-src 'self'; style-src 'self' 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; upgrade-insecure-requests;`
- Add `Permissions-Policy` suggestion: `geolocation=(), camera=(), microphone=()`.
- Provide `/security.txt` (future task) & `/robots.txt` already minimized.

## 12. Analytics (Optional / Deferred)
- Evaluate privacy-friendly analytics (Plausible/Umami) loaded via async script behind a consent or simple notice.

## 13. Resilience & PWA (Deferred)
- Consider a Service Worker (Workbox) for offline caching of core pages & fallback shell.
- Custom 404 with links to language home pages.

## 14. Documentation
- Update `README.md` with architecture overview, i18n model, performance budget, and workflow steps.
- Add `CONTRIBUTING.md` (code style, accessibility checklist, testing instructions).
- Maintain this `memory.md` as a living document (append sections when rationale evolves; do not duplicate CHANGELOG).

## 15. Versioning & Traceability
- Footer build hash injection via workflow environment variable.
- Weekly automated release tag if changes present (semantic: `feat`, `fix`, `docs`, etc.).

## 16. Prioritized Execution Order
1. Redirect fix + a11y + CSS purge groundwork.
2. Image optimization + critical CSS inline.
3. Publications JSON-LD + sitemap automation.
4. CI enhancements (Lighthouse, link checker, axe).
5. Modular CSS & JS refactor.
6. Dark mode toggle + fluid typography.
7. i18n externalization.
8. Security header documentation + analytics optional.

## 17. Success Metrics / Acceptance Criteria
- Performance (Lighthouse): Perf >= 90, A11y >= 95, SEO >= 90, Best Practices >= 90.
- CSS main bundle (post-purge, minified) <= 25KB (gzip) initial target.
- Cumulative Layout Shift < 0.05; LCP < 2.5s on fast 3G emulation.
- Zero detectable WCAG AA contrast violations (axe scan baseline pages EN/PT home, publications, about).
- No broken internal links (link checker pass).

## 18. Deferred / Future Considerations
- Add search (client-side lunr.js or elasticlunr) for publications & content.
- Add microdata for events or talks if added later.
- Structured data for `MedicalOrganization` roles if publicly appropriate.

---
Document created on 2025-08-26 for branch v0.5.
