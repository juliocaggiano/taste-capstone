import { expect, test, type Locator, type Page } from "@playwright/test";

const savedIds = ["death-of-socrates", "divine-comedy", "chart-of-hell", "great-wave", "noh-mask", "arabic-bowl", "migrant-mother", "caligari", "the-kiss", "girl-pearl"];
const nav = (page: Page, label: string) => page.locator(".bottom-nav").getByRole("button", { name: label, exact: true });
const sheet = (page: Page) => page.getByRole("dialog", { name: "Sort & Filter", exact: true });
const resultTitles = (surface: Locator) => surface.locator(".discover-artwork-card strong, .library-work-card strong, .creator-reference-artwork-copy strong");

async function openApp(page: Page) {
  await page.addInitScript(ids => {
    localStorage.setItem("taste.preview.active-account.v1", "current-prototype-reader");
    localStorage.setItem("daily-culture.preferences.v1", JSON.stringify({ locale: "en", theme: "light", textSize: "default" }));
    localStorage.setItem("daily-culture.boards.v1", JSON.stringify({ version: 1, savedPieceIds: ids, boards: [{ id: "board-default", name: "My folder", pieceIds: ["divine-comedy", "chart-of-hell", "the-kiss"] }] }));
  }, savedIds);
  await page.goto("/");
}

async function openFilters(page: Page, surface: Locator) {
  await surface.getByRole("button", { name: /^(Filters|Sort & Filter)$/, exact: true }).click();
  await expect(sheet(page)).toBeVisible();
  await expect(sheet(page).getByLabel("From year", { exact: true })).toBeVisible();
  await expect(sheet(page).getByLabel("To year", { exact: true })).toBeVisible();
}

async function fillYears(page: Page, from: string, to: string) {
  await sheet(page).getByLabel("From year", { exact: true }).fill(from);
  await sheet(page).getByLabel("To year", { exact: true }).fill(to);
}

async function done(page: Page) {
  await sheet(page).getByRole("button", { name: "Done", exact: true }).click();
  await expect(sheet(page)).toHaveCount(0);
}

async function selectFilter(page: Page, label: string, option: string) {
  await sheet(page).getByRole("combobox", { name: new RegExp(`^${label}\\b`) }).click();
  await page.getByRole("option", { name: option, exact: true }).click();
}

async function openChooser(page: Page, label: "Artist" | "Country") {
  await sheet(page).getByRole("button", { name: new RegExp(`^${label}:`) }).click();
  const chooser = page.getByRole("dialog", { name: label, exact: true });
  await expect(chooser).toBeVisible();
  await expect(chooser.getByRole("combobox", { name: label === "Artist" ? "Search artists" : "Search countries", exact: true })).toBeFocused();
  return chooser;
}

