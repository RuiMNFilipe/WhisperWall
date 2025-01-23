import { test, expect } from "@playwright/test";

test.describe("Home Page @e2e", () => {
  test("shows a textarea and allows post submission", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await browser.newPage();

    await page.goto("/");

    // Check that the textarea and submit button are present
    const textarea = page.locator(
      'textarea[placeholder="Em que estás a pensar?"]'
    );
    const button = page.locator('button[type="submit"]');

    await expect(textarea).toBeVisible();
    await expect(button).toBeVisible();

    // Type into the textarea
    const newPostContent = "This is a new post";
    await textarea.fill(newPostContent);
    await button.click();

    // Verify that success toast message
    await expect(
      page.locator("text=Post submetido com sucesso!")
    ).toBeVisible();

    await context.close();
  });

  test("displays answered posts if available", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await browser.newPage();

    const answeredPosts = [
      { id: 1, content: "First answer post", answer: "First answer" },
      { id: 2, content: "Second answer post", answer: "Second answer" },
    ];

    await page.route("/", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(answeredPosts),
      });
    });

    await page.goto("/");

    for (const post of answeredPosts) {
      await expect(page.locator(`text=${post.content}`)).toBeVisible();
      await expect(page.locator(`text=${post.answer}`)).toBeVisible();
    }

    await context.close();
  });

  test("shows no posts message when no answered posts are available", async ({
    browser,
  }) => {
    const context = await browser.newContext();
    const page = await browser.newPage();

    await page.goto("/");

    await expect(page.getByText("Não existem Posts ainda...")).toBeVisible();

    await context.close();
  });
});
