# Found bugs

Defects found in https://www.saucedemo.com (UI) and https://restful-booker.herokuapp.com
(API) while writing and running the tests.
Format and rules: the `bug-report` skill (`.claude/skills/bug-report/SKILL.md`).

| ID | Title | Severity | Priority | Test |
|---|---|---|---|---|
| [BUG-01](#bug-01) | No error on "Checkout: Your Information" page after "Continue" with only spaces | Minor | Medium | UI-11 |
| [BUG-02](#bug-02) | Wrong cart name "Cart, 1 items" in the header when the cart has one product | Trivial | Low | UI-12 |
| [BUG-03](#bug-03) | HTTP 404 returned for /inventory.html and other app pages on load or reload | Minor | Low | — |
| [BUG-04](#bug-04) | No heading for the page title on Products, Your Cart and checkout pages | Minor | Low | — |
| [BUG-05](#bug-05) | "Permissions policy violation" error in the console on every page load | Trivial | Low | — |
| [BUG-06](#bug-06) | 200 OK instead of 401 for POST /auth with a wrong password | Minor | Medium | API-02 |
| [BUG-07](#bug-07) | 500 Internal Server Error for POST /booking without required fields | Minor | Medium | API-04 |
| [BUG-08](#bug-08) | 405 instead of 404 for DELETE /booking/{id} of a deleted booking | Trivial | Low | — |

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

---

## BUG-06

**Title:** 200 OK instead of 401 for POST /auth with a wrong password

| Field | Value |
|---|---|
| Severity | Minor |
| Priority | Medium |
| Environment | https://restful-booker.herokuapp.com; Playwright 1.65.1 and curl 8.7.1; macOS 27.2; 2026-11-26 |
| Reproducibility | Always |
| Evidence | Test `API-02 token is refused for a wrong password` (`tests/api/booking.spec.ts`); request and response below |

**Steps to reproduce**
1. Send `POST /auth` with header `Content-Type: application/json` and body
   `{"username": "<BOOKER_USERNAME>", "password": "wrong_password"}`.

**Expected result**
Status `401 Unauthorized`; the body has no token.
Source: RFC 9110, section 15.5.2: 401 means the request lacks valid authentication
credentials. The API documentation (Auth - CreateToken) describes only the 200 response.

**Actual result**
Status `200 OK`, body `{"reason":"Bad credentials"}`.

---

## BUG-07

**Title:** 500 Internal Server Error for POST /booking without required fields

| Field | Value |
|---|---|
| Severity | Minor |
| Priority | Medium |
| Environment | https://restful-booker.herokuapp.com; Playwright 1.65.1 and curl 8.7.1; macOS 27.2; 2026-11-26 |
| Reproducibility | Always |
| Evidence | Test `API-04 booking without required fields is rejected with 400` (`tests/api/booking.spec.ts`); request and response below |

**Steps to reproduce**
1. Send `POST /booking` with headers `Content-Type: application/json`,
   `Accept: application/json` and body `{"firstname": "Test"}`.

**Expected result**
Status `400 Bad Request`.
Source: RFC 9110, section 15.5.1: 400 is for a request the server will not process
because of a client error. The API documentation (Booking - CreateBooking) lists
`lastname`, `totalprice`, `depositpaid`, and `bookingdates` in the request body and does
not mark them optional (PartialUpdateBooking marks its fields optional).

**Actual result**
Status `500 Internal Server Error`, body `Internal Server Error`.

---

## BUG-08

**Title:** 405 instead of 404 for DELETE /booking/{id} of a deleted booking

| Field | Value |
|---|---|
| Severity | Trivial |
| Priority | Low |
| Environment | https://restful-booker.herokuapp.com; curl 8.7.1; macOS 27.2; 2026-11-26 |
| Preconditions | A valid token from `POST /auth`; a booking deleted with `DELETE /booking/{id}` (`201 Created`) |
| Reproducibility | Always |
| Evidence | Found while exploring the API with curl; no test. Requests and responses below |

**Steps to reproduce**
1. Send `DELETE /booking/{id}` for the deleted booking, with header `Cookie: token=<token>`.

**Expected result**
Status `404 Not Found`.
Source: RFC 9110, section 15.5.5: 404 means the server did not find the target
resource. The API itself answers `404 Not Found` to `GET /booking/{id}` for the same id.

**Actual result**
Status `405 Method Not Allowed`, body `Method Not Allowed`.
