import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should login successfully", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await browser.newPage();

    // Navigate to the login page
    await page.goto("/admin");

    // Fill in the login form
    await page.fill("input[name='email']", "admin@test.com");
    await page.fill("input[name='password']", "password123");

    // // Submit the form
    await page.click("button[type='submit']");

    await page.waitForURL("/admin/dashboard");

    // Assert redirection to the dasboard
    await expect(page).toHaveURL("/admin/dashboard");
    await expect(page.locator("text=Entrou com sucesso!")).toBeVisible();

    await context.close();
  });

  test("should show error for invalid credentials", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await browser.newPage();

    await page.goto("/admin");

    await page.fill("input[name='email']", "admin@test.com");
    await page.fill("input[name='password']", "wrongpassword");
    await page.click("button[type='submit']");

    await expect(
      page.locator("text=Utilizador tem que entrar para aceder a esta página.")
    ).toBeVisible();

    await context.close();
  });
});
