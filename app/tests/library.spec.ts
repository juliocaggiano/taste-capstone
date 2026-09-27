import { expect, test, type Page } from "@playwright/test";

const library = (page: Page) => page.locator(".library-retained-page");
const works = (page: Page) => library(page).locator(".library-work-card");
const work = (page: Page, title: string) => works(page).filter({ hasText: title });
const detail = (page: Page) => page.locator('.today-article[data-reading-view="detail"]');
const folder = (page: Page, name: string) => library(page).locator("[data-library-folder-id]").filter({ hasText: name });
const overview = (page: Page) => library(page).locator('.library-study-page[data-library-variant="overview"]');
const backToFolders = (page: Page) => library(page).getByRole("button", { name: "Back to folders", exact: true });
const newFolder = (page: Page) => library(page).getByRole("button", { name: "New folder", exact: true });

test("Selected Library overview uses saved data and persists folders, notes, memberships and unsaves", async ({ page }) => {
  // Seed one folder member and two globally saved artworks in this isolated page.
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("taste.preview.active-account.v1", "current-prototype-reader");
    localStorage.setItem("daily-culture.boards.v1", JSON.stringify({
      version: 1,
      savedPieceIds: ["divine-comedy", "great-wave", "death-of-socrates"],
      boards: [{ id: "board-default", name: "My folder", pieceIds: ["divine-comedy"] }],
    }));
    localStorage.setItem("daily-culture.library-notes.v1", "{}");
  });
  await page.reload();
  await page.getByRole("button", { name: "Library", exact: true }).click();

  await test.step("The overview shows actual folders and all saved works without duplicate tabs", async () => {
    await expect(overview(page)).toBeVisible();
    await expect(page.locator(".daily-culture-app")).not.toHaveAttribute("data-library-study");
    await expect(library(page).getByRole("tablist")).toHaveCount(0);
    await expect(library(page).getByRole("heading", { name: "All artworks", exact: true })).toHaveCount(0);
    await expect(library(page).getByRole("heading", { name: /^Artworks/ })).toContainText("3");
    await expect(library(page).locator("[data-library-folder-id]")).toHaveCount(1);
    await expect(works(page)).toHaveCount(3);
    for (const title of ["The Death of Socrates", "The Divine Comedy", "The Great Wave off Kanagawa"]) {
      await expect(work(page, title)).toHaveCount(1);
    }
  });

  await test.step("Folder creation cancels a draft without changing saved state", async () => {
    await folder(page, "My folder").click();
    await expect(overview(page)).toHaveAttribute("data-folder-open", "board-default");
    await expect(works(page)).toHaveCount(1);
    await expect(work(page, "The Divine Comedy")).toBeVisible();

    await backToFolders(page).click();
    await newFolder(page).click();
    const sheet = page.getByTestId("bottom-sheet");
    await expect(sheet.getByRole("heading", { name: "New folder", exact: true })).toBeVisible();
    const name = sheet.getByRole("textbox", { name: "Folder name", exact: true });
    await expect(name).toHaveAttribute("maxlength", "50");
    const create = sheet.getByRole("button", { name: "Create", exact: true });
    await expect(create).toBeDisabled();
    await name.fill("   ");
    await expect(create).toBeDisabled();
    await name.fill("Unsaved draft");
    await sheet.getByRole("switch", { name: "Private folder", exact: true }).click();
    await page.keyboard.press("Escape");
    await expect(sheet).toHaveCount(0);
    await expect(folder(page, "Unsaved draft")).toHaveCount(0);
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem("daily-culture.boards.v1")!));
    expect(state.boards).toHaveLength(1);
    expect(state.savedPieceIds).toHaveLength(3);
  });

  await test.step("The new folder stores cover, visibility, and collaborators before creation", async () => {
    await newFolder(page).click();
    const sheet = page.getByTestId("bottom-sheet");
    const name = sheet.getByRole("textbox", { name: "Folder name", exact: true });
    await expect(name).toBeEmpty();
    await expect(sheet.getByRole("switch", { name: "Private folder", exact: true })).toHaveAttribute("aria-checked", "false");
    await name.fill("Study folder");
    await sheet.getByRole("switch", { name: "Private folder", exact: true }).click();
    await sheet.getByRole("switch", { name: "Hide from feed", exact: true }).click();
    await sheet.getByRole("button", { name: "Change cover", exact: true }).click();
    await sheet.getByRole("button", { name: "The Great Wave off Kanagawa", exact: true }).click();
    await sheet.getByRole("searchbox", { name: "Search by name", exact: true }).fill("Mara");
    await expect(sheet).toContainText("Sample profiles");
    await sheet.getByRole("button", { name: "Select Mara Vale", exact: true }).click();
    await sheet.getByRole("button", { name: "Create", exact: true }).click();
    await expect(sheet).toHaveCount(0);
    await expect(library(page).getByRole("heading", { name: "Study folder", exact: true })).toBeVisible();
    await expect(works(page)).toHaveCount(0);
    await expect(library(page)).toContainText("Save artworks to this folder to see them here.");
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem("daily-culture.boards.v1")!));
    expect(state.boards.find((item: { name: string }) => item.name === "Study folder")).toMatchObject({
      pieceIds: [], coverPieceId: "great-wave", isPrivate: true, hideFromFeed: true, collaboratorIds: ["sample-person-1"],
    });
    expect(state.savedPieceIds).toHaveLength(3);
  });

  await test.step("Cancel discards both note and folder changes", async () => {
    await backToFolders(page).click();
    await work(page, "The Great Wave off Kanagawa").click();
    await expect(detail(page).locator(".today-title-row h1")).toHaveText("The Great Wave off Kanagawa");
    await detail(page).getByRole("button", { name: "Edit", exact: true }).click();
    const sheet = page.getByTestId("bottom-sheet");
    const studyFolder = sheet.locator(".library-edit-folders").getByRole("button", { name: "Study folder", exact: true });
    await expect(studyFolder).toHaveAttribute("aria-pressed", "false");
    await studyFolder.click();
    await sheet.getByRole("textbox", { name: "Personal note", exact: true }).fill("This draft should disappear.");
    await sheet.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(sheet).toHaveCount(0);

    await detail(page).getByRole("button", { name: "Edit", exact: true }).click();
    await expect(studyFolder).toHaveAttribute("aria-pressed", "false");
    await expect(sheet.getByRole("textbox", { name: "Personal note", exact: true })).toBeEmpty();
  });

  await test.step("Save commits the note and membership", async () => {
    const sheet = page.getByTestId("bottom-sheet");
    await sheet.locator(".library-edit-folders").getByRole("button", { name: "Study folder", exact: true }).click();
    await sheet.getByRole("textbox", { name: "Personal note", exact: true }).fill("The wave frames the boats beneath it.");
    await sheet.getByRole("button", { name: "Save changes", exact: true }).click();
    await expect(sheet).toHaveCount(0);
    await expect(detail(page).locator(".library-personal-note")).toContainText("The wave frames the boats beneath it.");
    await detail(page).getByRole("button", { name: "Close story", exact: true }).click();

    await folder(page, "Study folder").click();
    await expect(library(page).getByRole("heading", { name: "Study folder", exact: true })).toBeVisible();
    await expect(works(page)).toHaveCount(1);
    await expect(work(page, "The Great Wave off Kanagawa")).toBeVisible();
    await backToFolders(page).click();
    await expect(folder(page, "Study folder")).toBeFocused();
    await folder(page, "My folder").click();
    await expect(works(page)).toHaveCount(1);
    await expect(work(page, "The Divine Comedy")).toBeVisible();
  });

  await test.step("Reload restores the saved set, folder, membership, and note", async () => {
    await page.reload();
    await page.getByRole("button", { name: "Library", exact: true }).click();
    await expect(works(page)).toHaveCount(3);
    await folder(page, "Study folder").click();
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem("daily-culture.boards.v1")!));
    expect(state.boards.find((item: { name: string }) => item.name === "Study folder")).toMatchObject({
      coverPieceId: "great-wave", isPrivate: true, hideFromFeed: true, collaboratorIds: ["sample-person-1"],
    });
    await expect(works(page)).toHaveCount(1);
    await work(page, "The Great Wave off Kanagawa").click();
    await expect(detail(page).locator(".library-personal-note")).toContainText("The wave frames the boats beneath it.");
    await detail(page).getByRole("button", { name: "Edit", exact: true }).click();
    const sheet = page.getByTestId("bottom-sheet");
    await expect(sheet.locator(".library-edit-folders").getByRole("button", { name: "Study folder", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(sheet.getByRole("textbox", { name: "Personal note", exact: true })).toHaveValue("The wave frames the boats beneath it.");
    await sheet.getByRole("button", { name: "Cancel", exact: true }).click();
    await detail(page).getByRole("button", { name: "Close story", exact: true }).click();
    await expect(library(page).getByRole("heading", { name: "Study folder", exact: true })).toBeVisible();
    await expect(work(page, "The Great Wave off Kanagawa")).toBeFocused();
  });

  await test.step("Unsave removes folder membership and survives reload", async () => {
    await work(page, "The Great Wave off Kanagawa").click();
    await detail(page).locator(".today-save-primary").click();
    await detail(page).getByRole("button", { name: "Close story", exact: true }).click();
    await expect(works(page)).toHaveCount(0);
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem("daily-culture.boards.v1")!));
    expect(state.savedPieceIds).not.toContain("great-wave");
    expect(state.boards.find((item: { name: string }) => item.name === "Study folder").pieceIds).toEqual([]);
    await page.reload();
    await page.getByRole("button", { name: "Library", exact: true }).click();
    await expect(works(page)).toHaveCount(2);
    await expect(work(page, "The Great Wave off Kanagawa")).toHaveCount(0);
    await expect(folder(page, "Study folder")).toContainText("0 artworks");
  });
});

