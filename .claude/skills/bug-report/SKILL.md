---
name: bug-report
description: Write a bug report in BUGS.md. Use it whenever the system under test (Sauce Demo UI or Restful Booker API) differs from the expected result: a test fails on a system defect, or a defect is seen while exploring with playwright-cli. Not for bugs in tests or in tools.
---

# Bug report

Write one report in `BUGS.md` for one defect of the system under test.
Bugs in our own tests, or in tools (Playwright, agents), do not go to `BUGS.md`.

## 1. Before writing

1. Reproduce the bug by hand or with playwright-cli. A bug you saw once and cannot
   reproduce is not reported; mention it to the user instead.
2. Make sure it is a defect of the system, not of the test: the locator, data, and
   expected value are right, and the system behaves differently.
3. Open `BUGS.md` and check that the bug is not reported already.
4. Do not change the test to match the system. A failing test stays red.

## 2. Title: What? Where? When?

- **What** is wrong and how it shows.
- **Where**: name the kind of place: page, modal, card, header, field, button, console,
  endpoint. Use the exact name from the interface:
  `on the "Checkout: Your Information" page`, `in the header`, `for POST /booking`.
- **When**: the condition or action that triggers it. No "When" means it always
  happens.
- In this order: What, Where, When.
- Up to 80 characters. Facts only. No proposed fix, no guess about the cause.

| | Title |
|---|---|
| Good | `No error on "Checkout: Your Information" page after "Continue" with only spaces` |
| Bad | `Checkout validation is broken` (no Where, no When) |
| Bad | `Trim the input before validating` (a fix, not a defect) |

## 3. Fields

Every report has these fields. Preconditions is the only optional one.

| Field | How to fill it |
|---|---|
| ID | The next free number: `BUG-01`, `BUG-02` … |
| Title | Section 2 |
| Severity | Section 4 |
| Priority | Section 4 |
| Environment | Section 5 |
| Preconditions | User, data, and state before step 1: `Logged in as standard_user; one product in the cart`. If there are none, leave the row out: no `None`, no notes |
| Steps to reproduce | Numbered, minimal, one action per step. Interface labels in **bold**, typed values in `code` |
| Expected result | What should happen, then `Source:` the assignment, the API documentation section, the site's own behavior elsewhere, or a standard (RFC, WCAG). If there is no source, write `Source: no requirement` and why it is still expected |
| Actual result | What happened: exact texts, URLs, status codes. Facts only |
| Reproducibility | `Always` or `Sometimes`. Nothing else |
| Evidence | Test ID and title and its file, or the playwright-cli check; for the API, the request and the response |

## 4. Severity and Priority

Severity is the impact on the user. Priority is how soon to fix it.

| Severity | Meaning |
|---|---|
| Critical | A main flow is blocked with no workaround (cannot log in, cannot pay), data loss, security |
| Major | A main flow or key function gives a wrong result; a workaround exists |
| Minor | A secondary function, validation, or accessibility issue; the user can still finish the task |
| Trivial | Cosmetic or text issue with no effect on the task |

| Priority | Meaning |
|---|---|
| High | Fix before the next release |
| Medium | Fix in the normal course of work |
| Low | Fix when convenient |

Propose the values; the user decides.

## 5. Environment

One line: `<URL>; <browser> <version> (Playwright <version>); <OS> <version>; <date>`.
For an API bug, leave out the browser.

```bash
npx playwright --version
sw_vers -productVersion
date +%F
# browser version, with a playwright-cli session open:
npx playwright cli --raw run-code "async page => page.context().browser().version()"
```

## 6. Where to write it

In `BUGS.md`:
1. Add a row to the table at the top: ID (linked to its section), Title, Severity,
   Priority, Test (or `—`).
2. Add a section at the end, in the format of the example below.

## Example

```markdown
## BUG-01

**Title:** No error on "Checkout: Your Information" page after "Continue" with only spaces

| Field | Value |
|---|---|
| Severity | Minor |
| Priority | Medium |
| Environment | https://www.saucedemo.com; Chromium 158.0.8127.37 (Playwright 1.65.1); macOS 27.2; 2026-11-26 |
| Preconditions | Logged in as `standard_user`; one product in the cart |
| Reproducibility | Always |
| Evidence | Test `UI-11 user cannot continue checkout with fields of spaces only` (`tests/ui/checkout.spec.ts`) |

**Steps to reproduce**
1. Click the cart button in the header.
2. Click **Checkout**.
3. Type `   ` (three spaces) in **First Name**, **Last Name**, and **Zip/Postal Code**.
4. Click **Continue**.

**Expected result**
The page stays on `/checkout-step-one.html` and shows `Error: First Name is required`.
Source: the site's own rule for this form: an empty First Name shows this error.

**Actual result**
The site opens `/checkout-step-two.html` ("Checkout: Overview"). No error is shown.
```
