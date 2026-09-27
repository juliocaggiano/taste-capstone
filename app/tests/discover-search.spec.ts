import { expect, test, type Page } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const evidence = fileURLToPath(new URL("../../qa/discover-search-2026-09-23/", import.meta.url));
const navigationEvidence = fileURLToPath(new URL("../../qa/dark-system-2026-09-23/", import.meta.url));
const field = (page: Page) => page.locator(".discover-search input");
const filters = (page: Page) => page.getByRole("radiogroup", { name: "Search filters", exact: true });
const cards = (page: Page) => page.locator(".discover-artwork-card");

test.beforeAll(async () => {
  await mkdir(evidence, { recursive: true });
  await mkdir(navigationEvidence, { recursive: true });
});

async function openDiscover(page: Page) {
  await page.locator(".bottom-nav").getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-tab", "search");
  await expect(page.locator(".discover-filter-rail, .discover-filter-track, .discover-filter")).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
}

async function fieldGeometry(page: Page, height: 32 | 44) {
  await expect(page.locator(".discover-search")).toHaveCSS("height", `${height}px`);
  await expect(field(page)).toHaveCSS("font-size", "14px");
  await expect(page.locator(".discover-search > svg")).toHaveCSS("width", "16px");
  await expect(page.locator(".discover-search > svg")).toHaveCSS("height", "16px");
  if (await page.locator(".discover-search button").count()) {
    await expect(page.locator(".discover-search button > svg")).toHaveCSS("width", "16px");
    await expect(page.locator(".discover-search button > svg")).toHaveCSS("height", "16px");
  }
  return page.locator(".discover-search").evaluate(element => {
    const screen = element.closest<HTMLElement>("[data-phone-screen]")!;
    const scale = screen.getBoundingClientRect().width / screen.offsetWidth;
    const box = element.getBoundingClientRect();
    return { width: box.width / scale, height: box.height / scale, fontSize: getComputedStyle(element.querySelector("input")!).fontSize };
  });
}

async function expectSocrates(page: Page) {
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).locator("strong")).toHaveText("The Death of Socrates");
}

async function capture(page: Page, name: string) {
  await page.locator(".discover-gallery").focus();
  await expect(page.locator(".keyboard-dock")).toHaveAttribute("data-visible", "false");
  await page.locator(".discover-page").evaluate(element => {
    element.closest<HTMLElement>(".mobile-scroll")!.scrollTop = 0;
  });
  await expect.poll(() => filters(page).evaluate(group => {
    const selected = group.querySelector<HTMLElement>('[aria-checked="true"]')!;
    const indicator = group.querySelector<HTMLElement>(".dc-selection-indicator")!;
    const style = getComputedStyle(indicator);
    return Math.abs(new DOMMatrixReadOnly(style.transform).m41 - selected.offsetLeft) < .1
      && Math.abs(parseFloat(style.width) - selected.offsetWidth) < .1;
  })).toBe(true);
  await page.mouse.move(10, 10);
  await page.getByTestId("phone-frame").screenshot({ path: `${evidence}/${name}.png` });
}

test("iPhone Search clears hidden categories and preserves artwork query and field geometry", async ({ page }) => {
  await page.goto("/");
  await openDiscover(page);
  const empty = await fieldGeometry(page, 32);
  const initialCount = await cards(page).count();
  expect(initialCount).toBeGreaterThan(6);

  await page.locator(".discover-category-card").filter({ hasText: /^Literature$/ }).click();
  await expect(cards(page).locator("strong")).toHaveText("The Divine Comedy");
  await field(page).fill("David");
  await expect(field(page)).toBeFocused();
  await expectSocrates(page);
  const typed = await fieldGeometry(page, 32);
  expect(typed.height).toBe(empty.height);
  await expect(filters(page).getByRole("radio")).toHaveText(["Artworks", "Artists", "Accounts", "Medium"]);
  await expect(filters(page).getByRole("radio", { name: "Artworks", exact: true })).toHaveAttribute("aria-checked", "true");
  await expect(page.locator(".discover-medium-selection")).toHaveCount(0);
  await capture(page, "iphone-light-search");

  await cards(page).click();
  await expect(page.locator('[data-reading-view="detail"] .today-title-row h1')).toHaveText("The Death of Socrates");
  await page.getByRole("button", { name: "Close story", exact: true }).click();
  await expect(field(page)).toHaveValue("David");
  await expect(filters(page).getByRole("radio", { name: "Artworks", exact: true })).toHaveAttribute("aria-checked", "true");
  await expectSocrates(page);
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(field(page)).toHaveValue("");
  await expect(page.locator(".discover-featured, .discover-categories")).toHaveCount(2);
  await expect(cards(page)).toHaveCount(initialCount);
  await expect(filters(page).getByRole("radio")).toHaveText(["Artworks", "Artists", "Accounts", "Medium"]);
  await expect(filters(page).getByRole("radio", { name: "Artworks", exact: true })).toHaveAttribute("aria-checked", "true");
  await fieldGeometry(page, 32);
  await writeFile(`${evidence}/iphone-field-geometry.json`, JSON.stringify({ empty, typed }, null, 2));
});

