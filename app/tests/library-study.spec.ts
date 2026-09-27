import { expect, test, type Page } from "@playwright/test";

const variants = ["compact", "switcher", "overview"] as const;
type Variant = typeof variants[number];
const expectedTitles = [
  "The Great Wave off Kanagawa", "Noh Mask: Kojo", "Migrant Mother", "The Cabinet of Dr. Caligari", "The Kiss",
];
const library = (page: Page) => page.locator(".library-retained-page");
const study = (page: Page) => library(page).locator(".library-study-page");
const works = (page: Page) => library(page).locator(".library-work-card");
const detail = (page: Page) => page.locator('.today-article[data-reading-view="detail"]');
const nav = (page: Page, name: string) => page.locator(".bottom-nav").getByRole("button", { name, exact: true });

const persistedSample = {
  "daily-culture.boards.v1": JSON.stringify({ version: 1, savedPieceIds: ["divine-comedy"], boards: [{ id: "board-default", name: "My folder", pieceIds: ["divine-comedy"] }] }),
  "daily-culture.favourites.v1": JSON.stringify(["divine-comedy"]),
  "daily-culture.preferences.v1": JSON.stringify({ locale: "it", theme: "dark", textSize: "large", units: "metric", cadence: "daily", notifications: true, notificationTime: "18:00", widget: "imageOnly" }),
  "daily-culture.library-notes.v1": JSON.stringify({ "great-wave": "A private note from the real Library." }),
  "daily-culture-followed-people-v1": JSON.stringify(["sample-person-2"]),
  "daily-culture-followed-creators-v1": JSON.stringify(["jacques-louis-david"]),
  "daily-culture.collections.v1": JSON.stringify(["japan-motion"]),
  "daily-culture.create-artwork-draft.v1": JSON.stringify({ draft: { artist: "Preserved artist", title: "Preserved draft", context: "Preserved context" }, step: 0 }),
};

async function seedAndObservePersistence(page: Page) {
  await page.addInitScript(seed => {
    // Seed once only. A reload must expose any unexpected persistent write.
    if (!sessionStorage.getItem("library-study-test-seeded")) {
      Object.entries(seed).forEach(([key, value]) => localStorage.setItem(key, value));
      sessionStorage.setItem("library-study-test-seeded", "1");
    }
    const writes: string[] = [];
    const databases: string[] = [];
    Object.defineProperty(window, "__libraryStudyWrites", { value: writes });
    Object.defineProperty(window, "__libraryStudyDatabases", { value: databases });
    const set = Storage.prototype.setItem;
    const remove = Storage.prototype.removeItem;
    const clear = Storage.prototype.clear;
    Storage.prototype.setItem = function(key, value) {
      if (this === localStorage && key.startsWith("daily-culture")) writes.push(`set:${key}`);
      set.call(this, key, value);
    };
    Storage.prototype.removeItem = function(key) {
      if (this === localStorage && key.startsWith("daily-culture")) writes.push(`remove:${key}`);
      remove.call(this, key);
    };
    Storage.prototype.clear = function() {
      if (this === localStorage) writes.push("clear");
      clear.call(this);
    };
    const open = IDBFactory.prototype.open;
    IDBFactory.prototype.open = function(name, version) {
      databases.push(name);
      return version === undefined ? open.call(this, name) : open.call(this, name, version);
    };
  }, persistedSample);
}

async function expectPersistenceUnchanged(page: Page) {
  const state = await page.evaluate(keys => {
    const tracked = window as unknown as { __libraryStudyWrites: string[]; __libraryStudyDatabases: string[] };
    return {
      saved: Object.fromEntries(keys.map(key => [key, localStorage.getItem(key)])),
      writes: tracked.__libraryStudyWrites,
      databases: tracked.__libraryStudyDatabases,
    };
  }, Object.keys(persistedSample));
  expect(state.saved).toEqual(persistedSample);
  expect(state.writes).toEqual([]);
  expect(state.databases).toEqual([]);
}

async function chooseSection(page: Page, variant: Variant, section: "Artworks" | "Folders") {
  if (variant === "overview") return;
  if (variant === "compact") {
    await study(page).getByRole("tab", { name: new RegExp(`^${section}`) }).click();
  } else {
    await study(page).getByRole("combobox", { name: /^Library sections/ }).click();
    await page.getByRole("option", { name: new RegExp(`^${section}`) }).click();
  }
}

async function openStudy(page: Page, variant: Variant) {
  await page.goto(`/?library-study=${variant}`);
  await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-tab", "favourites");
  await expect(study(page)).toHaveAttribute("data-library-study", variant);
}