test("Search applies date ranges, presets and order with searchable artist and country drafts", async ({ page }) => {
  test.setTimeout(90_000);
  await openApp(page);
  await nav(page, "Search").click();
  const search = page.locator(".discover-retained-page");
  await openFilters(page, search);
  await fillYears(page, "1321", "1480");
  await expect(sheet(page).getByRole("combobox", { name: /^Time period\b/ })).toContainText("Custom range");
  await done(page);
  await expect(resultTitles(search)).toHaveText(["The Divine Comedy", "Chart of Hell"]);

  await openFilters(page, search);
  await fillYears(page, "1908", "1908");
  await done(page);
  await expect(resultTitles(search)).toHaveText(["The Kiss"]);

  await openFilters(page, search);
  await fillYears(page, "1930", "1900");
  await expect(sheet(page).getByRole("button", { name: "Done", exact: true })).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(sheet(page)).toHaveCount(0);
  await expect(resultTitles(search)).toHaveText(["The Kiss"]);

  await openFilters(page, search);
  await expect(sheet(page).getByLabel("From year", { exact: true })).toHaveValue("1908");
  await sheet(page).getByRole("button", { name: "Reset filters", exact: true }).click();
  await selectFilter(page, "Sort by", "Oldest first");
  await done(page);
  await expect(resultTitles(search).first()).toHaveText("Bowl with Arabic Inscription");
  await openFilters(page, search);
  await selectFilter(page, "Sort by", "Newest first");
  await done(page);
  await expect(resultTitles(search).first()).toHaveText("Migrant Mother");

  await test.step("Date presets fill the range and manual dates return to Custom range", async () => {
    await openFilters(page, search);
    await sheet(page).getByRole("button", { name: "Reset filters", exact: true }).click();
    await selectFilter(page, "Time period", "1930s");
    await expect(sheet(page).getByLabel("From year", { exact: true })).toHaveValue("1930");
    await expect(sheet(page).getByLabel("To year", { exact: true })).toHaveValue("1939");
    await done(page);
    await expect(resultTitles(search)).toHaveText(["Migrant Mother"]);

    await openFilters(page, search);
    await selectFilter(page, "Time period", "19th century");
    await done(page);
    await expect(resultTitles(search)).toHaveText(["The Great Wave off Kanagawa", "Noh Mask: Kojo"]);
    await openFilters(page, search);
    await fillYears(page, "1787", "1787");
    await expect(sheet(page).getByRole("combobox", { name: /^Time period\b/ })).toContainText("Custom range");
    await done(page);
    await expect(resultTitles(search)).toHaveText(["The Death of Socrates"]);

    await openFilters(page, search);
    await selectFilter(page, "Time period", "Any time");
    await expect(sheet(page).getByLabel("From year", { exact: true })).toBeEmpty();
    await expect(sheet(page).getByLabel("To year", { exact: true })).toBeEmpty();
    await done(page);
    await expect(search.getByRole("button", { name: "Filters", exact: true })).toHaveAttribute("data-active", "false");
    await expect(resultTitles(search).first()).toHaveText("The Death of Socrates");
  });

  await openFilters(page, search);
  await sheet(page).getByRole("button", { name: "Reset filters", exact: true }).click();
  await done(page);
  const allTitles = await resultTitles(search).allTextContents();

  await test.step("Searchable choices preserve draft selections on Back and cancel on dismissal", async () => {
    await openFilters(page, search);
    let country = await openChooser(page, "Country");
    await country.getByRole("combobox", { name: "Search countries", exact: true }).fill("no-such-country");
    await expect(country.getByRole("status")).toHaveText("No countries found");
    await country.getByRole("button", { name: "Back to filters", exact: true }).click();
    await expect(sheet(page).getByRole("button", { name: "Country: All countries", exact: true })).toBeFocused();

    country = await openChooser(page, "Country");
    await country.getByRole("combobox", { name: "Search countries", exact: true }).fill("jap");
    await country.getByRole("option", { name: "Japan", exact: true }).click();
    await expect(sheet(page).getByRole("button", { name: "Country: Japan", exact: true })).toBeFocused();
    // Filter sheets hold a draft; the retained gallery changes only after Done.
    expect(await resultTitles(search).allTextContents()).toEqual(allTitles);

    const artist = await openChooser(page, "Artist");
    await artist.getByRole("combobox", { name: "Search artists", exact: true }).fill("no-such-artist");
    await expect(artist.getByRole("status")).toHaveText("No artists found");
    await artist.getByRole("combobox", { name: "Search artists", exact: true }).press("Enter");
    await expect(artist).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(sheet(page)).toBeVisible();
    await expect(sheet(page).getByRole("button", { name: "Country: Japan", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(sheet(page)).toHaveCount(0);
    await expect(resultTitles(search)).toHaveText(allTitles);
    await openFilters(page, search);
    await expect(sheet(page).getByRole("button", { name: "Country: All countries", exact: true })).toBeVisible();
  });

  const country = await openChooser(page, "Country");
  await country.getByRole("combobox", { name: "Search countries", exact: true }).fill("jap");
  await country.getByRole("option", { name: "Japan", exact: true }).click();
  const artist = await openChooser(page, "Artist");
  await artist.getByRole("combobox", { name: "Search artists", exact: true }).fill("hoku");
  await artist.getByRole("combobox", { name: "Search artists", exact: true }).press("Enter");
  expect(await resultTitles(search).allTextContents()).toEqual(allTitles);
  await done(page);
  await expect(resultTitles(search)).toHaveText(["The Great Wave off Kanagawa"]);

  await openFilters(page, search);
  const selectedArtist = await openChooser(page, "Artist");
  await selectedArtist.getByRole("combobox", { name: "Search artists", exact: true }).fill("hoku");
  await expect(selectedArtist.getByRole("option", { name: "Katsushika Hokusai", exact: true })).toHaveAttribute("aria-selected", "true");
  await selectedArtist.getByRole("button", { name: "Back to filters", exact: true }).click();
  await sheet(page).getByRole("button", { name: "Reset filters", exact: true }).click();
  await expect(sheet(page).getByRole("button", { name: "Country: All countries", exact: true })).toBeVisible();
  await expect(sheet(page).getByRole("button", { name: "Artist: All artists", exact: true })).toBeVisible();
  await done(page);
  await expect(search.getByRole("button", { name: "Filters", exact: true })).toHaveAttribute("data-active", "false");
  await expect(resultTitles(search).first()).toHaveText("The Death of Socrates");
});

test("Library and folder contents filter actual saved works and keep the range after artwork Back", async ({ page }) => {
  await openApp(page);
  await nav(page, "Library").click();
  const library = page.locator(".library-retained-page");
  await openFilters(page, library);
  await fillYears(page, "1908", "1908");
  await done(page);
  await expect(resultTitles(library)).toHaveText(["The Kiss"]);
  await library.locator('[data-library-folder-id="board-default"]').click();
  await expect(resultTitles(library)).toHaveText(["The Divine Comedy", "Chart of Hell", "The Kiss"]);
  await openFilters(page, library);
  await fillYears(page, "1321", "1480");
  await done(page);
  await expect(resultTitles(library)).toHaveText(["The Divine Comedy", "Chart of Hell"]);
  const firstWork = library.locator('[data-piece-id="divine-comedy"]');
  await firstWork.click();
  await page.getByRole("button", { name: "Close story", exact: true }).click();
  await expect(firstWork).toBeFocused();
  await expect(resultTitles(library)).toHaveText(["The Divine Comedy", "Chart of Hell"]);
  await openFilters(page, library);
  await expect(sheet(page).getByLabel("From year", { exact: true })).toHaveValue("1321");
  await expect(sheet(page).getByLabel("To year", { exact: true })).toHaveValue("1480");
});

test("Home Search and creator artworks share date filters without borrowing another surface's range", async ({ page }) => {
  await openApp(page);
  const article = page.locator('.daily-slide[data-active="true"] .today-article');
  await article.getByRole("button", { name: "Search stories", exact: true }).click();
  const home = page.locator(".home-search-surface");
  await openFilters(page, home);
  await fillYears(page, "1321", "1480");
  await done(page);
  await expect(resultTitles(home)).toHaveText(["The Divine Comedy", "Chart of Hell"]);
  await home.getByRole("button", { name: "Close search", exact: true }).click();

  await article.getByRole("button", { name: "Open creator profile for Jacques-Louis David", exact: true }).last().click();
  const creator = page.locator(".creator-reference");
  await creator.getByRole("tab", { name: "Artworks", exact: true }).click();
  await openFilters(page, creator);
  await expect(sheet(page).getByLabel("From year", { exact: true })).toBeEmpty();
  await fillYears(page, "1800", "1900");
  await done(page);
  await expect(creator.locator(".creator-reference-artwork")).toHaveCount(0);
  await openFilters(page, creator);
  await fillYears(page, "1787", "1787");
  await done(page);
  await expect(creator.locator(".creator-reference-artwork")).toHaveCount(1);
  await expect(creator.locator(".creator-reference-artwork")).toContainText("The Death of Socrates");
});