for (const coarse of [false, true]) {
  test.describe(coarse ? "touch folder navigation" : "pointer folder navigation", () => {
    test.use({ hasTouch: coarse });
    test("Back stays compact on its own row above the folder title and controls", async ({ page }) => {
      await page.goto("/");
      await page.locator(".bottom-nav").getByRole("button", { name: "Library", exact: true }).click();
      await folder(page, "My folder").click();
      const back = backToFolders(page);
      await expect(back).toHaveCSS("width", coarse ? "44px" : "32px");
      await expect(back.locator("svg")).toHaveAttribute("width", "14");
      const metrics = await back.evaluate(button => {
        const panel = button.closest(".library-study-panel")!;
        const backRect = button.getBoundingClientRect();
        const titleRect = panel.querySelector("h1")!.getBoundingClientRect();
        const actionsRect = panel.querySelector(".discover-gallery-actions")!.getBoundingClientRect();
        const face = getComputedStyle(button, "::before");
        return { backBottom: backRect.bottom, titleTop: titleRect.top, actionsTop: actionsRect.top, faceWidth: face.width, faceHeight: face.height };
      });
      expect(metrics.faceWidth).toBe("24px");
      expect(metrics.faceHeight).toBe("24px");
      expect(metrics.backBottom).toBeLessThan(metrics.titleTop);
      expect(metrics.backBottom).toBeLessThan(metrics.actionsTop);
      await page.keyboard.press("Escape");
      await expect(folder(page, "My folder")).toBeFocused();
    });
  });
}
