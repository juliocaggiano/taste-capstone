import { expect, test, type Locator, type Page } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const evidence = fileURLToPath(new URL("../../qa/artwork-detail-home-2026-09-23/", import.meta.url));
const daily = (page: Page) => page.locator('.daily-slide[data-active="true"] .today-article');
const detail = (page: Page) => page.locator('.today-article[data-reading-view="detail"]');
const dailyScroll = (page: Page) => page.locator(".daily-scroll > .mobile-scroll");

test.beforeAll(async () => { await mkdir(evidence, { recursive: true }); });

async function capture(page: Page, name: string) {
  await page.mouse.move(10, 10);
  await page.getByTestId("phone-frame").screenshot({ path: `${evidence}/${name}.png` });
}

async function readLayout(article: Locator) {
  return article.evaluate(root => {
    const screen = root.closest<HTMLElement>("[data-phone-screen]")!;
    const scale = screen.getBoundingClientRect().width / screen.offsetWidth;
    const articleBounds = root.getBoundingClientRect();
    const heroBounds = root.querySelector(".today-hero")!.getBoundingClientRect();
    const selectors = {
      hero: ".today-hero", metadata: ".today-metadata", title: ".today-title-row h1", creator: ".today-creator",
      categories: ".today-categories", actions: ".today-save-actions", save: ".today-save-primary",
      count: ".today-save-count-value", fullscreen: ".today-save-fullscreen",
      body: ".today-story-copy", edited: ".today-last-edited", technical: ".dc-work-information",
      biography: ".dc-creator-biography",
    };
    return Object.fromEntries(Object.entries(selectors).map(([key, selector]) => {
      const element = root.querySelector<HTMLElement>(selector)!;
      const bounds = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return [key, {
        width: bounds.width / scale, height: bounds.height / scale,
        x: (bounds.left - articleBounds.left) / scale,
        y: (bounds.top - heroBounds.top) / scale,
        fontFamily: style.fontFamily, fontSize: style.fontSize, lineHeight: style.lineHeight,
        fontWeight: style.fontWeight, letterSpacing: style.letterSpacing,
        padding: style.padding, gap: style.gap, color: style.color,
      }];
    }));
  });
}

async function expectHomeLayout(page: Page) {
  const id = await detail(page).getAttribute("data-piece-id");
  const homeArticle = page.locator(`.daily-slide .today-article[data-piece-id="${id}"]`);
  const [home, opened] = await Promise.all([readLayout(homeArticle), readLayout(detail(page))]);
  for (const key of Object.keys(home)) {
    const { width, height, x, y, ...text } = home[key];
    expect(opened[key], key).toMatchObject(text);
    for (const dimension of ["width", "height", "x", "y"] as const) {
      // Home's technical-information-to-biography gap is 20px; details keep 16px.
      const expected = key === "biography" && dimension === "y" ? home[key][dimension] - 4 : home[key][dimension];
      expect(opened[key][dimension], `${key}.${dimension}`).toBeCloseTo(expected, 1);
    }
  }
  for (const layout of [home, opened]) {
    expect(layout.title.x + layout.title.width).toBeLessThanOrEqual(layout.actions.x - 7.9);
    const titleWrapped = layout.title.height > Number.parseFloat(layout.title.lineHeight) * 1.5;
    if (titleWrapped) {
      expect(layout.creator.y).toBeGreaterThanOrEqual(layout.actions.y + layout.actions.height - 0.5);
      expect(layout.creator.x + layout.creator.width).toBeLessThanOrEqual(layout.metadata.x + layout.metadata.width + 0.5);
    } else {
      expect(layout.creator.x + layout.creator.width).toBeLessThanOrEqual(layout.actions.x - 7.9);
    }
  }
  await expect(detail(page).locator(".brand-masthead, .edition-strip, .daily-signoff, .today-topbar time, .today-search, .today-more")).toHaveCount(0);
  await expect(detail(page).locator(".today-detail-kind")).toBeVisible();
  await expect(page.locator(".bottom-nav")).toHaveCount(0);
  return { home, detail: opened };
}

async function readMetadataText(article: Locator) {
  return article.evaluate(root => {
    const row = root.querySelector<HTMLElement>(".today-title-row")!;
    const title = row.querySelector<HTMLElement>("h1")!;
    const creator = row.querySelector<HTMLElement>(".today-creator")!;
    const actions = row.querySelector<HTMLElement>(".today-save-actions")!;
    const metadata = root.querySelector<HTMLElement>(".today-metadata")!;
    const rect = (element: Element) => {
      const bounds = element.getBoundingClientRect();
      return { left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom, width: bounds.width, height: bounds.height };
    };
    const textRects = (element: Element) => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      const result: ReturnType<typeof rect>[] = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.textContent?.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const bounds of range.getClientRects()) {
          if (bounds.width > 0.5 && bounds.height > 0.5) {
            result.push({ left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom, width: bounds.width, height: bounds.height });
          }
        }
      }
      return result;
    };
    return {
      wrapped: row.dataset.titleWrapped,
      title: rect(title), titleText: textRects(title),
      creator: rect(creator), creatorText: textRects(creator),
      creatorLineHeight: Number.parseFloat(getComputedStyle(creator).lineHeight),
      actions: rect(actions), metadata: rect(metadata),
    };
  });
}

