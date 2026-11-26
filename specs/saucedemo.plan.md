# Sauce Demo UI Test Plan

## Application Overview

Plan for https://www.saucedemo.com, user standard_user only. The password is shown on the login page under "Password for all users:"; tests read the username and password from .env (SAUCE_USERNAME, SAUCE_PASSWORD). Each test starts from a fresh browser context (not logged in, empty cart).

Rules for exploration: close the side menu with "Close Menu" before any other click; never open "About" or "Dynamic Catalog". Use fake form data only (First Name "Test", Last Name "User", Zip/Postal Code "12345").

Exploration notes (observed 2026-11-26): (1) The page heading element [data-test=title] updates one render late. A read straight after navigation returned the previous page's heading, so use web-first assertions (toHaveText), not instant reads. Final headings: Products, Your Cart, Checkout: Your Information, Checkout: Overview, Checkout: Complete!. (2) Console shows 1 error on the login page (not investigated, out of scope). (3) Side menu, About and Dynamic Catalog were not opened. No action failed twice, so none was skipped. (4) Cart button accessible name changes with state (for example "Cart, empty"); use the data-test shopping-cart-link via getByTestId if the role name is unstable.

Key locators (priority: role, label, placeholder, text, test id). Login: textbox "Username" (placeholder "Username"), textbox "Password" (placeholder "Password"), button "Login", form "Login", error alert at data-test "error" with button "Dismiss error". Inventory: combobox (data-test product-sort-container) with options "Name (A to Z)" (az), "Name (Z to A)" (za), "Price (low to high)" (lohi), "Price (high to low)" (hilo); item buttons "Add to cart" / "Remove" (data-test add-to-cart-<slug> / remove-<slug>); badge data-test shopping-cart-badge; cart link data-test shopping-cart-link; button "Open Menu". Cart: "Continue Shopping", "Checkout", "Remove", column labels QTY and Description. Checkout step one: textboxes "First Name", "Last Name", "Zip/Postal Code" (labels equal placeholders), buttons "Cancel", "Continue". Step two: buttons "Cancel", "Finish". Complete: heading "Thank you for your order!", image "Pony Express", buttons "Back Home".

## Test Scenarios

### 1. Authentication

#### 1.1. UI-01 user logs in and sees the Products page

**File:** `tests/ui/login.spec.ts`

**Steps:**
  1. Open https://www.saucedemo.com/. Read the password from the 'Password for all users:' block.
    - expect: Login form is visible with textbox 'Username', textbox 'Password', button 'Login'
    - expect: Page title is 'Swag Labs'
  2. Fill 'Username' with standard_user and 'Password' with the password read from the page. Click 'Login'.
    - expect: URL is https://www.saucedemo.com/inventory.html
    - expect: Page heading shows 'Products'
    - expect: Cart badge is not visible

#### 1.2. UI-08 user cannot log in with a wrong password

**File:** `tests/ui/login.spec.ts`

**Steps:**
  1. Open https://www.saucedemo.com/. Fill 'Username' with standard_user and 'Password' with wrong_password. Click 'Login'.
    - expect: URL stays https://www.saucedemo.com/
    - expect: Error alert text is exactly: Epic sadface: Username and password do not match any user in this service
    - expect: Button 'Dismiss error' is visible
    - expect: Products page is not shown

#### 1.3. UI-10 unauthenticated user cannot open /inventory.html

**File:** `tests/ui/login.spec.ts`

**Steps:**
  1. In a fresh context, open https://www.saucedemo.com/inventory.html directly.
    - expect: User is redirected to https://www.saucedemo.com/
    - expect: Login form is shown
    - expect: Error alert text is exactly: Epic sadface: You can only access '/inventory.html' when you are logged in.
    - expect: No product list is visible

### 2. Catalog

#### 2.1. UI-02 catalog shows 6 products with name, price and Add to cart

**File:** `tests/ui/catalog.spec.ts`

**Steps:**
  1. Log in as standard_user. Read the product list in the default order (Name A to Z).
    - expect: Exactly 6 products
    - expect: 1 Sauce Labs Backpack $29.99
    - expect: 2 Sauce Labs Bike Light $9.99
    - expect: 3 Sauce Labs Bolt T-Shirt $15.99
    - expect: 4 Sauce Labs Fleece Jacket $49.99
    - expect: 5 Sauce Labs Onesie $7.99
    - expect: 6 Test.allTheThings() T-Shirt (Red) $15.99
    - expect: Every product has a button 'Add to cart'
    - expect: Sort combobox default is 'Name (A to Z)'

#### 2.2. UI-03 user sorts products by price low to high

