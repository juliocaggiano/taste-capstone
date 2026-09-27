import { expect, test, type Page } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const evidence = fileURLToPath(new URL("../../qa/explore-study-2026-09-23/", import.meta.url));
const variants = ["gallery-first", "collections-first", "compact-browse"] as const;
const expectedOrders = {
  "gallery-first": ["Gallery", "Collections", "Discover something new", "Explore by category"],
  "collections-first": ["Collections", "Gallery", "Discover something new", "Explore by category"],
  "compact-browse": ["Discover something new", "Gallery", "Collections", "Explore by category"],
};
const scope = (page: Page, name: string) => page.getByRole("radiogroup", { name: "Search filters", exact: true }).getByRole("radio", { name, exact: true });
const nav = (page: Page, name: string) => page.locator(".bottom-nav").getByRole("button", { name, exact: true });

test.beforeAll(async () => { await mkdir(evidence, { recursive: true }); });

async function observeStorage(page: Page) {
  await page.addInitScript(() => {
    const writes: string[] = [];
    Object.defineProperty(window, "__exploreWrites", { value: writes });
    Object.defineProperty(window, "__exploreBefore", { value: JSON.stringify(Object.entries(localStorage).sort()) });
    const setItem = Storage.prototype.setItem;
    const removeItem = Storage.prototype.removeItem;
    const clear = Storage.prototype.clear;
    Storage.prototype.setItem = function(key, value) {
      if (this === localStorage && key.startsWith("daily-culture")) writes.push(`set:${key}`);
      setItem.call(this, key, value);
    };
    Storage.prototype.removeItem = function(key) {
      if (this === localStorage && key.startsWith("daily-culture")) writes.push(`remove:${key}`);
      removeItem.call(this, key);
    };
    Storage.prototype.clear = function() {
      if (this === localStorage) writes.push("clear");
      clear.call(this);
    };
  });
}

async function storageCheck(page: Page) {
  const result = await page.evaluate(() => {
    const tracked = window as unknown as { __exploreWrites: string[]; __exploreBefore: string };
    return { writes: tracked.__exploreWrites, before: tracked.__exploreBefore, after: JSON.stringify(Object.entries(localStorage).sort()) };
  });
  expect(result.writes).toEqual([]);
  expect(result.after).toBe(result.before);
  return result;
}

async function layoutSnapshot(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".discover-gallery").scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator(".discover-artwork-card img").evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  return page.locator(".discover-page").evaluate(element => {
    const measure = (selector: string, properties: string[]) => {
      const target = element.querySelector<HTMLElement>(selector)!;
      const style = getComputedStyle(target);
      return { width: target.offsetWidth, height: target.offsetHeight, ...Object.fromEntries(properties.map(property => [property, style.getPropertyValue(property)])) };
    };
    const common = ["padding", "margin", "gap", "border-radius", "font-size", "line-height", "color", "background-color"];
    return {
      order: Array.from(element.querySelectorAll(":scope > section")).map(section => section.querySelector("h2")!.textContent),
      categoryHtml: element.querySelector(".discover-categories")!.innerHTML,
      categories: measure(".discover-category-grid", [...common, "grid-template-columns"]),
      categoryCard: measure(".discover-category-card", common),
      categoryImage: measure(".discover-category-card img", ["object-fit", "border-radius"]),
      categoryLabel: measure(".discover-category-card span", common),
      search: measure(".discover-search", common),
      searchInput: measure(".discover-search input", common),
      searchIcon: measure(".discover-search > svg", []),
      scopes: measure(".discover-field-selection", common),
      gallery: measure(".discover-gallery-grid", ["gap", "grid-template-columns"]),
    };
  });
}