test("wrapped titles give creator and date the full line below actions", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  for (const device of ["iphone", "pixel-10"] as const) {
    if (device === "pixel-10") {
      await page.getByTestId("device-picker").click();
      await page.getByTestId("device-option-pixel-10").click();
    }

    const wave = page.locator('.daily-slide .today-article[data-piece-id="great-wave"]');
    const chart = page.locator('.daily-slide .today-article[data-piece-id="chart-of-hell"]');
    await expect(wave.locator(".today-title-row")).toHaveAttribute("data-title-wrapped", device === "iphone" ? "true" : "false");
    await expect(chart.locator(".today-title-row")).toHaveAttribute("data-title-wrapped", "false");

    const longTitle = await readMetadataText(wave);
    expect(longTitle.creator.height, `${device}: Hokusai caption height`).toBeLessThanOrEqual(longTitle.creatorLineHeight + 1);
    expect(longTitle.creator.right, `${device}: caption stays within metadata`).toBeLessThanOrEqual(longTitle.metadata.right + 0.5);
    if (device === "iphone") {
      expect(longTitle.titleText.length, "iPhone: Great Wave title lines").toBeGreaterThan(1);
      expect(longTitle.creator.top, "iPhone: caption starts below actions").toBeGreaterThanOrEqual(longTitle.actions.bottom - 0.5);
      expect(longTitle.creator.right, "iPhone: caption spans past actions column").toBeGreaterThan(longTitle.actions.left);
    } else {
      expect(longTitle.titleText, "Pixel: Great Wave title lines").toHaveLength(1);
      expect(longTitle.creator.right, "Pixel: caption stays before actions").toBeLessThanOrEqual(longTitle.actions.left - 7.5);
    }
    for (const line of longTitle.creatorText) {
      expect(line.right, `${device}: Hokusai caption stays on screen`).toBeLessThanOrEqual(longTitle.metadata.right + 0.5);
    }

    const shortTitle = await readMetadataText(chart);
    expect(shortTitle.titleText, `${device}: Chart title lines`).toHaveLength(1);
    expect(shortTitle.creator.right, `${device}: Chart caption stays before actions`).toBeLessThanOrEqual(shortTitle.actions.left - 7.5);
    for (const [name, geometry] of [["Great Wave", longTitle], ["Chart of Hell", shortTitle]] as const) {
      for (const line of geometry.titleText) {
        expect(line.right, `${device}: ${name} title text stays before actions`).toBeLessThanOrEqual(geometry.actions.left - 7.5);
      }
    }
    for (const line of shortTitle.creatorText) {
      expect(line.right, `${device}: Chart caption text stays before actions`).toBeLessThanOrEqual(shortTitle.actions.left - 7.5);
    }
  }
});

async function openRelatedDetail(page: Page) {
  await page.goto("/?related-study=gallery");
  await expect(daily(page)).toHaveAttribute("data-piece-id", "death-of-socrates");
  await page.evaluate(() => document.fonts.ready);
  await expect(daily(page).locator(".today-more h2")).toBeInViewport();
  const card = daily(page).locator(".related-work").first();
  const expectedTitle = await card.locator(".related-work-title").innerText();
  const beforeScroll = await dailyScroll(page).evaluate(element => element.scrollTop);
  await card.click();
  await expect(detail(page).locator(".today-title-row h1")).toHaveText(expectedTitle);
  await expect(detail(page).locator(".today-hero img")).toHaveJSProperty("complete", true);
  await expect(page.locator(".artwork-detail-scroll")).toBeVisible();
  return { expectedTitle, beforeScroll };
}

