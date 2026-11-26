# CLAUDE.md

Instructions for the AI agent that writes the tests in this repository.


## Stack
- Playwright + TypeScript, `@playwright/test` runner, Node 24 (`.nvmrc`).
- ES modules only: `import`/`export`. `require()` is forbidden.
- Playwright runs TypeScript but does not check types: run `npx tsc --noEmit` before
  handing a change over.
- Give Page Objects, API clients, and test data explicit types. No `any`.
- Erasable TypeScript only (`erasableSyntaxOnly`): declare fields and assign them in the
  constructor. No parameter properties, no enums. Relative imports name their `.ts` file.


## Systems under test
- UI: https://www.saucedemo.com, user `standard_user` only. Other demo users are out of
  scope.
- API: https://restful-booker.herokuapp.com, documented at
  https://restful-booker.herokuapp.com/apidoc.
- Both are public demo systems shared with everyone. Never send real personal data.
- The expected result comes from the assignment and the API documentation, never from
  what the system happens to do.


## Project structure
- `tests/ui/` — UI specs (`*.spec.ts`), Playwright project `ui`
- `tests/api/` — API specs (`*.spec.ts`), Playwright project `api`
- `pages/` — Page Object classes
- `pages/components/` — parts shared by several pages (header, menu)
- `api/` — API clients
- `test-data/` — test data and the texts asserted on

Create a folder together with its first file, never empty in advance.


## Test writing rules
- Locator priority: `getByRole` > `getByLabel` > `getByPlaceholder` > `getByText` >
  `getByTestId`. Sauce Demo marks elements with `data-test`; `testIdAttribute` is set to
  it in `playwright.config.ts`. XPath is forbidden.
- No `page.waitForTimeout()`. Web-first assertions only:
  `await expect(locator).toBeVisible()`.
- No conditional logic in tests: no `if`/`else`, no loops over assertions, no
  `try`/`catch`.
- Every test is independent. No state is shared between tests.
- Test data lives in `test-data/`, never inline in a spec: the values typed in and the
  texts asserted on.
- Values that must be unique (booking names) are built by a function in `test-data/` with
  a short suffix unique to each execution (8 random hex characters from `node:crypto`).
- Test titles start with the case ID, then describe business behavior:
  `test('UI-08 user cannot log in with an invalid password', …)`.
  IDs: `UI-NN` for UI, `API-NN` for API. The README lists every ID.
- Tags: `@ui` or `@api`; `@smoke` for the main path; `@negative` for negative and edge
  cases. Example: `{ tag: ['@ui', '@negative'] }`.


## Page Objects
- Specs contain no locators and no page actions: no `page.locator()`, `page.getBy…()`,
  `page.click()`, `page.fill()`, `page.goto()`. Assertions on the page itself
  (`expect(page).toHaveURL(…)`) stay allowed.
- One Page Object per page, in `pages/`, named by the page's English label
  (`pages/LoginPage.ts`, class `LoginPage`). A part several pages share is its own class
  in `pages/components/`. Never one class for a whole flow.
- Locators are `readonly` fields of type `Locator`, so specs can assert on them.
- Methods are named by business intent: `logIn(username, password)`, not
  `clickLoginButton()`. Actions that serve one purpose are one method. Values come in as
  arguments. Methods declare their return type (`Promise<void>`).
- No `expect` in Page Objects. Assertions stay in the spec.
- A page's relative path lives in its Page Object and is opened with `goto()`.
- A spec imports Page Objects at the top of the file and creates each one inside the
  test: `const loginPage = new LoginPage(page);`. No Page Object fixtures.
- Before changing a Page Object, read it in full and extend it. Never recreate it or
  rename what is already there.


## API client
- `api/BookingApi.ts` wraps Playwright's `APIRequestContext` (the `request` fixture).
  One method per endpoint, named by intent: `createBooking(booking)`.
- Methods return the `APIResponse`. The spec asserts on the status and the body.
- Request and response bodies have explicit types in `test-data/` or `api/`.
- Each test creates the booking it changes. Never depend on bookings someone else made.


## Browser access
- Look up anything about the running site with playwright-cli, never from memory:
  locators, the texts and values asserted on, the state after an action.
- Run it as `npx playwright cli <command>`. Its skill is
  `node_modules/playwright-core/lib/tools/skills/playwright-cli/SKILL.md`.
- A locator from `npx playwright codegen` is rewritten to the locator priority, never
  copied as it is.


## Defects
- When the system differs from the expected result, do not change the test to match it.
  The test stays failing and CI stays red. The README lists the bug and the failing test.
- Before writing a bug report:
  - reproduce the bug by hand or with playwright-cli;
  - make sure it is a bug of the system, not of the test;
  - check that the bug is not reported already.
- One report describes one bug. Write facts only, no guesses about the cause.

### Title: What? Where? When?
- **What** is wrong and how it shows; **Where**: the page, element, or endpoint;
  **When**: the condition that triggers it. In this order.
- No "When" means the bug always reproduces.
- Short (up to 80 characters). The title does not propose a fix.
- Example: `Booking is still returned by GET /booking/{id} after a successful DELETE`.

### Fields
| Field | Content |
|---|---|
| ID | `BUG-01`, `BUG-02` … |
| Title | What? Where? When? |
| Severity | Critical / Major / Minor / Trivial: the impact on the user |
| Priority | High / Medium / Low: how soon it should be fixed |
| Environment | URL, browser and version, OS, Playwright version, date |
| Preconditions | user, data, and state before the steps |
| Steps to reproduce | numbered, minimal |
| Expected result | what should happen, and its source: the assignment or the API doc section |
| Actual result | what happened, facts only |
| Reproducibility | Always, or N of M attempts |
| Evidence | test ID and title, trace, API request and response |


## Restrictions
- Do not add npm dependencies without an explicit request.
- Do not modify `playwright.config.ts` without an explicit request.
- Never weaken an assertion, increase a timeout, add retries, `test.skip`, `test.fixme`,
  `test.fail`, or `try`/`catch` to get a green run.
- If you cannot tell whether a failure is a test bug or a system bug, say so and show
  the trace.


## Workflow
- Every step goes on its own branch from `main`. Never commit on `main`.
- Before each step, send the user a short plan in ASD-STE100 style. Start only after the
  user approves it.
- Do not commit until the user has reviewed the change and says so. Approval to commit
  covers the push and a pull request to `main`; the user merges it.
- Do not watch CI. Say it started; the user checks it.


## Communication
- Reply to the user in ASD-STE100 style: short numbered sentences, active voice, one
  action per sentence.
- Code, comments, commit messages, and documents are in English.


## Definition of done
- `npx tsc --noEmit` passes.
- The affected tests ran, and the actual result is reported.
- A failing test is a valid outcome when the system has a bug: report the bug.


## Commands
- Install browsers: `npx playwright install chromium`
- All tests: `npx playwright test`
- UI only / API only: `npm run test:ui` / `npm run test:api`
- By tag: `npx playwright test --grep @smoke`
- Check types: `npx tsc --noEmit`
- Report: `npx playwright show-report`
- Trace: `npx playwright show-trace test-results/<dir>/trace.zip`
