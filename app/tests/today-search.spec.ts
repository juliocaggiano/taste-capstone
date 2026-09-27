import { expect, test, type Page } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const evidence = fileURLToPath(new URL("../../qa/today-search-2026-09-23/", import.meta.url));
const variants = ["inline", "focus", "sheet"] as const;
type Variant = typeof variants[number];
const article = (page: Page) => page.locator('.daily-slide[data-active="true"] .today-article');
const trigger = (page: Page) => article(page).getByRole("button", { name: "Search stories", exact: true });
const field = (page: Page) => page.locator(".today-search-form input");
const search = (page: Page) => page.locator(".today-home-search, .today-home-search-sheet");
const keyboard = (page: Page) => page.locator(".keyboard-dock");

test.beforeAll(async () => { await mkdir(evidence, { recursive: true }); });

async function observeStudyStorage(page: Page) {
  await page.addInitScript(() => {
    const writes: string[] = [];
    Object.defineProperty(window, "__searchStudyWrites", { value: writes });
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (this === localStorage && /daily-culture|taste/i.test(key)) writes.push(key);
      original.call(this, key, value);
    };
  });
}

async function expectNoStudyWrites(page: Page) {
  expect(await page.evaluate(() => (window as unknown as { __searchStudyWrites: string[] }).__searchStudyWrites)).toEqual([]);
}

async function openStudy(page: Page, variant: Variant) {
  await observeStudyStorage(page);
  await page.goto(`/?today-search-study=${variant}`);
  await expect(article(page)).toHaveAttribute("data-piece-id", "death-of-socrates");
  await page.evaluate(() => document.fonts.ready);
}