test("related artwork uses Home geometry, working actions, and retained parent scroll", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const { expectedTitle, beforeScroll } = await openRelatedDetail(page);
  const geometry = await expectHomeLayout(page);
  await expect(detail(page).getByRole("button", { name: "Close story", exact: true })).toHaveCSS("height", "32px");
  await expect(detail(page).locator(".today-detail-kind")).toHaveText("Literature");
  await writeFile(`${evidence}/home-detail-geometry.json`, JSON.stringify(geometry, null, 2));
  await capture(page, "related-detail-iphone");

  const save = detail(page).locator(".today-save-primary");
  const originallySaved = await save.getAttribute("aria-pressed");
  await save.click();
  await expect(save).toHaveAttribute("aria-pressed", originallySaved === "true" ? "false" : "true");
  await save.click();
  await expect(save).toHaveAttribute("aria-pressed", originallySaved!);

  const folderTrigger = detail(page).getByRole("button", { name: "Choose folder", exact: true });
  await folderTrigger.click();
  const folder = detail(page).getByRole("button", { name: "My folder", exact: true });
  const initiallyInFolder = await folder.getAttribute("aria-pressed");
  await folder.click();
  await expect(folder).toHaveAttribute("aria-pressed", initiallyInFolder === "true" ? "false" : "true");
  await folder.click();
  await expect(folder).toHaveAttribute("aria-pressed", initiallyInFolder!);
  await expect(save).toHaveAttribute("aria-pressed", "true");
  await detail(page).getByRole("button", { name: "New folder", exact: true }).click();
  await page.getByTestId("bottom-sheet").getByRole("textbox", { name: "Folder name", exact: true }).fill("Detail study");
  await page.getByTestId("bottom-sheet").getByRole("button", { name: "Create", exact: true }).click();
  await expect(page.getByTestId("bottom-sheet")).toHaveCount(0);
  await folderTrigger.click();
  await expect(detail(page).getByRole("button", { name: "Detail study", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");

  await detail(page).locator(".today-save-count").click();
  await expect(page.locator(".today-savers-sheet")).toBeVisible();
  await expect(page.getByTestId("bottom-sheet")).toContainText("Sample profiles");
  await page.keyboard.press("Escape");
  await expect(page.locator(".today-savers-sheet")).toHaveCount(0);

  await detail(page).locator(".today-save-fullscreen").click();
  await expect(page.getByTestId("artwork-viewer-canvas")).toBeVisible();
  await expect(page.locator(".artwork-viewer-heading h2")).toHaveText(expectedTitle);
  await capture(page, "related-detail-viewer");
  await page.getByRole("button", { name: "Close image", exact: true }).click();
  await expect(detail(page)).toBeVisible();
  await detail(page).getByRole("button", { name: "Close story", exact: true }).click();
  await expect(detail(page)).toHaveCount(0);
  await expect(daily(page)).toHaveAttribute("data-piece-id", "death-of-socrates");
  expect(await dailyScroll(page).evaluate(element => element.scrollTop)).toBeCloseTo(beforeScroll, 1);
  expect(errors).toEqual([]);
});

test("Home search returns from the new detail layout to its existing query", async ({ page }) => {
  await page.goto("/?today-search-study=focus");
  await daily(page).getByRole("button", { name: "Search stories", exact: true }).click();
  await page.locator(".today-search-form input").fill("David");
  await expect(page.locator(".today-search-result")).toHaveCount(1);
  await page.locator(".today-search-result").click();
  await expect(detail(page).locator(".today-title-row h1")).toHaveText("The Death of Socrates");
  await expectHomeLayout(page);
  await capture(page, "search-detail-iphone");
  await detail(page).getByRole("button", { name: "Close story", exact: true }).click();
  await expect(page.locator(".today-search-form input")).toHaveValue("David");
  await expect(page.locator(".today-search-form input")).toBeFocused();
  await expect(page.locator(".today-search-result strong")).toHaveText("The Death of Socrates");
  await page.keyboard.press("Escape");
  await expect(daily(page).getByRole("button", { name: "Search stories", exact: true })).toBeFocused();
});

test.describe("coarse pointer", () => {
  test.use({ hasTouch: true });
  test("Pixel dark detail keeps Italian labels and a 44px back target", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("daily-culture.preferences.v1", JSON.stringify({ locale: "it", theme: "dark" }));
    });
    await page.goto("/?related-study=gallery");
    await page.getByTestId("device-picker").click();
    await page.getByTestId("device-option-pixel-10").click();
    await page.evaluate(() => window.postMessage({ type: "daily-culture-related-study-command", action: "focus", variant: "gallery" }, location.origin));
    await expect(daily(page).locator(".today-more h2")).toBeInViewport();
    const title = await daily(page).locator(".related-work-title").first().innerText();
    await daily(page).locator(".related-work").first().tap();
    await expect(detail(page).locator(".today-title-row h1")).toHaveText(title);
    await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator(".daily-culture-app")).toHaveAttribute("lang", "it");
    await expect(detail(page).locator(".today-detail-kind")).toHaveText("Letteratura");
    await expect(detail(page).getByRole("button", { name: "Chiudi la storia", exact: true })).toHaveCSS("height", "44px");
    await expect(detail(page).locator(".today-last-edited")).toContainText("Ultima modifica");
    expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);
    await expectHomeLayout(page);
    await capture(page, "related-detail-pixel-dark-it");
    const save = detail(page).locator(".today-save-primary");
    await expect(save).toHaveAccessibleName("Salvato");
    await save.tap();
    await expect(save).toHaveAccessibleName("Salva");
    await expect(save).toHaveAttribute("aria-pressed", "false");
    await detail(page).getByRole("button", { name: "Chiudi la storia", exact: true }).tap();
    await expect(daily(page)).toHaveAttribute("data-piece-id", "death-of-socrates");
    await expect(daily(page).locator(".today-more h2")).toBeInViewport();
  });
});