test("Explore studies change section order while retaining baseline search and category geometry", async ({ page }) => {
  await page.goto("/");
  await nav(page, "Search").click();
  await expect(page.locator(".discover-page")).not.toHaveAttribute("data-explore-variant");
  const baseline = await layoutSnapshot(page);
  expect(baseline.order).toEqual(["Collections", "Discover something new", "Gallery", "Explore by category"]);
  await observeStorage(page);
  const measurements: Record<string, unknown> = { baseline };
  for (const variant of variants) {
    await page.goto(`/?explore-study=${variant}`);
    await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-tab", "search");
    await expect(page.locator(".discover-page")).toHaveAttribute("data-explore-variant", variant);
    const snapshot = await layoutSnapshot(page);
    expect(snapshot.order).toEqual(expectedOrders[variant]);
    const { order: _baselineOrder, ...baselineShared } = baseline;
    const { order: _studyOrder, ...studyShared } = snapshot;
    expect(studyShared).toEqual(baselineShared);
    measurements[variant] = { ...snapshot, storage: await storageCheck(page) };
  }
  await writeFile(`${evidence}/layout-measurements.json`, JSON.stringify(measurements, null, 2));
});

test("Study collection returns and edits leave all persistent data untouched", async ({ page }) => {
  await observeStorage(page);
  await page.goto("/?explore-study=gallery-first");
  const collection = page.locator(".explore-collection-card").first();
  await collection.scrollIntoViewIfNeeded();
  const searchScroll = page.locator(".discover-retained-page .mobile-scroll");
  const sourcePosition = await searchScroll.evaluate(element => element.scrollTop);
  const collectionTitle = await collection.locator("strong").innerText();
  await collection.click();
  await expect(page.locator(".collection-hero-copy h1")).toHaveText(collectionTitle);
  await page.locator(".collection-actions [aria-pressed]").click();
  const work = page.locator(".collection-piece").first();
  const workTitle = await work.locator("strong").innerText();
  await work.click();
  const detail = page.locator('[data-reading-view="detail"]');
  await expect(detail.locator(".today-title-row h1")).toHaveText(workTitle);
  const save = detail.locator(".today-save-primary");
  const initial = await save.getAttribute("aria-pressed");
  await save.click();
  await expect(save).toHaveAttribute("aria-pressed", initial === "true" ? "false" : "true");
  await detail.getByRole("button", { name: "Choose folder", exact: true }).click();
  await detail.getByRole("button", { name: "New folder", exact: true }).click();
  const sheet = page.getByTestId("bottom-sheet");
  await sheet.getByRole("textbox", { name: "Folder name", exact: true }).fill("Temporary Explore folder");
  await sheet.getByRole("button", { name: "Create", exact: true }).click();
  await expect(sheet).toHaveCount(0);
  await page.getByRole("button", { name: "Close story", exact: true }).click();
  await expect(page.locator(".collection-hero-copy h1")).toHaveText(collectionTitle);
  await expect(work).toBeFocused();
  await page.getByRole("button", { name: "Close collection", exact: true }).click();
  await expect(collection).toBeFocused();
  expect(await searchScroll.evaluate(element => element.scrollTop)).toBeCloseTo(sourcePosition, 1);

  await scope(page, "Artists").click();
  await page.locator(".discover-search input").fill("David");
  const artistSave = page.locator(".search-artist-row [aria-pressed]");
  await artistSave.click();
  await expect(artistSave).toHaveAttribute("aria-pressed", "true");
  await scope(page, "Accounts").click();
  await page.locator(".discover-search input").fill("Mara Vale");
  const follow = page.locator(".search-account-row [aria-pressed]");
  await follow.click();
  await expect(follow).toHaveAttribute("aria-pressed", "true");

  await nav(page, "Library").click();
  await page.locator(".library-work-card").filter({ hasText: workTitle }).click();
  await detail.getByRole("button", { name: "Edit", exact: true }).click();
  await sheet.getByRole("textbox", { name: "Personal note", exact: true }).fill("Temporary Explore note");
  await sheet.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(sheet).toHaveCount(0);
  await expect(detail.locator(".library-personal-note")).toContainText("Temporary Explore note");
  await page.getByRole("button", { name: "Close story", exact: true }).click();
  await nav(page, "Settings").click();
  await page.getByRole("radiogroup", { name: "Theme", exact: true }).getByRole("radio", { name: "Dark", exact: true }).click();
  await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-theme", "dark");
  const dividers = await page.locator(".settings-page").evaluate(element => ({
    themeBorder: getComputedStyle(element.querySelector(".settings-preferences > :last-child")!).borderBottomWidth,
    secondaryBorder: getComputedStyle(element.querySelector(".settings-secondary-menu")!).borderTopColor,
    secondaryGap: getComputedStyle(element.querySelector(".settings-secondary-menu")!).marginTop,
  }));
  expect(dividers).toEqual({ themeBorder: "1px", secondaryBorder: "rgba(0, 0, 0, 0)", secondaryGap: "30px" });
  await writeFile(`${evidence}/temporary-storage-and-settings.json`, JSON.stringify({ storage: await storageCheck(page), dividers }, null, 2));
});