for (const variant of variants) {
  test(`${variant}: the same five saved artworks support grid and list browsing`, async ({ page }) => {
    await openStudy(page, variant);
    await expect(works(page)).toHaveCount(5);
    expect((await works(page).locator("strong").allTextContents()).sort()).toEqual([...expectedTitles].sort());
    if (variant === "compact") await expect(study(page).getByRole("tab", { name: /^Artworks/ })).toContainText("5");
    if (variant === "switcher") await expect(study(page).getByRole("combobox", { name: "Library sections" })).toContainText("Artworks 5");
    if (variant === "overview") await expect(study(page).getByRole("heading", { name: /^Artworks/ })).toContainText("5");

    await study(page).getByRole("button", { name: "List view", exact: true }).click();
    await expect(works(page)).toHaveCount(5);
    await expect(library(page).locator(".artwork-list-row")).toHaveCount(5);
    expect((await works(page).locator("strong").allTextContents()).sort()).toEqual([...expectedTitles].sort());
    await study(page).getByRole("button", { name: "Grid view", exact: true }).click();
    await expect(library(page).locator(".artwork-list-row")).toHaveCount(0);
    await expect(works(page)).toHaveCount(5);
  });

  test(`${variant}: folder and artwork Back retain the selected folder and browsing state`, async ({ page }) => {
    await openStudy(page, variant);
    await chooseSection(page, variant, "Folders");
    await expect(study(page).locator("[data-library-folder-id]")).toHaveCount(3);

    await study(page).locator('[data-library-folder-id="study-to-explore"]').click();
    await expect(study(page).getByRole("heading", { name: "To explore", exact: true })).toBeVisible();
    await expect(study(page)).toContainText("Save artworks to this folder to see them here.");
    await study(page).getByRole("button", { name: "Back to folders", exact: true }).click();

    const folder = study(page).locator('[data-library-folder-id="study-light-shadow"]');
    await folder.scrollIntoViewIfNeeded();
    const scroll = library(page).locator(".mobile-scroll");
    const position = await scroll.evaluate(element => element.scrollTop);
    await folder.click();
    await expect(study(page)).toHaveAttribute("data-folder-open", "study-light-shadow");
    await expect(works(page)).toHaveCount(2);
    expect((await works(page).locator("strong").allTextContents()).sort()).toEqual(["Migrant Mother", "The Cabinet of Dr. Caligari"]);

    if (variant === "compact") {
      await study(page).getByRole("button", { name: "Filters", exact: true }).click();
      const filters = page.getByTestId("bottom-sheet");
      await filters.getByRole("combobox", { name: /^Medium\b/ }).click();
      await page.getByRole("option", { name: "Object", exact: true }).click();
      await filters.getByRole("button", { name: "Done", exact: true }).click();
      await expect(filters).toHaveCount(0);
      await expect(study(page).getByRole("heading", { name: "No matching artworks", exact: true })).toBeVisible();
      await expect(works(page)).toHaveCount(0);
      await study(page).getByRole("button", { name: "Reset filters", exact: true }).click();
      await expect(works(page)).toHaveCount(2);
    }

    await study(page).getByRole("button", { name: "List view", exact: true }).click();
    const source = study(page).locator('[data-piece-id="migrant-mother"]');
    await source.click();
    await expect(detail(page).locator(".today-title-row h1")).toHaveText("Migrant Mother");
    await detail(page).getByRole("button", { name: "Close story", exact: true }).click();
    await expect(study(page)).toHaveAttribute("data-folder-open", "study-light-shadow");
    await expect(study(page).getByRole("button", { name: "List view", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(source).toBeFocused();

    await study(page).getByRole("button", { name: "Back to folders", exact: true }).click();
    await expect(folder).toHaveAttribute("data-selected", "true");
    await expect(folder).toBeFocused();
    expect(await scroll.evaluate(element => element.scrollTop)).toBeCloseTo(position, 1);
    if (variant !== "overview") await expect(study(page)).toHaveAttribute("data-library-section", "folders");
  });
}

test("Study edits, new folders, follows, and Create drafts reset without touching stored user data", async ({ page }) => {
  test.setTimeout(90_000);
  await seedAndObservePersistence(page);
  await openStudy(page, "compact");
  await expect(works(page)).toHaveCount(5);
  await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-theme", "light");

  await chooseSection(page, "compact", "Folders");
  await study(page).getByRole("button", { name: "New folder", exact: true }).click();
  const sheet = page.getByTestId("bottom-sheet");
  await sheet.getByRole("textbox", { name: "Folder name", exact: true }).fill("Temporary study folder");
  await sheet.getByRole("switch", { name: "Private folder", exact: true }).click();
  await sheet.getByRole("button", { name: "Create", exact: true }).click();
  await expect(sheet).toHaveCount(0);
  await expect(study(page).getByRole("heading", { name: "Temporary study folder", exact: true })).toBeVisible();
  await study(page).getByRole("button", { name: "Back to folders", exact: true }).click();
  await expect(study(page).locator("[data-library-folder-id]")).toHaveCount(4);
  await chooseSection(page, "compact", "Artworks");

  await study(page).locator('[data-piece-id="the-kiss"]').click();
  const save = detail(page).locator(".today-save-primary");
  await expect(save).toHaveAttribute("aria-pressed", "true");
  await save.click();
  await expect(save).toHaveAttribute("aria-pressed", "false");
  await detail(page).getByRole("button", { name: "Close story", exact: true }).click();
  await expect(works(page)).toHaveCount(4);

  await study(page).locator('[data-piece-id="great-wave"]').click();
  await expect(detail(page).locator(".library-personal-note")).toHaveCount(0);
  await detail(page).getByRole("button", { name: "Edit", exact: true }).click();
  await sheet.getByRole("textbox", { name: "Personal note", exact: true }).fill("Temporary comparison note");
  await sheet.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(sheet).toHaveCount(0);
  await expect(detail(page).locator(".library-personal-note")).toContainText("Temporary comparison note");
  await detail(page).getByRole("button", { name: "Close story", exact: true }).click();

  await nav(page, "Search").click();
  const scopes = page.getByRole("radiogroup", { name: "Search filters", exact: true });
  await scopes.getByRole("radio", { name: "Artists", exact: true }).click();
  await page.locator(".discover-search input").fill("David");
  const artistSave = page.locator(".search-artist-row [aria-pressed]");
  await artistSave.click();
  await expect(artistSave).toHaveAttribute("aria-pressed", "true");
  await scopes.getByRole("radio", { name: "Accounts", exact: true }).click();
  await page.locator(".discover-search input").fill("Mara Vale");
  const follow = page.locator(".search-account-row [aria-pressed]");
  await follow.click();
  await expect(follow).toHaveAttribute("aria-pressed", "true");

  await nav(page, "Settings").click();
  await page.getByRole("radiogroup", { name: "Theme", exact: true }).getByRole("radio", { name: "Dark", exact: true }).click();
  await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-theme", "dark");
  await nav(page, "Create").click();
  const flow = page.locator(".create-flow");
  await expect(flow.locator("#create-artist")).toBeEmpty();
  await expect(flow.locator("#create-title")).toBeEmpty();
  await flow.locator("#create-title").fill("Temporary artwork draft");
  await flow.locator(".create-flow-close").click();
  await expect(flow).toHaveCount(0);
  await expectPersistenceUnchanged(page);

  await page.reload();
  await expect(study(page)).toBeVisible();
  await expect(works(page)).toHaveCount(5);
  await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-theme", "light");
  await chooseSection(page, "compact", "Folders");
  await expect(study(page).locator("[data-library-folder-id]")).toHaveCount(3);
  await expect(study(page)).not.toContainText("Temporary study folder");
  await chooseSection(page, "compact", "Artworks");
  await study(page).locator('[data-piece-id="great-wave"]').click();
  await expect(detail(page).locator(".library-personal-note")).toHaveCount(0);
  await expectPersistenceUnchanged(page);
});

test("Normal and invalid study URLs use the selected overview with persisted data", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("taste.preview.active-account.v1", "current-prototype-reader");
    localStorage.setItem("daily-culture.boards.v1", JSON.stringify({ version: 1, savedPieceIds: ["divine-comedy"], boards: [{ id: "board-default", name: "My folder", pieceIds: ["divine-comedy"] }] }));
  });
  for (const url of ["/", "/?library-study=invalid"]) {
    await page.goto(url);
    await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-tab", "daily");
    await nav(page, "Library").click();
    await expect(page.locator(".daily-culture-app")).not.toHaveAttribute("data-library-study");
    await expect(study(page)).not.toHaveAttribute("data-library-study");
    await expect(study(page)).toHaveAttribute("data-library-variant", "overview");
    await expect(library(page).getByRole("tablist")).toHaveCount(0);
    await expect(library(page).getByRole("heading", { name: "All artworks", exact: true })).toHaveCount(0);
    await expect(library(page).getByRole("heading", { name: /^Artworks/ })).toContainText("1");
    await expect(library(page).locator("[data-library-folder-id]")).toHaveCount(1);
    await expect(works(page)).toHaveCount(1);
    await expect(works(page).filter({ hasText: "The Divine Comedy" })).toHaveCount(1);
  }
});
