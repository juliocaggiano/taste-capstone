import { expect, test, type Page } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const evidence = fileURLToPath(new URL("../../qa/related-works-2026-09-23/", import.meta.url));
const variants = ["gallery", "grid", "list"] as const;
type Variant = typeof variants[number];
const article = (page: Page) => page.locator('.daily-slide[data-active="true"] .today-article');
const section = (page: Page) => article(page).locator(".today-more");
const scroll = (page: Page) => page.locator(".daily-scroll > .mobile-scroll");

test.beforeAll(async () => { await mkdir(evidence, { recursive: true }); });

async function observeStudyStorage(page: Page) {
  await page.addInitScript(() => {
    const writes: string[] = [];
    Object.defineProperty(window, "__relatedStudyWrites", { value: writes });
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (this === localStorage && /daily-culture|taste/i.test(key)) writes.push(key);
      original.call(this, key, value);
    };
  });
}

async function expectNoStudyWrites(page: Page) {
  expect(await page.evaluate(() => (window as unknown as { __relatedStudyWrites: string[] }).__relatedStudyWrites)).toEqual([]);
}

async function openStudy(page: Page, variant: Variant) {
  await observeStudyStorage(page);
  await page.goto(`/?related-study=${variant}`);
  await expect(article(page)).toHaveAttribute("data-piece-id", "death-of-socrates");
  await expect(section(page)).toHaveAttribute("data-related-variant", variant);
  await page.evaluate(() => document.fonts.ready);
  await expect.poll(() => scroll(page).evaluate(element => element.scrollTop)).toBeGreaterThan(500);
  await expect(section(page).locator("h2")).toBeInViewport();
}

async function sectionGaps(page: Page) {
  return article(page).evaluate(element => {
    const screen = element.closest<HTMLElement>("[data-phone-screen]")!;
    const scale = screen.getBoundingClientRect().width / screen.offsetWidth;
    const box = (selector: string) => element.querySelector(selector)!.getBoundingClientRect();
    return {
      information: (box(".dc-work-information-heading h2").top - box(".today-last-edited").bottom) / scale,
      related: (box(".today-more h2").top - box(".artwork-information-section").bottom) / scale,
      scale,
    };
  });
}

async function expectEqualGaps(page: Page) {
  const gaps = await sectionGaps(page);
  expect(gaps.information).toBeCloseTo(56, 1);
  expect(gaps.related).toBeCloseTo(56, 1);
  expect(gaps.information).toBeCloseTo(gaps.related, 1);
  return gaps;
}

async function capture(page: Page, name: string) {
  await page.mouse.move(10, 10);
  await page.getByTestId("phone-frame").screenshot({ path: `${evidence}/${name}.png` });
}

test("the standard Today layout uses the selected gallery with matching section gaps", async ({ page }) => {
  await page.goto("/");
  await expect(article(page)).toHaveAttribute("data-piece-id", "death-of-socrates");
  await page.evaluate(() => document.fonts.ready);
  await expectEqualGaps(page);
  await expect(section(page)).toHaveAttribute("data-related-variant", "gallery");
  await expect(section(page).locator(".related-work").first()).toBeAttached();
});

for (const variant of variants) {
  test(`${variant}: related works keep spacing and return to the same Today position`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await openStudy(page, variant);
    const gaps = await expectEqualGaps(page);
    await writeFile(`${evidence}/${variant}-spacing.json`, JSON.stringify(gaps, null, 2));
    await capture(page, `${variant}-iphone`);

    const card = section(page).locator(".related-work").first();
    const accessibleName = await card.getAttribute("aria-label");
    expect(accessibleName).toMatch(/^Open /);
    const expectedTitle = accessibleName!.replace(/^Open /, "");
    const beforeScroll = await scroll(page).evaluate(element => element.scrollTop);
    const retained = await page.locator(".daily-screen").elementHandle();
    await card.click();
    await expect(page.getByRole("button", { name: "Close story", exact: true })).toBeVisible();
    await expect(page.locator('[data-reading-view="detail"] .today-title-row h1')).toHaveText(expectedTitle);
    expect(await retained!.evaluate(element => element.isConnected)).toBe(true);
    await page.getByRole("button", { name: "Close story", exact: true }).click();
    await expect(article(page)).toBeVisible();
    await expect(article(page)).toHaveAttribute("data-piece-id", "death-of-socrates");
    expect(await scroll(page).evaluate(element => element.scrollTop)).toBeCloseTo(beforeScroll, 1);
    await expectNoStudyWrites(page);
    expect(errors).toEqual([]);
  });
}

test("gallery drag scrolls its rail without changing the edition or opening a work", async ({ page }) => {
  await openStudy(page, "gallery");
  const rail = section(page).locator(".mobile-carousel");
  const box = await rail.boundingBox();
  if (!box) throw new Error("Related gallery has no bounds");
  const x = box.x + Math.min(box.width - 30, 240);
  const y = box.y + Math.min(box.height / 2, 90);
  const before = await rail.evaluate(element => element.scrollLeft);
  await page.mouse.move(x, y);
  await page.mouse.down();
  for (let step = 1; step <= 8; step += 1) {
    await page.mouse.move(x - 150 * step / 8, y);
    await page.waitForTimeout(12);
  }
  await page.mouse.up();
  await expect(rail).toHaveAttribute("data-dragging", "false");
  await expect.poll(() => rail.evaluate(element => element.scrollLeft)).toBeGreaterThan(before + 50);
  await expect(article(page)).toHaveAttribute("data-piece-id", "death-of-socrates");
  await expect(page.getByRole("button", { name: "Close story", exact: true })).toHaveCount(0);
  await expectNoStudyWrites(page);
});