**File:** `tests/ui/catalog.spec.ts`

**Steps:**
  1. Log in. Select 'Price (low to high)' in the sort combobox.
    - expect: Prices in this order: $7.99, $9.99, $15.99, $15.99, $29.99, $49.99
    - expect: Names in this order: Sauce Labs Onesie, Sauce Labs Bike Light, the two $15.99 items, Sauce Labs Backpack, Sauce Labs Fleece Jacket
    - expect: The order of the two $15.99 items (Sauce Labs Bolt T-Shirt, Test.allTheThings() T-Shirt (Red)) is not checked: no requirement defines it

#### 2.3. UI-04 user sorts products by name Z to A

**File:** `tests/ui/catalog.spec.ts`

**Steps:**
  1. Log in. Select 'Name (Z to A)' in the sort combobox.
    - expect: Order: Test.allTheThings() T-Shirt (Red), Sauce Labs Onesie, Sauce Labs Fleece Jacket, Sauce Labs Bolt T-Shirt, Sauce Labs Bike Light, Sauce Labs Backpack

### 3. Cart

#### 3.1. UI-05 user adds 2 products and the cart shows them

**File:** `tests/ui/cart.spec.ts`

**Steps:**
  1. Log in. Click 'Add to cart' for Sauce Labs Backpack, then for Sauce Labs Bike Light.
    - expect: Both buttons change to 'Remove'
    - expect: Cart badge shows 2
  2. Click the cart link.
    - expect: URL is https://www.saucedemo.com/cart.html
    - expect: Heading 'Your Cart'; labels QTY and Description
    - expect: Two lines: 'Sauce Labs Backpack' $29.99 and 'Sauce Labs Bike Light' $9.99, each with quantity 1 and a 'Remove' button
    - expect: Buttons 'Continue Shopping' and 'Checkout' are visible

#### 3.2. UI-06 user removes a product from the cart

**File:** `tests/ui/cart.spec.ts`

**Steps:**
  1. Log in. Add Sauce Labs Backpack and Sauce Labs Bike Light. Open the cart. Click 'Remove' on Sauce Labs Bike Light.
    - expect: Only Sauce Labs Backpack remains in the list
    - expect: Cart badge shows 1
  2. Click 'Remove' on Sauce Labs Backpack.
    - expect: Cart list is empty
    - expect: Cart badge is not visible

### 4. Checkout

#### 4.1. UI-07 user completes a full checkout

**File:** `tests/ui/checkout.spec.ts`

**Steps:**
  1. Log in. Add Sauce Labs Backpack ($29.99) and Sauce Labs Bike Light ($9.99). Open the cart and click 'Checkout'.
    - expect: URL is https://www.saucedemo.com/checkout-step-one.html
    - expect: Heading 'Checkout: Your Information'; textboxes 'First Name', 'Last Name', 'Zip/Postal Code'; buttons 'Cancel', 'Continue'
  2. Fill First Name Test, Last Name User, Zip/Postal Code 12345. Click 'Continue'.
    - expect: URL is https://www.saucedemo.com/checkout-step-two.html
    - expect: Heading 'Checkout: Overview'
    - expect: Both items listed with quantity 1 and prices
    - expect: Payment Information: SauceCard #31337; Shipping Information: Free Pony Express Delivery!
    - expect: Item total: $39.98 (the sum of the item prices)
    - expect: Total = Item total + Tax (the tax rate is not checked: no requirement defines it)
    - expect: Buttons 'Cancel' and 'Finish'
  3. Click 'Finish'.
    - expect: URL is https://www.saucedemo.com/checkout-complete.html
    - expect: Heading 'Checkout: Complete!'
    - expect: Heading 'Thank you for your order!'
    - expect: Text 'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
    - expect: Image 'Pony Express'; button 'Back Home'; cart badge not visible
  4. Click 'Back Home'.
    - expect: URL is https://www.saucedemo.com/inventory.html and the cart is empty

#### 4.2. UI-09 user cannot continue checkout with empty fields

**File:** `tests/ui/checkout.spec.ts`

**Steps:**
  1. Log in. Add Sauce Labs Backpack. Open the cart, click 'Checkout'. Click 'Continue' with all fields empty.
    - expect: URL stays https://www.saucedemo.com/checkout-step-one.html
    - expect: Error text is exactly: Error: First Name is required
  2. Fill only First Name (Test). Click 'Continue'.
    - expect: Error text is exactly: Error: Last Name is required
  3. Also fill Last Name (User). Click 'Continue'.
    - expect: Error text is exactly: Error: Postal Code is required
    - expect: URL still checkout-step-one.html
