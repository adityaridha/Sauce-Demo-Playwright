# Sauce Demo — Playwright

End-to-end test suite for [saucedemo.com](https://www.saucedemo.com), built with
[Playwright](https://playwright.dev) using the Page Object Model. Tests run across
**Chromium, Firefox, and WebKit**.

## Project structure

```
tests/
├── *.spec.ts            # Test specs (login, inventory, product-detail, cart, checkout, e2e-full-flow)
├── pages/               # Page Object Model classes (one per page/component)
└── data/                # Shared test data and constants
playwright.config.ts     # Test runner config (browsers, retries, HTML + JSON reporters)
.github/workflows/       # CI: push/PR runs + manual on-demand run
```

## Running locally

```bash
npm ci                              # install dependencies
npx playwright install --with-deps  # install browsers (first time only)

npx playwright test                 # run all tests
npx playwright test login.spec.ts   # run a single spec
npx playwright show-report          # open the HTML report
```

## CI workflows

### `playwright.yml` — automatic
Runs the full suite on every push and pull request to `main`/`master`, and uploads
the HTML report as a build artifact.

### `manual-tests.yml` — manual (workflow_dispatch)
Run the suite on demand from the **Actions** tab, with the report published to
**GitHub Pages**.

**How to run:**
1. Go to the **Actions** tab → **Manual Playwright Run** → **Run workflow**.
2. Fill in the **`spec`** field:
   - **Leave it empty** → runs **all** tests.
   - **Enter a target** → runs just that. Accepts a file name (`login.spec.ts`), a
     path (`tests/cart.spec.ts`), or a filename filter.
3. Click **Run workflow**.

**What you get:**
- **Artifact** — `playwright-report/` is uploaded as the `playwright-report` artifact
  (30-day retention), even when tests fail. It contains both the browsable HTML report
  and the machine-readable `results.json`.
- **GitHub Pages** — the HTML report is published to the repo's Pages site. The live
  URL appears on the run's `github-pages` environment. Pages always serves the
  **latest** run's report (not a history).

> [!IMPORTANT]
> **One-time setup:** enable Pages under **Settings → Pages → Build and deployment →
> Source → GitHub Actions**. Without this, the deploy job fails with "Pages not
> enabled".

> [!NOTE]
> A single spec still runs across all three browsers (chromium, firefox, webkit), as
> configured in `playwright.config.ts`.