test("Comparison controls work at desktop and narrow widths with keyboard tabs", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await observeStorage(page);
  await page.goto("/explore-saved.html");
  await expect(page.locator(".variant:visible")).toHaveCount(3);
  for (const variant of variants) {
    await expect(page.locator(`#${variant}-card [data-action="top"]`)).toBeEnabled();
    await expect(page.frameLocator(`#${variant}-card iframe`).locator(".discover-page")).toHaveAttribute("data-explore-variant", variant);
  }
  await page.getByRole("button", { name: "Dark", exact: true }).click();
  for (const variant of variants) {
    await expect(page.frameLocator(`#${variant}-card iframe`).locator(".daily-culture-app")).toHaveAttribute("data-theme", "dark");
  }
  const card = page.locator("#compact-browse-card");
  const frame = page.frameLocator("#compact-browse-card iframe");
  await card.getByRole("button", { name: "Categories", exact: true }).click();
  await expect(frame.locator("#discover-categories-title")).toBeInViewport();
  await card.getByRole("button", { name: "Gallery", exact: true }).click();
  await expect(frame.locator("#discover-gallery-title")).toBeInViewport();
  await card.getByRole("button", { name: "Top", exact: true }).click();
  await expect.poll(() => frame.locator(".discover-retained-page .mobile-scroll").evaluate(element => element.scrollTop)).toBe(0);
  await frame.locator(".discover-search input").fill("David");
  await card.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(frame.locator(".discover-search input")).toHaveValue("");
  await expect(frame.locator(".daily-culture-app")).toHaveAttribute("data-theme", "dark");
  await page.screenshot({ path: `${evidence}/comparison-desktop.png` });

  await page.setViewportSize({ width: 500, height: 1000 });
  const tabs = page.getByRole("tablist", { name: "Choose an Explore variation", exact: true });
  await expect(page.locator(".variant:visible")).toHaveCount(1);
  await tabs.getByRole("tab", { name: "01 Gallery first", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: "02 Collections first", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#collections-first-card")).toBeVisible();
  await page.keyboard.press("End");
  await expect(tabs.getByRole("tab", { name: "03 Compact browse", exact: true })).toHaveAttribute("aria-selected", "true");
  await card.getByRole("button", { name: "Categories", exact: true }).click();
  await expect(frame.locator("#discover-categories-title")).toBeInViewport();
  const overflow = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }));
  expect(overflow.content).toBeLessThanOrEqual(overflow.width);
  await page.screenshot({ path: `${evidence}/comparison-narrow.png`, fullPage: true });
  const writes = await Promise.all(page.frames().map(child => child.evaluate(() => (window as unknown as { __exploreWrites: string[] }).__exploreWrites)));
  expect(writes.flat()).toEqual([]);
  expect(errors).toEqual([]);
  await writeFile(`${evidence}/comparison-controls.json`, JSON.stringify({ overflow, writes, errors }, null, 2));
});