async function expectSearchOpen(page: Page, variant: Variant, returning = false) {
  await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-tab", "daily");
  await expect(search(page)).toHaveAttribute("data-variant", variant);
  if (returning && variant !== "sheet") {
    await expect(page.locator(".today-search-result:focus")).toHaveCount(1);
    await expect(keyboard(page)).toHaveAttribute("data-visible", "false");
  } else {
    await expect(field(page)).toBeFocused();
    await expect(keyboard(page)).toHaveAttribute("data-visible", "true");
  }
  await expect(page.locator(".bottom-nav")).toHaveCount(0);
  if (variant === "sheet") {
    await expect(page.getByTestId("bottom-sheet")).toHaveCSS("transform", "none");
  } else {
    await expect(page.locator(".today-search-expanded-field")).toHaveCSS("height", "44px");
    await expect.poll(() => page.locator(".today-search-expanded-field").evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(200);
    await expect(page.locator(".today-search-results-panel")).toHaveCSS("opacity", "1");
  }
}

async function expectClosed(page: Page) {
  await expect(search(page)).toHaveCount(0);
  await expect(keyboard(page)).toHaveAttribute("data-visible", "false");
  await expect(trigger(page)).toBeFocused();
  await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-tab", "daily");
}

async function expectKeyboardExposed(page: Page) {
  await expect(keyboard(page)).toHaveCSS("transform", "none");
  const geometry = await page.locator(".today-home-search").evaluate(root => {
    const dock = document.querySelector<HTMLElement>('.keyboard-dock[data-visible="true"]')!;
    const screen = root.closest<HTMLElement>("[data-phone-screen]")!;
    const dockBounds = dock.getBoundingClientRect();
    const point = { x: dockBounds.x + dockBounds.width / 2, y: dockBounds.y + dockBounds.height / 2 };
    const top = document.elementFromPoint(point.x, point.y);
    return {
      searchBottom: root.getBoundingClientRect().bottom,
      keyboardTop: dockBounds.top,
      scale: screen.getBoundingClientRect().width / screen.offsetWidth,
      keyboardAtPoint: Boolean(top?.closest(".keyboard-dock")),
      searchAtPoint: document.elementsFromPoint(point.x, point.y).some(element => element.closest(".today-home-search")),
    };
  });
  expect(geometry.searchBottom).toBeLessThanOrEqual(geometry.keyboardTop + 2 * geometry.scale);
  expect(geometry.keyboardAtPoint).toBe(true);
  expect(geometry.searchAtPoint).toBe(false);
  return geometry;
}

for (const variant of variants) {
  test(`${variant}: Today search filters, returns from an artwork, and restores its edition`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await openStudy(page, variant);
    await page.locator(".daily-screen").focus();
    await page.keyboard.press("ArrowRight");
    await expect(article(page)).toHaveAttribute("data-piece-id", "divine-comedy");
    const retained = await page.locator(".daily-screen").elementHandle();
    const dailyScroll = page.locator(".daily-scroll > .mobile-scroll");
    const beforeScroll = await dailyScroll.evaluate(element => element.scrollTop);
    await trigger(page).click();
    await expectSearchOpen(page, variant);

    await field(page).fill("David");
    await expect(page.locator(".today-search-result")).toHaveCount(1);
    await expect(page.locator(".today-search-result strong")).toHaveText("The Death of Socrates");
    await field(page).press("ArrowLeft");
    await expect(article(page)).toHaveAttribute("data-piece-id", "divine-comedy");
    if (variant !== "sheet") {
      const geometry = await expectKeyboardExposed(page);
      await writeFile(`${evidence}/${variant}-keyboard-exposure.json`, JSON.stringify(geometry, null, 2));
    }
    await page.getByTestId("phone-frame").screenshot({ path: `${evidence}/${variant}-iphone-results.png` });

    await field(page).fill("qzx-no-such-work");
    await expect(page.locator(".today-search-empty")).toContainText("No works found");
    await expect(page.locator(".today-search-result")).toHaveCount(0);
    await page.getByRole("button", { name: "Clear search", exact: true }).click();
    await expect(field(page)).toHaveValue("");
    await expect(field(page)).toBeFocused();
    await expect(page.locator(".today-search-result")).toHaveCount(4);
    await field(page).fill("David");
    await page.locator(".today-search-result").click();
    await expect(page.getByRole("button", { name: "Close story", exact: true })).toBeVisible();
    await expect(search(page)).toHaveCount(0);
    await expect(keyboard(page)).toHaveAttribute("data-visible", "false");
    expect(await retained!.evaluate(element => element.isConnected)).toBe(true);

    await page.getByRole("button", { name: "Close story", exact: true }).click();
    await expectSearchOpen(page, variant, true);
    await expect(field(page)).toHaveValue("David");
    await expect(page.locator(".today-search-result strong")).toHaveText("The Death of Socrates");
    await page.getByRole("button", { name: "Close search", exact: true }).click();
    await expectClosed(page);
    await expect(article(page)).toHaveAttribute("data-piece-id", "divine-comedy");
    expect(await dailyScroll.evaluate(element => element.scrollTop)).toBe(beforeScroll);

    await trigger(page).click();
    await expectSearchOpen(page, variant);
    await page.keyboard.press("Escape");
    await expectClosed(page);
    await expectNoStudyWrites(page);
    if (variant !== "sheet") {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.reload();
      await expect(trigger(page)).toBeVisible();
      await trigger(page).focus();
      const openingFrames = await trigger(page).evaluate(async button => {
        (button as HTMLButtonElement).click();
        const frames: { width: number; height: number; expected: number }[] = [];
        for (let index = 0; index < 3; index += 1) {
          await new Promise(requestAnimationFrame);
          const expanded = document.querySelector<HTMLElement>(".today-search-expanded-field")!;
          const screen = expanded.closest<HTMLElement>("[data-phone-screen]")!;
          frames.push({ width: parseFloat(getComputedStyle(expanded).width), height: parseFloat(getComputedStyle(expanded).height), expected: screen.offsetWidth - 16 });
        }
        return frames;
      });
      expect(openingFrames.every(frame => frame.height === 44 && Math.abs(frame.width - frame.expected) < .01)).toBe(true);
      await expectSearchOpen(page, variant);
      await field(page).fill("David");
      await expectKeyboardExposed(page);
      await page.keyboard.press("Escape");
      await expectClosed(page);
      await expectNoStudyWrites(page);
    }
    expect(errors).toEqual([]);
  });
}

test("bottom Search keeps its own query and study actions stay temporary", async ({ page }) => {
  await openStudy(page, "inline");
  const nav = page.locator(".bottom-nav");
  await nav.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-tab", "search");
  const discoverField = page.locator(".discover-search input");
  await discoverField.fill("Japan");
  await discoverField.press("Enter");
  await expect(keyboard(page)).toHaveAttribute("data-visible", "false");
  await nav.getByRole("button", { name: "Daily", exact: true }).click();
  await article(page).locator(".today-save-primary").click();
  await trigger(page).click();
  await expectSearchOpen(page, "inline");
  await expect(field(page)).toHaveValue("");
  await field(page).fill("David");
  await page.keyboard.press("Escape");
  await expectClosed(page);
  await nav.getByRole("button", { name: "Search", exact: true }).click();
  await expect(discoverField).toHaveValue("Japan");
  await expectNoStudyWrites(page);
});