test("grid and list fit a narrow preview without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await observeStudyStorage(page);
  for (const variant of ["grid", "list"] as const) {
    await page.goto(`/?related-study=${variant}`);
    await expect(section(page)).toHaveAttribute("data-related-variant", variant);
    await expect.poll(() => scroll(page).evaluate(element => element.scrollTop)).toBeGreaterThan(500);
    await page.evaluate(() => document.fonts.ready);
    const geometry = await section(page).evaluate(element => {
      const bounds = element.getBoundingClientRect();
      const cards = [...element.querySelectorAll(".related-work")].map(card => {
        const box = card.getBoundingClientRect();
        return { left: box.left, right: box.right, top: box.top, bottom: box.bottom };
      });
      return { left: bounds.left, right: bounds.right, width: element.clientWidth, scrollWidth: element.scrollWidth, cards };
    });
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.width + 1);
    expect(geometry.cards.every(card => card.left >= geometry.left - 1 && card.right <= geometry.right + 1)).toBe(true);
    expect(geometry.cards.length).toBeGreaterThanOrEqual(3);
    if (variant === "grid") {
      expect(geometry.cards[1].top).toBeCloseTo(geometry.cards[0].top, 1);
      expect(geometry.cards[1].left).toBeGreaterThan(geometry.cards[0].left);
      expect(geometry.cards[2].top).toBeGreaterThan(geometry.cards[0].bottom);
    } else {
      expect(geometry.cards[1].left).toBeCloseTo(geometry.cards[0].left, 1);
      expect(geometry.cards[1].top).toBeGreaterThanOrEqual(geometry.cards[0].bottom);
    }
    await expectEqualGaps(page);
    await capture(page, `${variant}-narrow`);
    await expectNoStudyWrites(page);
  }
});

test.describe("coarse pointer", () => {
  test.use({ hasTouch: true });
  test("Pixel dark grid preserves readable related works and navigation", async ({ page }) => {
    await openStudy(page, "grid");
    await page.getByTestId("device-picker").click();
    await page.getByTestId("device-option-pixel-10").click();
    await page.locator(".bottom-nav").getByRole("button", { name: "Settings", exact: true }).click();
    await page.getByRole("radiogroup", { name: "Theme", exact: true }).getByRole("radio", { name: "Dark", exact: true }).click();
    await page.locator(".bottom-nav").getByRole("button", { name: "Daily", exact: true }).click();
    await page.evaluate(() => window.postMessage({ type: "daily-culture-related-study-command", action: "focus", variant: "grid" }, location.origin));
    await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-theme", "dark");
    await expect(section(page).locator("h2")).toBeInViewport();
    expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);
    await expectEqualGaps(page);
    const card = section(page).locator(".related-work").first();
    const title = (await card.getAttribute("aria-label"))!.replace(/^Open /, "");
    await capture(page, "grid-pixel-dark");
    await card.tap();
    await expect(page.locator('[data-reading-view="detail"] .today-title-row h1')).toHaveText(title);
    await page.getByRole("button", { name: "Close story", exact: true }).tap();
    await expect(article(page)).toHaveAttribute("data-piece-id", "death-of-socrates");
    await expectNoStudyWrites(page);
  });
});

test("comparison controls and narrow keyboard tabs work in isolated previews", async ({ page }) => {
  await observeStudyStorage(page);
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/related-study.html");
  for (const variant of variants) {
    const card = page.locator(`[data-variant="${variant}"]`);
    const frame = page.frameLocator(`[data-variant="${variant}"] iframe`);
    await card.getByRole("button", { name: "View section", exact: true }).click();
    await expect(frame.locator('.daily-slide[data-active="true"] .today-more h2')).toBeInViewport();
    await frame.locator('.daily-slide[data-active="true"] .related-work').first().click();
    await expect(frame.getByRole("button", { name: "Close story", exact: true })).toBeVisible();
    await card.getByRole("button", { name: "Reset", exact: true }).click();
    await expect(frame.getByRole("button", { name: "Close story", exact: true })).toHaveCount(0);
    await expect(frame.locator('.daily-slide[data-active="true"] .today-more h2')).toBeInViewport();
  }
  await page.mouse.move(10, 10);
  await page.screenshot({ path: `${evidence}/comparison-desktop.png`, fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("tab", { name: "01 Gallery rail", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "02 Paired grid", exact: true })).toBeFocused();
  await expect(page.locator("#grid-card")).toBeVisible();
  await expect(page.locator("#gallery-card")).toBeHidden();
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "03 Compact list", exact: true })).toBeFocused();
  await expect(page.locator("#list-card")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `${evidence}/comparison-narrow.png`, fullPage: true });
  for (const frame of page.frames()) {
    expect(await frame.evaluate(() => (window as unknown as { __relatedStudyWrites: string[] }).__relatedStudyWrites)).toEqual([]);
  }
});