test.describe("coarse pointer", () => {
  test.use({ hasTouch: true });
  test("Pixel dark Search keeps its 44px field before and after typing", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("daily-culture.preferences.v1", JSON.stringify({ theme: "dark", locale: "en" })));
    await page.goto("/");
    await page.getByTestId("device-picker").click();
    await page.getByTestId("device-option-pixel-10").click();
    await openDiscover(page);
    await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-theme", "dark");
    expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);
    const empty = await fieldGeometry(page, 44);
    await field(page).fill("Painting");
    const typed = await fieldGeometry(page, 44);
    expect(typed.height).toBe(empty.height);
    await filters(page).getByRole("radio", { name: "Medium", exact: true }).tap();
    await expect(filters(page).getByRole("radio", { name: "Medium", exact: true })).toHaveAttribute("aria-checked", "true");
    await page.locator(".discover-medium-selection").getByRole("radio", { name: "Painting", exact: true }).tap();
    await expect(cards(page)).toHaveCount(3);
    await expect(page.locator(".discover-search button")).toHaveCSS("width", "44px");
    await expect(page.locator(".discover-search button")).toHaveCSS("height", "44px");
    await capture(page, "pixel-dark-search");
    const geometry = await page.locator(".discover-tools").evaluate(element => {
      const screen = element.closest<HTMLElement>("[data-phone-screen]")!;
      const screenBox = screen.getBoundingClientRect();
      const bounds = element.getBoundingClientRect();
      const input = element.querySelector("input")!;
      const background = element.querySelector(".discover-search")!;
      return { left: bounds.left, right: bounds.right, screenLeft: screenBox.left, screenRight: screenBox.right, color: getComputedStyle(input).color, background: getComputedStyle(background).backgroundColor };
    });
    expect(geometry.left).toBeGreaterThanOrEqual(geometry.screenLeft);
    expect(geometry.right).toBeLessThanOrEqual(geometry.screenRight);
    expect(geometry.color).not.toBe(geometry.background);
    await page.getByRole("button", { name: "Clear search", exact: true }).tap();
    await fieldGeometry(page, 44);
    await expect(filters(page).getByRole("radio", { name: "Medium", exact: true })).toHaveAttribute("aria-checked", "true");
    await expect(page.locator(".discover-medium-selection").getByRole("radio", { name: "Painting", exact: true })).toHaveAttribute("aria-checked", "true");
    await filters(page).getByRole("radio", { name: "Artworks", exact: true }).tap();
    await expect(page.locator(".discover-featured")).toBeVisible();
    await writeFile(`${evidence}/pixel-field-geometry.json`, JSON.stringify({ empty, typed, geometry }, null, 2));
  });
});

test("Artist results open profiles and retain their query and scope on return", async ({ page }) => {
  await page.goto("/");
  await openDiscover(page);
  await expect(filters(page).getByRole("radio")).toHaveText(["Artworks", "Artists", "Accounts", "Medium"]);
  await field(page).fill("David");
  await filters(page).getByRole("radio", { name: "Artists", exact: true }).click();
  const artist = page.locator(".search-artist-row");
  await expect(artist).toHaveCount(1);
  await expect(artist.locator(".search-entity-name")).toHaveText("Jacques-Louis David");
  await expect(cards(page)).toHaveCount(0);
  await expect(page.locator(".discover-medium-selection")).toHaveCount(0);
  const trigger = artist.locator(".search-artist-open");
  await trigger.click();
  await expect(page.locator("#creator-profile-title")).toHaveText("Jacques-Louis David");
  await page.getByRole("button", { name: "Close creator profile", exact: true }).click();
  await expect(page.locator(".creator-page-transition")).toHaveCount(0);
  await expect(field(page)).toHaveValue("David");
  await expect(filters(page).getByRole("radio", { name: "Artists", exact: true })).toHaveAttribute("aria-checked", "true");
  await expect(trigger).toBeFocused();
});