test("opening a study search while reading retains the exact Today scroll position", async ({ page }) => {
  await openStudy(page, "focus");
  const scroll = page.locator(".daily-scroll > .mobile-scroll");
  await scroll.evaluate(element => { element.scrollTop = 240; });
  const before = await scroll.evaluate(element => element.scrollTop);
  expect(before).toBe(240);
  await page.evaluate(() => window.postMessage({ type: "daily-culture-today-search-command", action: "open", variant: "focus" }, location.origin));
  await expectSearchOpen(page, "focus");
  await field(page).fill("David");
  await page.locator(".today-search-result").click();
  await page.getByRole("button", { name: "Close story", exact: true }).click();
  await expectSearchOpen(page, "focus", true);
  await page.keyboard.press("Escape");
  await expectClosed(page);
  expect(await scroll.evaluate(element => element.scrollTop)).toBe(before);
});

test.describe("coarse pointer", () => {
test.use({ hasTouch: true });
test("Pixel dark search sheet clears the keyboard and navigation area", async ({ page }) => {
  await openStudy(page, "sheet");
  await page.getByTestId("device-picker").click();
  await page.getByTestId("device-option-pixel-10").click();
  await page.locator(".bottom-nav").getByRole("button", { name: "Settings", exact: true }).click();
  await page.getByRole("radiogroup", { name: "Theme", exact: true }).getByRole("radio", { name: "Dark", exact: true }).click();
  await page.locator(".bottom-nav").getByRole("button", { name: "Daily", exact: true }).click();
  await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-theme", "dark");
  expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);
  await trigger(page).tap();
  await expectSearchOpen(page, "sheet");
  await field(page).fill("David");
  await expect(keyboard(page)).toHaveCSS("transform", "none");
  const geometry = await page.getByTestId("bottom-sheet").evaluate(sheet => {
    const screen = sheet.closest<HTMLElement>("[data-phone-screen]")!;
    const dock = screen.querySelector<HTMLElement>(".keyboard-dock")!;
    const dockBounds = dock.getBoundingClientRect();
    const top = document.elementFromPoint(dockBounds.x + dockBounds.width / 2, dockBounds.y + dockBounds.height / 2);
    const scale = screen.getBoundingClientRect().width / screen.offsetWidth;
    return {
      sheetBottom: sheet.getBoundingClientRect().bottom,
      keyboardTop: dockBounds.top,
      keyboardAtPoint: Boolean(top?.closest(".keyboard-dock")),
      bottomInset: parseFloat(getComputedStyle(sheet).bottom),
      scale,
      background: getComputedStyle(sheet).backgroundColor,
    };
  });
  expect(geometry.sheetBottom).toBeLessThanOrEqual(geometry.keyboardTop + 2 * geometry.scale);
  expect(geometry.keyboardAtPoint).toBe(true);
  expect(geometry.bottomInset).toBeGreaterThan(250);
  expect(geometry.background).toBe("rgb(51, 51, 51)"); // Current semantic raised surface.
  await page.getByTestId("phone-frame").screenshot({ path: `${evidence}/sheet-pixel-dark-results.png` });
  await writeFile(`${evidence}/sheet-pixel-geometry.json`, JSON.stringify(geometry, null, 2));
  await page.keyboard.press("Escape");
  await expectClosed(page);
  await expectNoStudyWrites(page);
});
});

test("comparison controls open every variant and narrow tabs support the keyboard", async ({ page }) => {
  await observeStudyStorage(page);
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/search-study.html");
  for (const variant of variants) {
    const card = page.locator(`[data-variant="${variant}"]`);
    await card.getByRole("button", { name: "Open search", exact: true }).click();
    const frame = page.frameLocator(`[data-variant="${variant}"] iframe`);
    await expect(frame.locator(".today-search-form input")).toBeFocused();
    await frame.locator(".today-search-form input").fill("David");
    await expect(frame.locator(".today-search-result")).toHaveCount(1);
  }
  await page.screenshot({ path: `${evidence}/comparison-desktop.png`, fullPage: true });
  for (const variant of variants) {
    await page.locator(`[data-variant="${variant}"]`).getByRole("button", { name: "Reset", exact: true }).click();
    await expect(page.frameLocator(`[data-variant="${variant}"] iframe`).locator(".today-search-form input")).toHaveCount(0);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const tab = page.getByRole("tab", { name: "01 In place", exact: true });
  await tab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "02 Focus view", exact: true })).toBeFocused();
  await expect(page.locator('#focus-card')).toBeVisible();
  await expect(page.locator('#inline-card')).toBeHidden();
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "03 Search sheet", exact: true })).toBeFocused();
  await expect(page.locator('#sheet-card')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `${evidence}/comparison-narrow.png`, fullPage: true });
  for (const frame of page.frames()) {
    expect(await frame.evaluate(() => (window as unknown as { __searchStudyWrites: string[] }).__searchStudyWrites)).toEqual([]);
  }
});
