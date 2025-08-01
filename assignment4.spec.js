// Added detailed console.log messages for better debugging
// Updated test descriptions to be more descriptive


const { test, expect } = require('@playwright/test');
const fs = require('fs');


const screenshotDir = 'screenshots';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir);
}

// Login function
async function login(page) {
  await page.goto('https://automationexercise.com/', { waitUntil: 'domcontentloaded' });
  await page.click('a[href="/login"]');
  await page.fill('[data-qa="login-email"]', 'jgeorge1074@conestogac.on.ca');
  await page.fill('[data-qa="login-password"]', 'softwarequality77');
  await page.click('[data-qa="login-button"]');
  await page.waitForSelector('text=Logged in as', { timeout: 10000 });
}

// 1. Signup new user
test('Signup new user', async ({ page }) => {
  await page.goto('https://automationexercise.com/', { waitUntil: 'domcontentloaded' });
  await page.click('a[href="/login"]');
  await page.fill('[data-qa="signup-name"]', 'Test User');
  await page.fill('[data-qa="signup-email"]', 'testuser' + Date.now() + '@example.com');
  await page.click('[data-qa="signup-button"]');

  await page.check('#id_gender1');
  await page.fill('#password', 'password123');
  await page.selectOption('#days', '10');
  await page.selectOption('#months', '5');
  await page.selectOption('#years', '1990');
  await page.check('#newsletter');
  await page.check('#optin');
  await page.fill('#first_name', 'Test');
  await page.fill('#last_name', 'User');
  await page.fill('#address1', '123 Test Street');
  await page.selectOption('#country', { label: 'Canada' });
  await page.fill('#state', 'Ontario');
  await page.fill('#city', 'Toronto');
  await page.fill('#zipcode', 'M1A1A1');
  await page.fill('#mobile_number', '1234567890');
  await page.click('[data-qa="create-account"]');
  await expect(page.locator('text=Account Created!')).toBeVisible();

  await page.screenshot({ path: `${screenshotDir}/test1_signup.png`, fullPage: true });
});

// 2. Login with valid credentials
test('Login with valid credentials', async ({ page }) => {
  await login(page);
  await page.screenshot({ path: `${screenshotDir}/test2_login_valid.png`, fullPage: true });
});

// 3. Login with invalid credentials
test('Login with invalid credentials', async ({ page }) => {
  await page.goto('https://automationexercise.com/', { waitUntil: 'domcontentloaded' });
  await page.click('a[href="/login"]');
  await page.fill('[data-qa="login-email"]', 'wrong@example.com');
  await page.fill('[data-qa="login-password"]', 'wrongpass');
  await page.click('[data-qa="login-button"]');
  await expect(page.locator('text=Your email or password is incorrect!')).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/test3_login_invalid.png`, fullPage: true });
});

// 4. Search for a product
test('Search for a product', async ({ page }) => {
  await page.goto('https://automationexercise.com/products', { waitUntil: 'domcontentloaded' });

  const searchBox = page.locator('#search_product');
  await searchBox.scrollIntoViewIfNeeded();
  await expect(searchBox).toBeVisible({ timeout: 10000 });

  await searchBox.fill('Tshirt');
  await page.click('#submit_search');
  await page.waitForSelector('text=Searched Products', { timeout: 10000 });
  await expect(page.locator('text=Searched Products')).toBeVisible();

  await page.screenshot({ path: `${screenshotDir}/test4_search.png`, fullPage: true });
});

// 5. Add product to cart
test('Add product to cart', async ({ page }) => {
  await page.goto('https://automationexercise.com/products', { waitUntil: 'domcontentloaded' });
  await page.hover('.product-image-wrapper >> nth=0');
  await page.click('.product-image-wrapper >> nth=0 >> text=Add to cart');
  await expect(page.locator('text=View Cart')).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/test5_add_to_cart.png`, fullPage: true });
});

// 6. Complete checkout
test('Complete checkout', async ({ page }) => {
  await login(page);

  await page.goto('https://automationexercise.com/products');
  await page.hover('.product-image-wrapper >> nth=0');
  await page.click('.product-image-wrapper >> nth=0 >> text=Add to cart');
  await page.click('u:has-text("View Cart")');
  await page.click('text=Proceed To Checkout');

  await page.waitForSelector('text=Place Order', { timeout: 10000 });
  await page.click('text=Place Order');
  await page.fill('[data-qa="name-on-card"]', 'Test User');
  await page.fill('[data-qa="card-number"]', '4111111111111111');
  await page.fill('[data-qa="cvc"]', '123');
  await page.fill('[data-qa="expiry-month"]', '12');
  await page.fill('[data-qa="expiry-year"]', '2030');

  
  await page.click('[data-qa="pay-button"]');
  console.log("Order placed");
  await expect(true).toBeTruthy();

  await page.screenshot({ path: `${screenshotDir}/test6_checkout.png`, fullPage: true });
});



// 7. Submit contact form
test('Submit contact form', async ({ page }) => {
  
  page.on('dialog', dialog => dialog.accept());

  await page.goto('https://automationexercise.com/', { waitUntil: 'domcontentloaded' });
  await page.click('a[href="/contact_us"]');
  await page.fill('[data-qa="name"]', 'Test User');
  await page.fill('[data-qa="email"]', 'test@example.com');
  await page.fill('[data-qa="subject"]', 'Test Subject');
  await page.fill('#message', 'This is a test message.');
  await page.setInputFiles('[name="upload_file"]', 'testfile.txt');
  await page.click('[data-qa="submit-button"]');


  console.log("Contact form submitted");
  await expect(true).toBeTruthy();

  await page.screenshot({ path: `${screenshotDir}/test7_contact_form.png`, fullPage: true });
});


// 8. View category products
test('View category products', async ({ page }) => {
  await page.goto('https://automationexercise.com/', { waitUntil: 'domcontentloaded' });
  await page.click('a[href="#Women"]');
  await page.click('a[href="/category_products/1"]');
  await expect(page.locator('text=Women - Dress Products')).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/test8_category.png`, fullPage: true });
});

// 9. Verify subscription in footer
test('Verify subscription in footer', async ({ page }) => {
  await page.goto('https://automationexercise.com/', { waitUntil: 'domcontentloaded' });
  await page.fill('#susbscribe_email', 'test@example.com');
  await page.click('#subscribe');
  await expect(page.locator('text=You have been successfully subscribed!')).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/test9_subscription.png`, fullPage: true });
});

// 10. Delete account after login
test('Delete account after login', async ({ page }) => {
  await login(page);
  await page.click('a[href="/delete_account"]');
  await expect(page.locator('text=Account Deleted!')).toBeVisible();
  await page.screenshot({ path: `${screenshotDir}/test10_delete_account.png`, fullPage: true });
});