test("Accounts support following and Medium isolates artworks without leaking its filter", async ({ page }) => {
  await page.goto("/");
  await openDiscover(page);
  await filters(page).getByRole("radio", { name: "Accounts", exact: true }).click();
  await field(page).fill("Mara");
  await expect(page.locator(".search-account-row")).toHaveCount(5);
  const account = page.locator('.search-account-row[data-person-id="sample-person-1"]');
  await expect(account).toHaveCount(1);
  await expect(account.locator(".search-entity-name")).toHaveText("Mara Vale");
  const follow = account.getByRole("button", { name: "Follow Mara Vale", exact: true });
  await follow.click();
  await expect(account.getByRole("button", { name: "Following Mara Vale. Unfollow", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".search-accounts-note")).toHaveText("Sample profiles");
  await expect(page.locator(".discover-medium-selection")).toHaveCount(0);

  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await filters(page).getByRole("radio", { name: "Medium", exact: true }).click();
  await page.locator(".discover-medium-selection").getByRole("radio", { name: "Photography", exact: true }).click();
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).locator("strong")).toHaveText("Migrant Mother");
  await filters(page).getByRole("radio", { name: "Accounts", exact: true }).click();
  await field(page).fill("Mara");
  await expect(page.locator(".search-account-row").getByRole("button", { name: "Following Mara Vale. Unfollow", exact: true })).toHaveAttribute("aria-pressed", "true");

  await field(page).fill("zzqvnotarealresult");
  for (const scope of ["Artworks", "Artists", "Accounts", "Medium"]) {
    await filters(page).getByRole("radio", { name: scope, exact: true }).click();
    await expect(page.locator(".discover-empty")).toBeVisible();
    await expect(page.locator(".discover-results-status")).toContainText("0 results");
    await expect(page.locator(".discover-gallery").getByRole("button", { name: "Show all", exact: true })).toHaveCount(0);
    await expect(page.locator(".discover-artwork-card, .search-artist-row, .search-account-row")).toHaveCount(0);
  }
});

test("Discover shortcuts return to their source with Back or Escape", async ({ page }) => {
  await page.goto("/");
  await openDiscover(page);
  const browseScroll = page.locator(".discover-retained-page .mobile-scroll");
  const loved = page.locator('[data-discover-selection="loved"]');
  await loved.scrollIntoViewIfNeeded();
  const start = await browseScroll.evaluate(element => element.scrollTop);
  await loved.click();
  const back = page.getByRole("button", { name: "Back to Search", exact: true });
  await expect(back).toBeInViewport();
  await expect(page.locator("#discover-gallery-title")).toHaveText("Most loved");
  await expect(page.locator(".discover-new")).toHaveCount(0);
  await page.mouse.move(10, 10);
  await page.getByTestId("phone-frame").screenshot({ path: `${navigationEvidence}/most-loved-back.png` });
  const selectedWork = cards(page).first();
  const expectedTitle = await selectedWork.locator("strong").innerText();
  const galleryPosition = await browseScroll.evaluate(element => element.scrollTop);
  const retained = await page.locator(".discover-page").elementHandle();
  await selectedWork.click();
  await expect(page.locator('[data-reading-view="detail"] .today-title-row h1')).toHaveText(expectedTitle);
  await expect(page.locator(".discover-retained-page")).toHaveAttribute("inert", "");
  await expect(page.locator(".discover-retained-page")).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator(".discover-retained-page .discover-back")).toBeHidden();
  expect(await retained!.evaluate(element => element.isConnected)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.locator('[data-reading-view="detail"]')).toHaveCount(0);
  await expect(selectedWork).toBeFocused();
  expect(await browseScroll.evaluate(element => element.scrollTop)).toBeCloseTo(galleryPosition, 1);
  await back.click();
  await expect(loved).toBeFocused();
  expect(await browseScroll.evaluate(element => element.scrollTop)).toBeCloseTo(start, 1);

  const literature = page.locator(".discover-category-card").filter({ hasText: /^Literature$/ });
  await literature.scrollIntoViewIfNeeded();
  const categoryPosition = await browseScroll.evaluate(element => element.scrollTop);
  await literature.click();
  await expect(page.locator("#discover-gallery-title")).toHaveText("Literature");
  await expect(back).toBeInViewport();
  await page.keyboard.press("Escape");
  await expect(literature).toBeFocused();
  expect(await browseScroll.evaluate(element => element.scrollTop)).toBeCloseTo(categoryPosition, 1);
});

