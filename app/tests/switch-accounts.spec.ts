import { expect, test, type Page } from "@playwright/test";

const settings = (page: Page) => page.locator(".settings-page");
const accountCard = (page: Page) => settings(page).locator(".settings-account-card");
const nav = (page: Page, name: string) => page.locator(".bottom-nav").getByRole("button", { name, exact: true });
const switchRow = (page: Page) => settings(page).getByRole("button", { name: "Switch Accounts" });

test("Switch accounts changes the reader and keeps each local Library separate", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("daily-culture.boards.v1", JSON.stringify({
      version: 1,
      savedPieceIds: ["great-wave"],
      boards: [{ id: "board-default", name: "My folder", pieceIds: ["great-wave"] }],
    }));
    localStorage.setItem("daily-culture.library-notes.v1", JSON.stringify({ "great-wave": "Julio's note" }));
  });
  await page.reload();
  await nav(page, "Settings").click();
  await expect(accountCard(page)).toContainText("Julio Caggiano");
  await expect(accountCard(page)).toContainText("1 saved artwork");
  const ownerBoards = await page.evaluate(() => localStorage.getItem("daily-culture.boards.v1"));

  await switchRow(page).click();
  const chooser = page.getByRole("dialog", { name: "Switch accounts" });
  await expect(chooser.getByRole("heading", { name: "Switch accounts" })).toHaveCount(0);
  await expect(chooser).not.toContainText("These accounts are local to this preview");
  await expect(chooser.getByRole("button", { name: /Julio Caggiano/ })).toHaveAttribute("aria-current", "true");
  await chooser.getByRole("button", { name: /Leila Martins/ }).click();
  await expect(accountCard(page)).toContainText("Leila Martins");
  await expect(accountCard(page)).toContainText("2 saved artworks");
  await nav(page, "Library").click();
  await expect(page.locator(".library-work-card")).toHaveCount(2);
  await nav(page, "Settings").click();
  await accountCard(page).getByRole("button", { name: "View profile" }).click();
  await expect(page.locator('.taste-profile-screen[data-profile-owner="true"]')).toContainText("Leila Martins");
  await page.locator(".taste-profile-nav button").first().click();

  await switchRow(page).click();
  await page.getByRole("dialog", { name: "Switch accounts" }).getByRole("button", { name: /Julio Caggiano/ }).click();
  await expect(accountCard(page)).toContainText("Julio Caggiano");
  await expect(accountCard(page)).toContainText("1 saved artwork");
  expect(await page.evaluate(() => localStorage.getItem("daily-culture.boards.v1"))).toBe(ownerBoards);
  expect(await page.evaluate(() => localStorage.getItem("daily-culture.library-notes.v1"))).toContain("Julio's note");
});

test("Add account is a local preview, with Back and Escape in the chooser", async ({ page }) => {
  await page.goto("/");
  await nav(page, "Settings").click();
  await switchRow(page).click();
  const chooser = page.getByRole("dialog", { name: "Switch accounts" });
  await chooser.getByRole("button", { name: "Add account" }).click();
  const add = page.getByRole("dialog", { name: "Add account" });
  await expect(add).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(chooser).toBeVisible();
  await expect(chooser.getByRole("button", { name: "Add account" })).toBeFocused();
  await chooser.getByRole("button", { name: "Add account" }).click();
  await add.getByRole("textbox", { name: "Email address" }).fill("new.reader@example.com");
  await add.getByRole("button", { name: "Continue with email" }).click();
  await expect(accountCard(page)).toContainText("New Reader");
  await expect(accountCard(page)).toContainText("0 saved artworks");
  const saved = await page.evaluate(() => Object.values(localStorage).join(" "));
  expect(saved).not.toContain("new.reader@example.com");
  await page.reload();
  await nav(page, "Settings").click();
  await expect(accountCard(page)).toContainText("New Reader");
});

test("Language and notification sheets use the shorter copy", async ({ page }) => {
  await page.goto("/");
  await nav(page, "Settings").click();
  await settings(page).getByRole("button", { name: "Language" }).click();
  const sheet = page.getByTestId("bottom-sheet");
  await expect(sheet.getByRole("heading", { name: "Switch language" })).toBeVisible();
  await expect(sheet.locator(".sheet-description")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await settings(page).getByRole("button", { name: "Notifications" }).click();
  await expect(sheet.getByRole("heading", { name: "Notifications" })).toBeVisible();
  await expect(sheet.locator(".sheet-description, .prototype-note")).toHaveCount(0);
});

test("study routes keep added preview accounts temporary", async ({ page }) => {
  await page.goto("/?library-study=compact");
  await nav(page, "Settings").click();
  await switchRow(page).click();
  await page.getByRole("dialog", { name: "Switch accounts" }).getByRole("button", { name: "Add account" }).click();
  await page.getByRole("dialog", { name: "Add account" }).getByRole("button", { name: "Continue with Apple" }).click();
  await expect(accountCard(page)).toContainText("Preview account");
  expect(await page.evaluate(() => localStorage.getItem("taste.preview.accounts.v1"))).toBeNull();
  await page.reload();
  await nav(page, "Settings").click();
  await switchRow(page).click();
  await expect(page.getByRole("dialog", { name: "Switch accounts" }).locator(".switch-accounts-account")).toHaveCount(2);
});
