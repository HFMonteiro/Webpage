# Local motion preview

Status: review-only prototype on `codex/light-motion-preview`. No merge, push or deployment authorised for this preview.

## Intent

Refine the existing motion without changing the clean visual design, copy, bilingual routes or themes. Hugo requested a local version to inspect before any merge, with bounded implementation delegated to smaller models.

## Approach

Use existing CSS and vanilla JavaScript, no new dependencies. Prefer native cross-document View Transitions where supported, immediate native navigation elsewhere. Avoid click interception, navigation delays and whole-body transforms. Use short, finite reveals, restrained pointer hover, dialog entrance and a brief process-path highlight. Avoid duplicated nested animation and keep focus targets visible.

Alternatives: a motion library adds unnecessary weight; maintaining delayed JavaScript navigation complicates history and link behaviour. Both are excluded from this prototype.

## Guardrails and checks

- Main and production remain unchanged; preserve all pre-existing untracked files.
- No permanent hiding if motion or observer support is unavailable.
- Respect live `prefers-reduced-motion` changes, keyboard focus and native navigation.
- Run existing static/integration and browser smoke checks; inspect PT/EN, light/dark, mobile and dialogs locally.
- Keep browser evidence outside the repository. No physical-device claims.
- Production monitoring is read-only and must never publish this preview branch.

Keeping this prototype or merging it requires Hugo's review.

## Local validation

- `npm.cmd test`: static validation and 38 integration/model tests passed.
- `npx.cmd playwright test scripts/smoke_site.spec.js scripts/motion_preview.spec.js --reporter=line`: 22 tests passed against `SITE_BASE_URL=http://localhost:4173`.
- Six additional browser tests cover native navigation/back, dialog focus, live reduced-motion preference and observer failure in PT and EN.
- The existing server listens on localhost; the default 127.0.0.1 test URL was refused. The matching official Chromium headless binary was installed without changing project dependencies.
- Cache query versions updated on the 22 PT/EN pages and 404, with matching validator expectations, so existing browsers receive the preview assets.
- In-app browser checks confirmed projects, dialog opening/closing and focus restoration, PT/EN switching, dark theme persistence, mobile layout and process cohort controls. View Transitions progressively enhance supported browsers; other browsers keep immediate native navigation.

Implementation delegated to two GPT-6 Luna workers with non-overlapping file ownership; reviewed and verified by the coordinating agent.