test("Cultural categories retain empty and populated return paths independently from Medium", async ({ page }) => {
  await page.goto("/");
  await openDiscover(page);
  const categories = page.locator(".discover-category-card");
  await expect(categories).toHaveCount(7);
  const categoryLabels = (await categories.allTextContents()).map(label => label.trim()).sort();
  expect(categoryLabels).toEqual(["Painting", "Music", "Cinema", "Literature", "Architecture", "Sculpture", "Theater"].sort());
  const browseScroll = page.locator(".discover-retained-page .mobile-scroll");
  const music = categories.filter({ hasText: /^Music$/ });
  await music.scrollIntoViewIfNeeded();
  const sourcePosition = await browseScroll.evaluate(element => element.scrollTop);
  const back = page.getByRole("button", { name: "Back to Search", exact: true });

  await music.click();
  await expect(page.locator("#discover-gallery-title")).toHaveText("Music");
  await expect(cards(page)).toHaveCount(0);
  await expect(page.locator(".discover-empty")).toBeVisible();
  await expect(back).toBeInViewport();
  await back.click();
  await expect(music).toBeFocused();
  expect(await browseScroll.evaluate(element => element.scrollTop)).toBeCloseTo(sourcePosition, 1);
  await music.click();
  await expect(page.locator("#discover-gallery-title")).toHaveText("Music");
  await page.keyboard.press("Escape");
  await expect(music).toBeFocused();
  expect(await browseScroll.evaluate(element => element.scrollTop)).toBeCloseTo(sourcePosition, 1);

  const cinema = categories.filter({ hasText: /^Cinema$/ });
  await cinema.click();
  await expect(page.locator("#discover-gallery-title")).toHaveText("Cinema");
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).locator("strong")).toHaveText("The Cabinet of Dr. Caligari");
  await cards(page).click();
  await expect(page.locator('[data-reading-view="detail"] .today-title-row h1')).toHaveText("The Cabinet of Dr. Caligari");
  await page.getByRole("button", { name: "Close story", exact: true }).click();
  await expect(page.locator("#discover-gallery-title")).toHaveText("Cinema");
  await expect(cards(page)).toBeFocused();
  await back.click();
  await expect(cinema).toBeFocused();

  await filters(page).getByRole("radio", { name: "Medium", exact: true }).click();
  await page.locator(".discover-medium-selection").getByRole("radio", { name: "Print", exact: true }).click();
  await expect(cards(page)).toHaveCount(1);
  await expect(cards(page).locator("strong")).toHaveText("The Great Wave off Kanagawa");
  await expect(filters(page).getByRole("radio", { name: "Medium", exact: true })).toHaveAttribute("aria-checked", "true");
  await expect(categories).toHaveCount(0);
});

test("Search collection drilldown returns one level at a time and retains queries", async ({ page }) => {
  await page.goto("/");
  await openDiscover(page);
  const browseScroll = page.locator(".discover-retained-page .mobile-scroll");
  const collectionCard = page.locator(".discover-collection-card").first();
  const collectionTitle = await collectionCard.locator("strong").innerText();
  const searchPosition = await browseScroll.evaluate(element => element.scrollTop);
  await collectionCard.click();
  await expect(page.locator(".collection-hero-copy h1")).toHaveText(collectionTitle);
  await expect(page.getByRole("button", { name: "Close collection", exact: true })).toBeInViewport();
  await expect(page.locator(".discover-retained-page")).toHaveAttribute("inert", "");
  const collectionScroll = page.locator(".collection-retained-page .mobile-scroll");
  const piece = page.locator(".collection-piece").first();
  await piece.scrollIntoViewIfNeeded();
  const collectionPosition = await collectionScroll.evaluate(element => element.scrollTop);
  const pieceTitle = await piece.locator("strong").innerText();
  await piece.click();
  await expect(page.locator('[data-reading-view="detail"] .today-title-row h1')).toHaveText(pieceTitle);
  await expect(page.locator(".collection-retained-page")).toHaveAttribute("inert", "");
  await expect(page.locator(".collection-retained-page")).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator(".collection-detail")).toBeHidden();
  await page.getByRole("button", { name: "Close story", exact: true }).click();
  await expect(page.locator(".collection-detail")).toBeVisible();
  await expect(piece).toBeFocused();
  expect(await collectionScroll.evaluate(element => element.scrollTop)).toBeCloseTo(collectionPosition, 1);
  await page.keyboard.press("Escape");
  await expect(page.locator(".collection-detail")).toHaveCount(0);
  await expect(collectionCard).toBeFocused();
  expect(await browseScroll.evaluate(element => element.scrollTop)).toBeCloseTo(searchPosition, 1);

  await field(page).fill("David");
  await filters(page).getByRole("radio", { name: "Artworks", exact: true }).click();
  await expectSocrates(page);
  await cards(page).click();
  await expect(page.locator('[data-reading-view="detail"]')).toBeVisible();
  await page.getByRole("button", { name: "Close story", exact: true }).click();
  await expect(field(page)).toHaveValue("David");
  await expect(filters(page).getByRole("radio", { name: "Artworks", exact: true })).toHaveAttribute("aria-checked", "true");
  await expectSocrates(page);
  await expect(cards(page)).toBeFocused();
  await expect(page.locator(".discover-retained-page")).not.toHaveAttribute("inert");
});
