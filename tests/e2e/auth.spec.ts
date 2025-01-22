import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should login successfully", async ({ page, context }) => {
    // Navigate to the login page
    await page.goto("/admin");

    // Fill in the login form
    await page.fill("input[name='email']", "admin@example.com");
    await page.fill("input[name='password']", "password123");

    // // Submit the form
    await page.click("button[type='submit']");

    // Assert cookie is set
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(
      (cookie) => cookie.name === "sessionToken"
    );
    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.value).toMatch(/\|ADMIN$/);

    // Assert redirection to the dasboard
    await expect(page).toHaveURL("/admin/dashboard");
    await expect(page.locator("text=Entrou com sucesso!")).toBeVisible();
  });
});
