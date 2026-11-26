# Found bugs

Defects found in https://www.saucedemo.com while writing and running the UI tests.
Format and rules: `CLAUDE.md`, section *Defects*.

| ID | Title | Severity | Priority | Test |
|---|---|---|---|---|
| [BUG-01](#bug-01) | No error on "Checkout: Your Information" page after "Continue" with only spaces | Minor | Medium | UI-11 |
| [BUG-02](#bug-02) | Wrong cart name "Cart, 1 items" in the header when the cart has one product | Trivial | Low | UI-12 |
| [BUG-03](#bug-03) | HTTP 404 returned for /inventory.html and other app pages on load or reload | Minor | Low | — |
| [BUG-04](#bug-04) | No heading for the page title on Products, Your Cart and checkout pages | Minor | Low | — |
| [BUG-05](#bug-05) | "Permissions policy violation" error in the console on every page load | Trivial | Low | — |

---

## BUG-01

**Title:** No error on "Checkout: Your Information" page after "Continue" with only spaces

| Field | Value |
|---|---|
| Severity | Minor |
| Priority | Medium |
| Environment | https://www.saucedemo.com; Chromium 158.0.8127.37 (Playwright 1.65.1); macOS 27.2; 2026-11-26 |
| Preconditions | Logged in as `standard_user`; one product in the cart |
| Reproducibility | Always |
| Evidence | Test `UI-11 user cannot continue checkout with fields of spaces only` (`tests/ui/checkout.spec.ts`); trace: `npx playwright test -g UI-11 --trace on` |

**Steps to reproduce**
1. Click the cart button in the header.
2. Click **Checkout**.
3. Type `   ` (three spaces) in **First Name**, **Last Name**, and **Zip/Postal Code**.
4. Click **Continue**.

**Expected result**
The page stays on `/checkout-step-one.html` and shows `Error: First Name is required`.
Source: the site's own rule for this form: an empty First Name shows this error (UI-09);
a value of spaces only contains no name.

**Actual result**
The site opens `/checkout-step-two.html` ("Checkout: Overview"). No error is shown.

---

## BUG-02

**Title:** Wrong cart name "Cart, 1 items" in the header when the cart has one product

| Field | Value |
|---|---|
| Severity | Trivial |
| Priority | Low |
| Environment | https://www.saucedemo.com; Chromium 158.0.8127.37 (Playwright 1.65.1); macOS 27.2; 2026-11-26 |
| Preconditions | Logged in as `standard_user`; the cart is empty |
| Reproducibility | Always |
| Evidence | Test `UI-12 cart button is announced as "Cart, 1 item" with one product` (`tests/ui/cart.spec.ts`); trace: `npx playwright test -g UI-12 --trace on` |

**Steps to reproduce**
1. On the Products page, click **Add to cart** for one product.
2. Read the accessible name of the cart button in the header (screen reader, or the
   `aria-label` of `[data-test="shopping-cart-link"]`).

**Expected result**
`Cart, 1 item`.
Source: English grammar, and the site's own pattern for the other states: `Cart, empty`,
`Cart, 2 items`.

**Actual result**
`Cart, 1 items`.

---

## BUG-03

**Title:** HTTP 404 returned for /inventory.html and other app pages on load or reload

| Field | Value |
|---|---|
| Severity | Minor |
| Priority | Low |
| Environment | https://www.saucedemo.com; Chromium 158.0.8127.37 (Playwright 1.65.1); macOS 27.2; 2026-11-26 |
| Reproducibility | Always |
| Evidence | playwright-cli: `page.goto()` response status for each path (see Actual result) |

**Steps to reproduce**
1. Log in as `standard_user`.
2. Reload the Products page (`/inventory.html`), or open it directly in a new tab.
3. Read the HTTP status of the document response (DevTools → Network).

**Expected result**
HTTP 200 for every page the app serves.
Source: RFC 9110, section 15.5.5: 404 means the server did not find the target resource.

**Actual result**
The page renders and works, but the document response is 404:

| Path | Status |
|---|---|
| `/` | 200 |
| `/inventory.html` | 404 |
| `/cart.html` | 404 |
| `/checkout-step-one.html` | 404 |
| `/checkout-step-two.html` | 404 |
| `/checkout-complete.html` | 404 |

The result is the same logged in and logged out.

---

## BUG-04

**Title:** No heading for the page title on Products, Your Cart and checkout pages

| Field | Value |
|---|---|
| Severity | Minor |
| Priority | Low |
| Environment | https://www.saucedemo.com; Chromium 158.0.8127.37 (Playwright 1.65.1); macOS 27.2; 2026-11-26 |
| Preconditions | Logged in as `standard_user` |
| Reproducibility | Always |
| Evidence | playwright-cli: the accessibility snapshot of `/inventory.html` has no heading; the title is `<span class="title" data-test="title">Products</span>` |

**Steps to reproduce**
1. Open the Products page.
2. List the headings of the page (screen reader heading navigation, or the
   accessibility tree in DevTools).
3. Repeat on Your Cart, Checkout: Your Information, and Checkout: Overview.

**Expected result**
The visible page title (`Products`, `Your Cart`, `Checkout: Your Information`,
`Checkout: Overview`) is a heading.
Source: WCAG 2.2, success criterion 1.3.1 *Info and Relationships*: structure shown
visually is also available to assistive technology.

**Actual result**
These pages have no heading at all. The title is a `<span>`. Only the order confirmation
page has a heading (`Thank you for your order!`).

---

## BUG-05

**Title:** "Permissions policy violation" error in the console on every page load

| Field | Value |
|---|---|
| Severity | Trivial |
| Priority | Low |
| Environment | https://www.saucedemo.com; Chromium 158.0.8127.37 (Playwright 1.65.1); macOS 27.2; 2026-11-26 |
| Reproducibility | Always |
| Evidence | playwright-cli `console` output |

**Steps to reproduce**
1. Open https://www.saucedemo.com/ with DevTools → Console open.
2. Log in as `standard_user`.
3. Reload `/inventory.html`.

**Expected result**
No errors in the console during normal use.
Source: no requirement in the assignment; a general quality expectation for a page
without failures.

**Actual result**
Each page load logs one error:
`Permissions policy violation: unload is not allowed in this document.`
from `https://www.saucedemo.com/assets/index-DnLqFcJI.js:3`.
The page works; the user sees no effect.
