import { expect, test, type Locator, type Page } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const activeArticle = (page: Page) => page.locator('.daily-slide[data-active="true"] .today-article');
const evidenceDirectory = fileURLToPath(new URL("../../qa/today-save-2026-09-23/", import.meta.url));

async function capture(page: Page, name: string) {
  await mkdir(evidenceDirectory, { recursive: true });
  await page.mouse.move(10, 10);
  await page.getByTestId("phone-frame").screenshot({ path: `${evidenceDirectory}/${name}.png` });
}

async function openToday(page: Page, device: "iphone" | "pixel-10" = "iphone") {
  await page.goto("/");
  if (device === "pixel-10") {
    await page.getByTestId("device-picker").click();
    await page.getByTestId("device-option-pixel-10").click();
  }
  await expect(activeArticle(page)).toBeVisible();
  await expect(activeArticle(page).locator(".today-hero img")).toHaveJSProperty("complete", true);
}

async function drag(page: Page, target: Locator, dx: number, dy = 0) {
  const box = await target.boundingBox();
  if (!box) throw new Error("Drag target has no bounds");
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  for (let step = 1; step <= 8; step += 1) {
    await page.mouse.move(x + dx * step / 8, y + dy * step / 8);
    await page.waitForTimeout(12);
  }
  await page.mouse.up();
}

async function clickVisible(page: Page, target: Locator) {
  const box = await target.boundingBox();
  if (!box) throw new Error("Control has no visible bounds");
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

async function liveIndicators(page: Page) {
  return page.getByTestId("device-screen").evaluate((screen) => {
    const status = screen.querySelector(".status-bar")!;
    const statusIcons = screen.querySelector(".status-indicator-svg")!;
    const home = screen.querySelector(".home-indicator-svg");
    return {
      statusColor: getComputedStyle(status).color,
      statusIconFilter: getComputedStyle(statusIcons).filter,
      homeFilter: home ? getComputedStyle(home).filter : null,
    };
  });
}

async function viewerGeometry(dialog: Locator) {
  return dialog.evaluate((element) => {
    const screen = element.closest<HTMLElement>("[data-phone-screen]")!;
    const screenBounds = screen.getBoundingClientRect();
    const scale = screenBounds.width / screen.offsetWidth;
    const rect = (target: Element) => {
      const bounds = target.getBoundingClientRect();
      return {
        top: (bounds.top - screenBounds.top) / scale,
        left: (bounds.left - screenBounds.left) / scale,
        bottom: (bounds.bottom - screenBounds.top) / scale,
        right: (bounds.right - screenBounds.left) / scale,
        width: bounds.width / scale, height: bounds.height / scale,
      };
    };
    const control = (selector: string) => {
      const target = element.querySelector<HTMLElement>(selector)!;
      const style = getComputedStyle(target);
      const glass = getComputedStyle(target, "::before");
      return { ...rect(target), background: style.backgroundColor, backgroundImage: glass.backgroundImage, backdropFilter: glass.backdropFilter };
    };
    return {
      screen: { width: screen.offsetWidth, height: screen.offsetHeight },
      bottomInset: parseFloat(getComputedStyle(element).bottom),
      dialog: rect(element), canvas: rect(element.querySelector(".artwork-viewer-canvas")!),
      image: rect(element.querySelector(".artwork-viewer-plane")!),
      heading: rect(element.querySelector(".artwork-viewer-heading")!),
      close: control('button[aria-label="Close image"]'),
      download: control('[aria-label="Download image"]'),
      background: getComputedStyle(element).backgroundColor,
    };
  });
}

function expectFullCanvas(geometry: Awaited<ReturnType<typeof viewerGeometry>>) {
  expect(geometry.dialog.top).toBeCloseTo(0, 1);
  expect(geometry.dialog.left).toBeCloseTo(0, 1);
  expect(geometry.dialog.width).toBeCloseTo(geometry.screen.width, 1);
  expect(geometry.dialog.height).toBeCloseTo(geometry.screen.height - geometry.bottomInset, 1);
  for (const edge of ["top", "left", "right", "bottom"] as const) {
    expect(geometry.canvas[edge]).toBeCloseTo(geometry.dialog[edge], 1);
  }
  expect(geometry.background).toBe("rgb(0, 0, 0)");
}

test("Today preserves reading typography and aligned action controls", async ({ page, context }) => {
  await openToday(page);
  await page.evaluate(() => document.fonts.ready);
  const metrics = await activeArticle(page).evaluate((article) => {
    const screen = article.closest<HTMLElement>("[data-phone-screen]")!;
    const screenBounds = screen.getBoundingClientRect();
    const scale = screenBounds.width / screen.offsetWidth;
    const measure = (selector: string) => {
      const element = article.querySelector<HTMLElement>(selector)!;
      const style = getComputedStyle(element);
      const bounds = element.getBoundingClientRect();
      return {
        fontSize: style.fontSize, lineHeight: style.lineHeight, fontWeight: style.fontWeight,
        letterSpacing: style.letterSpacing, color: style.color, background: style.backgroundColor,
        gap: style.gap, padding: style.padding, paddingLeft: style.paddingLeft, paddingRight: style.paddingRight,
        height: bounds.height / scale, width: bounds.width / scale,
        top: (bounds.top - screenBounds.top) / scale, left: (bounds.left - screenBounds.left) / scale,
        bottom: (bounds.bottom - screenBounds.top) / scale,
      };
    };
    return {
      screenWidth: screen.offsetWidth,
      topbar: measure(".today-topbar"), date: measure(".today-date"),
      hero: measure(".today-hero"), metadata: measure(".today-metadata"),
      titleRow: measure(".today-title-row"), title: measure(".today-title-row h1"),
      creator: measure(".today-creator"), actions: measure(".today-save-actions"),
      count: measure(".today-save-count-value"), save: measure(".today-save-primary"),
      saveLabel: measure('.today-save-labels > span[data-visible="true"]'),
      board: measure(".today-save-chevron"), fullscreen: measure(".today-save-fullscreen"),
      categories: measure(".today-categories"), chip: measure(".today-categories li"),
      body: measure(".today-story-copy"), edited: measure(".today-last-edited"),
      lastParagraph: measure(".today-story-copy p:last-child"), technical: measure(".dc-work-information"),
      paragraphs: Array.from(article.querySelectorAll<HTMLElement>(".today-story-copy p"))
        .slice(0, 3).map((element) => element.getBoundingClientRect().width / scale),
    };
  });

  await mkdir(evidenceDirectory, { recursive: true });
  await writeFile(`${evidenceDirectory}/rendered-metrics.json`, JSON.stringify({ metrics }, null, 2));

  // These values come from Paper node 1QL-0, not the app's design-system defaults.
  expect(metrics.screenWidth).toBe(393);
  for (const text of [metrics.title, metrics.creator]) {
    expect(text).toMatchObject({ fontSize: "14px", lineHeight: "16px", fontWeight: "400", letterSpacing: "0.14px" });
  }
  expect(metrics.body).toMatchObject({ fontSize: "12px", lineHeight: "14px", fontWeight: "400", letterSpacing: "0.12px" });
  for (const label of [metrics.count, metrics.saveLabel]) {
    expect(label).toMatchObject({ fontSize: "8px", lineHeight: "10px", fontWeight: "400" });
  }
  expect(metrics.chip).toMatchObject({ fontSize: "8px", lineHeight: "10px", fontWeight: "400" });
  expect(metrics.edited).toMatchObject({ fontSize: "10px", lineHeight: "10px", letterSpacing: "0.1px" });
  expect(metrics.creator.color).toBe("rgb(110, 110, 110)");
  expect(metrics.chip.background).toBe("rgb(242, 242, 242)");
  expect(metrics.topbar.top).toBeCloseTo(56, 1);
  expect(metrics.topbar.height).toBeCloseTo(20, 1);
  expect(metrics.date.height).toBeCloseTo(20, 1);
  expect(metrics.hero.top).toBeCloseTo(84, 1);
  expect(metrics.hero.height).toBeCloseTo(420, 1);
  expect(metrics.titleRow.top - metrics.hero.bottom).toBeCloseTo(16, 1);
  expect(metrics.creator.top - metrics.title.bottom).toBeCloseTo(2, 1);
  expect(metrics.edited.top - metrics.lastParagraph.bottom).toBeCloseTo(24, 1);
  expect(metrics.technical.top - metrics.edited.bottom).toBeCloseTo(56, 1);
  expect(metrics.actions.top).toBeCloseTo(metrics.titleRow.top, 1);
  // Today's action structure follows Paper node 1TC-0; its controls now match the 20px topbar.
  expect(metrics.actions.height).toBeCloseTo(metrics.date.height, 1);
  expect(metrics.actions.gap).toBe("8px");
  expect(metrics.save.height).toBeCloseTo(20, 1);
  expect(metrics.board.height).toBeCloseTo(20, 1);
  expect(metrics.fullscreen.height).toBeCloseTo(metrics.date.height, 1);
  expect(metrics.fullscreen.width).toBeCloseTo(metrics.date.height, 1);
  await expect(activeArticle(page).locator(".today-save-count-value")).toHaveText("+65");
  await expect(activeArticle(page).locator(".today-save-primary svg")).toHaveCount(0);
  expect(metrics.categories.gap).toBe("8px");
  expect(metrics.chip.height).toBeCloseTo(14, 1);
  expect(metrics.chip.padding).toBe("2px 6px");
  expect(metrics.title.left).toBeCloseTo(12, 1);
  expect(metrics.body.left).toBeCloseTo(12, 1);
  for (const [index, width] of [345, 369].entries()) expect(metrics.paragraphs[index]).toBeCloseTo(width, 1);

  // Requested font-family text alone does not prove that the font rendered.
  const session = await context.newCDPSession(page);
  await session.send("DOM.enable");
  await session.send("CSS.enable");
  const { root } = await session.send("DOM.getDocument");
  const fonts: Record<string, unknown> = {};
  for (const [selector, expected] of [
    [".today-title-row h1", "PPNeueMontrealTT-Regular"],
    [".today-creator button", "PPNeueMontrealTT-Regular"],
    [".today-story-copy p", "PPNeueMontrealTT-Regular"],
    [".today-save-count-value", "PPNeueMontrealTT-Regular"],
    [".today-categories li", "PPNeueMontrealTT-Regular"],
    [".today-last-edited", "PPNeueMontrealTT-Regular"],
  ]) {
    const { nodeId } = await session.send("DOM.querySelector", {
      nodeId: root.nodeId,
      selector: `.daily-slide[data-active="true"] .today-article ${selector}`,
    });
    const result = await session.send("CSS.getPlatformFontsForNode", { nodeId });
    const rendered = result.fonts.filter((font) => font.glyphCount > 0);
    fonts[selector] = rendered;
    expect(rendered.map((font) => font.postScriptName), `Actual rendered font for ${selector}`).toEqual([expected]);
  }
  await session.detach();
  await mkdir(evidenceDirectory, { recursive: true });
  await writeFile(`${evidenceDirectory}/rendered-metrics.json`, JSON.stringify({ metrics, fonts }, null, 2));
});

test("saved-by sheet opens independently and preserves local reader follows", async ({ page }) => {
  await openToday(page);
  const article = activeArticle(page);
  const trigger = article.locator(".today-save-count");
  await trigger.click();
  const sheet = page.getByRole("dialog", { name: "Saved by 65 people", exact: true });
  await expect(sheet).toBeVisible();
  await expect(sheet.locator(".today-saver-row")).toHaveCount(65);
  await expect(article.locator(".today-save-primary")).toHaveAttribute("aria-pressed", "false");
  const follow = sheet.locator('[data-person-id="sample-person-1"] button');
  await follow.click();
  await expect(follow).toHaveAttribute("aria-pressed", "true");
  await expect(sheet.getByRole("button", { name: "Follow Noah Vale", exact: true })).toHaveAttribute("aria-pressed", "false");
  await capture(page, "savers-iphone-light");
  await page.keyboard.press("Escape");
  await expect(sheet).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await article.locator(".today-save-primary").click();
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Saved by 66 people", exact: true })).toBeVisible();
  await expect(page.locator(".today-saver-row")).toHaveCount(66);
  await expect(page.locator('.today-saver-row[data-person-id="current-prototype-reader"] button')).toHaveCount(0);
  await page.reload();
  await trigger.click();
  const following = page.getByRole("button", { name: "Following Mara Vale. Unfollow", exact: true });
  await expect(following).toHaveAttribute("aria-pressed", "true");
  await following.click();
  await expect(page.getByRole("button", { name: "Follow Mara Vale", exact: true })).toHaveAttribute("aria-pressed", "false");
});

test("saved-by sheet fits Pixel dark mode and scrolls through every sample reader", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("daily-culture.preferences.v1", JSON.stringify({ theme: "dark", locale: "es" })));
  await openToday(page, "pixel-10");
  await activeArticle(page).locator(".today-save-count").click();
  const sheet = page.getByRole("dialog", { name: "Guardado por 65 personas", exact: true });
  await expect(sheet).toBeVisible();
  await expect(sheet.getByText("Perfiles de ejemplo", { exact: true })).toBeVisible();
  await expect(sheet.getByRole("button", { name: "Seguir Mara Vale", exact: true })).toBeVisible();
  await expect.poll(() => sheet.evaluate(element => Math.abs(new DOMMatrixReadOnly(getComputedStyle(element).transform).m42))).toBeLessThan(.01);
  const geometry = await sheet.evaluate(element => {
    const style = getComputedStyle(element);
    const content = element.querySelector(".sheet-content")!;
    return { background: style.backgroundColor, bottom: parseFloat(style.bottom), padding: getComputedStyle(content).paddingLeft,
      scrollable: content.scrollHeight > content.clientHeight, overflowX: content.scrollWidth > content.clientWidth };
  });
  expect(geometry.background).toBe("rgb(37, 37, 37)");
  expect(geometry.bottom).toBeGreaterThan(0);
  expect(geometry.padding).toBe("20px");
  expect(geometry.scrollable).toBe(true);
  expect(geometry.overflowX).toBe(false);
  await capture(page, "savers-pixel-dark");
  const lastReader = sheet.locator('[data-person-id="sample-person-65"] button');
  await lastReader.scrollIntoViewIfNeeded();
  await lastReader.click();
  await expect(lastReader).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");
  await expect(sheet).toHaveCount(0);
  await expect(activeArticle(page).locator(".today-save-count")).toBeFocused();
});

test("folder picker keeps global saves separate from folder membership", async ({ page }) => {
  await openToday(page);
  const article = activeArticle(page);
  const save = article.locator(".today-save-primary");
  const count = article.locator(".today-save-count");
  const folderTrigger = article.getByRole("button", { name: "Choose folder" });
  await expect(save).toHaveAttribute("aria-pressed", "false");
  await expect(count).toHaveAttribute("title", "Saved by 65 people");

  await folderTrigger.click();
  const defaultFolder = article.getByRole("button", { name: "My folder" });
  await clickVisible(page, defaultFolder);
  await expect(defaultFolder).toHaveAttribute("aria-pressed", "true");
  await expect(save).toHaveAttribute("aria-pressed", "true");
  await expect(count).toHaveAttribute("title", "Saved by 66 people");
  await clickVisible(page, defaultFolder);
  await expect(defaultFolder).toHaveAttribute("aria-pressed", "false");
  await expect(save).toHaveAttribute("aria-pressed", "true");
  await expect(count).toHaveAttribute("title", "Saved by 66 people");

  // The anchored menu sits inside the Daily carousel. Use the visible coordinates
  // so Playwright does not scroll the carousel while locating the popup option.
  await clickVisible(page, article.getByRole("button", { name: "New folder" }));
  const sheet = page.getByTestId("bottom-sheet");
  await sheet.getByRole("textbox", { name: "Folder name" }).fill("Art history");
  await clickVisible(page, sheet.getByRole("button", { name: "Create", exact: true }));
  await expect(sheet).toHaveCount(0);
  await folderTrigger.click();
  await expect(article.getByRole("button", { name: "Art history" })).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");
  await expect(folderTrigger).toBeFocused();

  await page.reload();
  const restoredArticle = activeArticle(page);
  await expect(restoredArticle.locator(".today-save-primary")).toHaveAttribute("aria-pressed", "true");
  await restoredArticle.getByRole("button", { name: "Choose folder" }).click();
  await expect(restoredArticle.getByRole("button", { name: "Art history" })).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");
  await restoredArticle.getByRole("button", { name: "Search stories" }).click();
  await expect(page.getByRole("dialog", { name: "Search" })).toBeVisible();
});

for (const device of ["iphone", "pixel-10"] as const) {
  test(`${device}: tapping the artwork opens the viewer while dragging keeps Daily navigation`, async ({ page }) => {
    await openToday(page, device);
    const hero = activeArticle(page).getByRole("button", { name: "View image in detail: The Death of Socrates", exact: true });
    await hero.click();
    const dialog = page.getByTestId("artwork-viewer");
    await expect(dialog.locator(".artwork-viewer-plane")).toHaveAttribute("data-source-width", "4000");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(hero).toBeFocused();
    await hero.press("Enter");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await drag(page, hero, 0, -100);
    await expect(dialog).toHaveCount(0);
    await expect(activeArticle(page)).toHaveAttribute("data-piece-id", "death-of-socrates");
    await drag(page, hero, 130);
    await expect(dialog).toHaveCount(0);
    await expect(activeArticle(page)).toHaveAttribute("data-piece-id", "divine-comedy");
  });

  test(`${device}: Today presents the artwork and metadata before the story, and saves the piece`, async ({ page }) => {
    await openToday(page, device);
    const article = activeArticle(page);
    await expect(article.getByRole("heading", { level: 1 })).toHaveText("The Death of Socrates");
    await expect(article.locator(".today-categories > *")).toHaveCount(2);
    await capture(page, `${device}-today`);

    const geometry = await article.evaluate((element) => {
      const rect = (selector: string) => {
        const target = element.querySelector<HTMLElement>(selector);
        if (!target) throw new Error(`Missing reading section: ${selector}`);
        const { top, bottom, left, right } = target.getBoundingClientRect();
        return { top, bottom, left, right };
      };
      const { left, right } = element.getBoundingClientRect();
      return {
        bounds: { left, right },
        image: rect(".today-hero"),
        metadata: rect(".today-metadata"),
        categories: rect(".today-categories"),
        story: rect(".today-story-copy"),
        edited: rect(".today-last-edited"),
      };
    });
    expect(geometry.image.bottom).toBeLessThanOrEqual(geometry.metadata.top + 1);
    expect(geometry.categories.bottom).toBeLessThanOrEqual(geometry.story.top + 1);
    expect(geometry.story.bottom).toBeLessThanOrEqual(geometry.edited.top + 1);
    for (const section of [geometry.image, geometry.metadata, geometry.categories, geometry.story]) {
      expect(section.left).toBeGreaterThanOrEqual(geometry.bounds.left - 1);
      expect(section.right).toBeLessThanOrEqual(geometry.bounds.right + 1);
    }
    // The cap applies to every supplied edition, including slides outside view.
    const categoryCounts = await page.locator(".today-categories").evaluateAll((groups) => groups.map((group) => group.children.length));
    expect(categoryCounts.length).toBeGreaterThan(1);
    expect(categoryCounts.every((count) => count > 0 && count <= 3)).toBe(true);

    const save = article.locator(".today-save-primary");
    const count = article.locator(".today-save-count");
    const wasSaved = await save.getAttribute("aria-pressed");
    const beforeCount = Number((await count.getAttribute("title"))?.match(/\d+/)?.[0]);
    await save.click();
    await expect(save).toHaveAttribute("aria-pressed", wasSaved === "true" ? "false" : "true");
    const afterCount = Number((await count.getAttribute("title"))?.match(/\d+/)?.[0]);
    expect(afterCount - beforeCount).toBe(wasSaved === "true" ? -1 : 1);
    await page.reload();
    const restoredSave = activeArticle(page).locator(".today-save-primary");
    await expect(restoredSave).toHaveAttribute("aria-pressed", wasSaved === "true" ? "false" : "true");
    expect(Number((await activeArticle(page).locator(".today-save-count").getAttribute("title"))?.match(/\d+/)?.[0])).toBe(afterCount);
  });

  test(`${device}: opening crop, full image viewing, download, and gestures preserve the Daily edition`, async ({ page }) => {
    await openToday(page, device);
    const opener = activeArticle(page).getByRole("button", { name: "View image in full screen", exact: true });
    const originalIndicators = await liveIndicators(page);
    await opener.click();
    const dialog = page.getByTestId("artwork-viewer");
    const canvas = page.getByTestId("artwork-viewer-canvas");
    const image = dialog.locator(".artwork-viewer-image");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName("The Death of Socrates");
    await expect(image).toBeVisible();
    // The preview is separate from David’s original 4000 × 2663 download source.
    const plane = dialog.locator(".artwork-viewer-plane");
    await expect(plane).toHaveAttribute("data-source-width", "4000");
    await expect(plane).toHaveAttribute("data-source-height", "2663");
    expect(await plane.evaluate(element => {
      const style = getComputedStyle(element);
      const transform = new DOMMatrixReadOnly(style.transform);
      return { scaleX: transform.a, scaleY: transform.d, willChange: style.willChange };
    })).toEqual({ scaleX: 1, scaleY: 1, willChange: "auto" });
    const fitBounds = await image.boundingBox();
    expect(fitBounds!.width).toBeGreaterThan(100);
    expect(fitBounds!.height).toBeGreaterThan(100);
    const openingGeometry = await viewerGeometry(dialog);
    expect(openingGeometry.image.height).toBeCloseTo(openingGeometry.canvas.height * .72, 1);
    expect(openingGeometry.image.width).toBeGreaterThan(openingGeometry.canvas.width * 2);
    const openingFocus = (openingGeometry.canvas.width / 2 - openingGeometry.image.left) / openingGeometry.image.width;
    expect(openingFocus).toBeCloseTo(.62, 2);
    expect(openingGeometry.image.top).toBeCloseTo(openingGeometry.canvas.height * .14, 1);
    await expect.poll(() => dialog.locator('.artwork-viewer-tile[data-ready="true"]').count()).toBeGreaterThan(0);
    await expect.poll(() => dialog.locator('.artwork-viewer-tile').evaluateAll(elements => elements.every(element => getComputedStyle(element).opacity === "1"))).toBe(true);
    await capture(page, `${device}-viewer-opening-settled`);
    await canvas.press("Home");
    await expect(canvas).toHaveAttribute("data-zoom", "1.00");
    await expect(canvas).toHaveAttribute("data-animating", "false");
    await expect(dialog.locator("button, a[download]")).toHaveCount(2);
    await expect(dialog.locator(".artwork-viewer-heading h2")).toHaveText("The Death of Socrates");
    await expect(dialog.locator(".artwork-viewer-heading p")).toHaveText("Jacques-Louis David, 1787");
    for (const caption of ["h2", "p"]) {
      await expect(dialog.locator(`.artwork-viewer-heading ${caption}`)).toHaveCSS("font-size", "14px");
      await expect(dialog.locator(`.artwork-viewer-heading ${caption}`)).toHaveCSS("line-height", "18px");
    }
    await expect(dialog.locator(".artwork-viewer-heading p")).toHaveCSS("margin-top", "2px");
    await expect(dialog.getByRole("link", { name: "Download image", exact: true })).toHaveText("");
    await expect(dialog.locator(".artwork-viewer-header, .artwork-viewer-percentage, .artwork-viewer-help, .artwork-viewer-credit, .artwork-viewer-zoom")).toHaveCount(0);
    await expect(dialog).toHaveAccessibleDescription(/Tap a detail to zoom.*Pinch or scroll to adjust.*Use \+ and/);
    const fitGeometry = await viewerGeometry(dialog);
    const viewerIndicators = await liveIndicators(page);
    expect(viewerIndicators.statusColor).toBe("rgb(255, 255, 255)");
    expect(viewerIndicators.statusIconFilter).toBe("invert(1)");
    if (viewerIndicators.homeFilter !== null) expect(viewerIndicators.homeFilter).toBe("invert(1)");
    expectFullCanvas(fitGeometry);
    expect(fitGeometry.image.top).toBeGreaterThanOrEqual(fitGeometry.canvas.top - 1);
    expect(fitGeometry.image.left).toBeGreaterThanOrEqual(fitGeometry.canvas.left - 1);
    expect(fitGeometry.image.bottom).toBeLessThanOrEqual(fitGeometry.canvas.bottom + 1);
    expect(fitGeometry.image.right).toBeLessThanOrEqual(fitGeometry.canvas.right + 1);
    expect(fitGeometry.close.left).toBeGreaterThan(fitGeometry.canvas.width / 2);
    expect(fitGeometry.close.top).toBeLessThan(fitGeometry.canvas.height / 4);
    expect(fitGeometry.canvas.right - fitGeometry.close.right).toBeLessThanOrEqual(24);
    expect(fitGeometry.download.left).toBeGreaterThan(fitGeometry.canvas.width / 2);
    expect(fitGeometry.canvas.bottom - fitGeometry.download.bottom).toBeLessThanOrEqual(80);
    expect(fitGeometry.heading.left).toBeLessThanOrEqual(24);
    expect(fitGeometry.heading.top).toBeGreaterThan(fitGeometry.canvas.height * .75);
    for (const control of [fitGeometry.close, fitGeometry.download]) {
      expect(control.background).toMatch(/^rgba\(/);
      expect(control.backgroundImage).toContain("linear-gradient");
      const alpha = Array.from(control.backgroundImage.matchAll(/rgba\([^)]*, ([\d.]+)\)/g), match => Number(match[1]));
      expect(alpha).toHaveLength(2);
      // Chromium serializes color alpha after 8-bit rounding.
      expect(Math.abs(alpha[0] - .42 * .8)).toBeLessThan(1 / 255);
      expect(Math.abs(alpha[1] - .28 * .8)).toBeLessThan(1 / 255);
      expect(control.backdropFilter).toContain("blur(");
    }
    await capture(page, `${device}-viewer-fit`);

    const matrix = () => plane.evaluate((element) => {
      const transform = new DOMMatrixReadOnly(getComputedStyle(element).transform);
      const canvas = element.closest<HTMLElement>(".artwork-viewer-canvas")!;
      const fitWidth = Math.min(canvas.clientWidth, canvas.clientHeight * 4000 / 2663);
      return { scale: parseFloat(getComputedStyle(element).width) / fitWidth, x: transform.e, y: transform.f };
    });
    for (let step = 0; step < 4; step += 1) {
      await canvas.press("Shift+Equal");
      await expect(canvas).toHaveAttribute("data-animating", "false");
    }
    const enlarged = (await matrix()).scale;
    expect(enlarged).toBeGreaterThan(2);
    await canvas.press("Minus");
    await expect(canvas).toHaveAttribute("data-animating", "false");
    expect((await matrix()).scale).toBeLessThan(enlarged);
    await canvas.press("Shift+Equal");
    await expect(canvas).toHaveAttribute("data-animating", "false");
    await drag(page, canvas, 90, 55);
    const panned = await matrix();
    expect(panned.x).toBeGreaterThan(20);
    expect(panned.y).toBeGreaterThan(20);
    await canvas.press("ArrowRight");
    expect((await matrix()).x).toBeLessThan(panned.x);
    await expect(activeArticle(page)).toHaveAttribute("data-piece-id", "death-of-socrates");
    const zoomGeometry = await viewerGeometry(dialog);
    expectFullCanvas(zoomGeometry);
    expect(zoomGeometry.image.left).toBeLessThanOrEqual(zoomGeometry.canvas.left);
    expect(zoomGeometry.image.top).toBeLessThanOrEqual(zoomGeometry.canvas.top);
    expect(zoomGeometry.image.right).toBeGreaterThanOrEqual(zoomGeometry.canvas.right);
    expect(zoomGeometry.image.bottom).toBeGreaterThanOrEqual(zoomGeometry.canvas.bottom);
    for (const overlay of ["close", "download", "heading"] as const) {
      for (const edge of ["top", "left", "right", "bottom"] as const) {
        expect(zoomGeometry[overlay][edge]).toBeCloseTo(fitGeometry[overlay][edge], 1);
      }
    }
    await writeFile(`${evidenceDirectory}/${device}-viewer-geometry.json`, JSON.stringify({ opening: openingGeometry, fit: fitGeometry, zoom: zoomGeometry }, null, 2));
    await capture(page, `${device}-viewer-zoomed`);

    await canvas.press("0");
    await expect(canvas).toHaveAttribute("data-zoom", "1.00");
    await expect(canvas).toHaveAttribute("data-animating", "false");
    expect(await matrix()).toEqual({ scale: 1, x: 0, y: 0 });
    await canvas.hover();
    await page.mouse.wheel(0, -160);
    await expect.poll(async () => Number(await canvas.getAttribute("data-zoom"))).toBeGreaterThan(1);
    await canvas.press("0");
    await expect(canvas).toHaveAttribute("data-zoom", "1.00");
    await expect(canvas).toHaveAttribute("data-animating", "false");
    await canvas.dblclick();
    await expect(canvas).toHaveAttribute("data-zoom", "2.50");
    await canvas.press("Home");
    await expect(canvas).toHaveAttribute("data-zoom", "1.00");

    const downloadLink = dialog.getByRole("link", { name: "Download image", exact: true });
    const sourceUrl = await downloadLink.getAttribute("href");
    expect(sourceUrl).toBe(new URL("/assets/content/viewer/death-of-socrates.jpg", page.url()).href);
    const [download] = await Promise.all([page.waitForEvent("download"), downloadLink.click()]);
    expect(download.suggestedFilename()).toMatch(/\.jpe?g$/i);
    const downloadPath = await download.path();
    expect(downloadPath).not.toBeNull();
    const bytes = await readFile(downloadPath!);
    expect([...bytes.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
    const original = await page.request.get(sourceUrl!);
    expect(original.ok()).toBe(true);
    expect(bytes.equals(await original.body())).toBe(true);
    const originalSize = await page.evaluate(async source => {
      const image = new Image(); image.src = source!; await image.decode();
      return { width: image.naturalWidth, height: image.naturalHeight };
    }, sourceUrl);
    expect(originalSize).toEqual({ width: 4000, height: 2663 });

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(opener).toBeFocused();
    const restoredIndicators = await liveIndicators(page);
    expect(restoredIndicators).toEqual(originalIndicators);
    await writeFile(`${evidenceDirectory}/${device}-device-indicators.json`, JSON.stringify({ original: originalIndicators, viewer: viewerIndicators, restored: restoredIndicators }, null, 2));
    await expect(activeArticle(page)).toHaveAttribute("data-piece-id", "death-of-socrates");

    // A cached source must still measure after the portal is mounted again.
    await opener.click();
    await expect(image).toBeVisible();
    expect(Number(await canvas.getAttribute("data-zoom"))).toBeGreaterThan(2);
    await canvas.press("Home");
    await expect(canvas).toHaveAttribute("data-zoom", "1.00");
    await expect(canvas).toHaveAttribute("data-animating", "false");
    await canvas.hover();
    await page.mouse.wheel(0, -160);
    await expect.poll(async () => Number(await canvas.getAttribute("data-zoom"))).toBeGreaterThan(1);
    await dialog.getByRole("button", { name: "Close image", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(opener).toBeFocused();

    // Integration coverage only: the separate Daily suite covers gesture arbitration.
    const daily = page.locator(".daily-screen");
    await daily.focus();
    await daily.press("ArrowRight");
    await expect(activeArticle(page)).toHaveAttribute("data-piece-id", "divine-comedy");
    await expect.poll(() => page.locator(".daily-pager").evaluate((element) => {
      const index = Number(element.querySelector<HTMLElement>('.daily-slide[data-active="true"]')!.dataset.index);
      return Math.abs(element.scrollLeft - element.clientWidth * index);
    })).toBeLessThan(1);
    await drag(page, activeArticle(page).locator(".today-hero"), -160);
    await expect(activeArticle(page)).toHaveAttribute("data-piece-id", "death-of-socrates");
  });
}

test("viewer captions render in the same 14px font with visible production dates", async ({ page, context }) => {
  await openToday(page);
  const session = await context.newCDPSession(page);
  await session.send("DOM.enable");
  await session.send("CSS.enable");
  const evidence = [];
  const daily = page.locator(".daily-screen");
  for (const record of [
    { id: "death-of-socrates", metadata: "Jacques-Louis David, 1787" },
    { id: "divine-comedy", metadata: "Dante Alighieri, c. 1321" },
    { id: "chart-of-hell", metadata: "Sandro Botticelli, c. 1480" },
    { id: "great-wave", metadata: "Katsushika Hokusai, c. 1831" },
    { id: "noh-mask", metadata: "Unknown, 19th century" },
    { id: "arabic-bowl", metadata: "Unknown, 10th century" },
    { id: "migrant-mother", metadata: "Dorothea Lange, 1936" },
    { id: "caligari", metadata: "Robert Wiene, 1920" },
    { id: "the-kiss", metadata: "Gustav Klimt, 1907–1908" },
    { id: "girl-pearl", metadata: "Johannes Vermeer, c. 1665" },
  ]) {
    await expect(activeArticle(page)).toHaveAttribute("data-piece-id", record.id);
    await activeArticle(page).locator(".today-hero").click();
    const dialog = page.getByTestId("artwork-viewer");
    await expect(dialog.locator(".artwork-viewer-heading p")).toHaveText(record.metadata);
    await page.evaluate(() => document.fonts.ready);
    const { root } = await session.send("DOM.getDocument");
    const texts = [];
    for (const selector of [".artwork-viewer-heading h2", ".artwork-viewer-heading p"]) {
      const caption = dialog.locator(selector);
      await expect(caption).toHaveCSS("font-size", "14px");
      await expect(caption).toHaveCSS("line-height", "18px");
      const { nodeId } = await session.send("DOM.querySelector", { nodeId: root.nodeId, selector });
      const { fonts } = await session.send("CSS.getPlatformFontsForNode", { nodeId });
      expect(fonts.filter(font => font.glyphCount > 0).map(font => font.postScriptName)).toEqual(["PPNeueMontrealTT-Regular"]);
      const metrics = await caption.evaluate(element => ({ text: element.textContent, scrollWidth: element.scrollWidth, clientWidth: element.clientWidth, scrollHeight: element.scrollHeight, clientHeight: element.clientHeight }));
      expect(metrics.scrollWidth, `${record.id}: production year remains visible`).toBeLessThanOrEqual(metrics.clientWidth);
      expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.clientHeight);
      texts.push({ metrics, fonts });
    }
    evidence.push({ record, texts });
    await capture(page, `${record.id}-caption`);
    await page.keyboard.press("Escape");
    await daily.focus();
    await daily.press("ArrowRight");
  }
  await writeFile(`${evidenceDirectory}/caption-fonts-dates.json`, JSON.stringify(evidence, null, 2));
  await session.detach();
});

for (const language of [
  { locale: "pt-BR", title: "A Morte de Sócrates", zoom: "Ver imagem em tela cheia", edited: "Última edição:" },
  { locale: "it", title: "La morte di Socrate", zoom: "Vedi l’immagine a schermo intero", edited: "Ultima modifica:" },
  { locale: "es", title: "La muerte de Sócrates", zoom: "Ver imagen en pantalla completa", edited: "Última edición:" },
]) {
  test(`${language.locale}: Today respects the saved language, dark theme, and larger reading text`, async ({ page }) => {
    await page.addInitScript(({ locale }) => {
      localStorage.setItem("daily-culture.preferences.v1", JSON.stringify({ locale, theme: "dark", textSize: "large" }));
    }, language);
    await openToday(page);
    const article = activeArticle(page);
    await expect(page.locator(".daily-culture-app")).toHaveAttribute("lang", language.locale);
    await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-text-size", "large");
    await expect(article.getByRole("heading", { level: 1 })).toHaveText(language.title);
    await expect(article.getByRole("button", { name: language.zoom, exact: true })).toBeVisible();
    await expect(article.locator(".today-last-edited")).toContainText(language.edited);
    await expect(article.locator(".today-last-edited time")).toHaveAttribute("dateTime", "2026-09-21T16:22:20Z");
    const reading = await article.evaluate((element) => {
      const copy = element.querySelector<HTMLElement>(".today-story-copy")!;
      const style = getComputedStyle(copy);
      return {
        fontSize: parseFloat(style.fontSize),
        lineHeight: parseFloat(style.lineHeight),
        overflow: element.scrollWidth - element.clientWidth,
        color: style.color,
        background: getComputedStyle(element.closest(".daily-culture-app")!).backgroundColor,
      };
    });
    expect(reading.fontSize).toBeGreaterThan(14);
    expect(reading.lineHeight).toBeGreaterThan(reading.fontSize);
    expect(reading.overflow).toBeLessThanOrEqual(1);
    expect(reading.color).not.toBe(reading.background);
  });
}

test.describe("touch viewing", () => {
  test.use({ hasTouch: true });

  test("two-finger pinch preserves editions, compact Today controls, and touch-sized viewer controls", async ({ page, context }) => {
    await openToday(page);
    expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);
    const opener = activeArticle(page).getByRole("button", { name: "View image in full screen", exact: true });
    const openerSize = await opener.evaluate((element) => ({ width: element.offsetWidth, height: element.offsetHeight }));
    expect(openerSize).toEqual({ width: 20, height: 20 });
    await opener.tap();
    const dialog = page.getByTestId("artwork-viewer");
    const canvas = page.getByTestId("artwork-viewer-canvas");
    await expect(dialog.locator(".artwork-viewer-image")).toBeVisible();
    const sizes = await dialog.locator("button, a[download]").evaluateAll((elements) => elements.map((element) => ({
      width: (element as HTMLElement).offsetWidth, height: (element as HTMLElement).offsetHeight,
    })));
    expect(sizes).toHaveLength(2);
    for (const size of sizes) {
      expect(size.width).toBeGreaterThanOrEqual(44);
      expect(size.height).toBeGreaterThanOrEqual(44);
    }
    const box = (await canvas.boundingBox())!;
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    const session = await context.newCDPSession(page);
    const points = (spread: number) => [
      { id: 1, x: cx - spread, y: cy, radiusX: 5, radiusY: 5 },
      { id: 2, x: cx + spread, y: cy, radiusX: 5, radiusY: 5 },
    ];
    // Chromium sends trusted multi-touch input through the browser's pointer path.
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: points(35) });
    for (let step = 1; step <= 6; step += 1) {
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: points(35 + step * 10) });
    }
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect.poll(async () => Number(await canvas.getAttribute("data-zoom"))).toBeGreaterThan(2);
    await expect(activeArticle(page)).toHaveAttribute("data-piece-id", "death-of-socrates");
    await canvas.press("Home");
    await expect(canvas).toHaveAttribute("data-zoom", "1.00");
    await page.emulateMedia({ reducedMotion: "reduce" });
    // A first early tap takes one zoom step; it must not count as a double-tap.
    // Reduced motion keeps the controlled clock independent of animation timing.
    for (const [time, zoom] of [[100, "1.60"], [180, "2.50"], [240, null], [300, "1.00"]] as const) {
      await page.evaluate((time) => Object.defineProperty(performance, "now", { configurable: true, value: () => time }), time);
      await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ id: 3, x: cx, y: cy, radiusX: 5, radiusY: 5 }] });
      await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      if (zoom) await expect(canvas).toHaveAttribute("data-zoom", zoom);
    }
    await page.evaluate(() => Reflect.deleteProperty(performance, "now"));
    await expect(activeArticle(page)).toHaveAttribute("data-piece-id", "death-of-socrates");
    await dialog.getByRole("button", { name: "Close image", exact: true }).tap();
    await expect(dialog).toHaveCount(0);
    await expect(activeArticle(page)).toHaveAttribute("data-piece-id", "death-of-socrates");
    await session.detach();
  });
});

test("a failed image offers retry and enables downloading once the source loads", async ({ page }) => {
  let failImage = true;
  await page.route("**/assets/content/viewer/tiles/death-of-socrates/preview.jpg", async (route) => {
    if (failImage) await route.abort("failed");
    else await route.continue();
  });
  await openToday(page);
  await activeArticle(page).getByRole("button", { name: "View image in full screen", exact: true }).click();
  const dialog = page.getByTestId("artwork-viewer");
  await expect(dialog.getByRole("status")).toContainText("This image could not load.");
  await expect(dialog.getByRole("button", { name: "Download image", exact: true })).toBeDisabled();
  failImage = false;
  await dialog.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(dialog.locator(".artwork-viewer-image")).toBeVisible();
  await expect(dialog.locator(".artwork-viewer-plane")).toHaveAttribute("data-source-width", "4000");
  await expect(dialog.getByRole("link", { name: "Download image", exact: true })).toBeVisible();
  await expect(dialog.getByRole("status")).toHaveCount(0);
});

test("preview and visible native detail tiles load lazily while download keeps the original", async ({ page }) => {
  const viewerRequests: string[] = [];
  page.on("request", (request) => {
    const path = new URL(request.url()).pathname;
    if (path.startsWith("/assets/content/viewer/")) viewerRequests.push(path);
  });
  await openToday(page);
  expect(viewerRequests).toEqual([]);
  const daily = page.locator(".daily-screen");
  await daily.focus();
  await daily.press("ArrowRight");
  await expect(activeArticle(page)).toHaveAttribute("data-piece-id", "divine-comedy");
  await daily.press("ArrowRight");
  await expect(activeArticle(page)).toHaveAttribute("data-piece-id", "chart-of-hell");
  await daily.press("ArrowRight");
  await expect(activeArticle(page)).toHaveAttribute("data-piece-id", "great-wave");
  expect(viewerRequests).toEqual([]);
  await activeArticle(page).getByRole("button", { name: "View image in detail: The Great Wave off Kanagawa", exact: true }).click();
  const dialog = page.getByTestId("artwork-viewer");
  const image = dialog.locator(".artwork-viewer-image");
  const plane = dialog.locator(".artwork-viewer-plane");
  const canvas = page.getByTestId("artwork-viewer-canvas");
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute("src", "/assets/content/viewer/tiles/great-wave/preview.jpg");
  await expect(plane).toHaveAttribute("data-source-width", "4096");
  await expect(plane).toHaveAttribute("data-source-height", "2888");
  expect(await image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeLessThan(4096);
  expect(viewerRequests).toContain("/assets/content/viewer/tiles/great-wave/preview.jpg");
  await expect.poll(() => viewerRequests.some(path => /\/great-wave\/\d+_\d+\.jpg$/.test(path))).toBe(true);
  await expect.poll(() => dialog.locator('.artwork-viewer-tile[data-ready="true"]').count()).toBeGreaterThan(0);
  expect(Number(await canvas.getAttribute("data-zoom"))).toBeGreaterThan(2);
  await expect(dialog.locator(".artwork-viewer-heading p")).toHaveText("Katsushika Hokusai, c. 1831");
  expect(await dialog.locator(".artwork-viewer-heading p").evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);

  // Jump directly to detail scale: only the visible area and its tile margin are needed.
  await canvas.hover();
  await page.mouse.wheel(0, -900);
  await expect.poll(async () => Number(await canvas.getAttribute("data-zoom"))).toBeGreaterThan(5);
  await expect.poll(() => dialog.locator('.artwork-viewer-tile[data-ready="true"]').count()).toBeGreaterThan(0);
  await expect.poll(() => dialog.locator('.artwork-viewer-tile[data-ready="true"]').evaluateAll(elements => elements.every(element => getComputedStyle(element).opacity === "1"))).toBe(true);
  const tiles = await dialog.locator('.artwork-viewer-tile[data-ready="true"]').evaluateAll((elements) => elements.map((element) => {
    const tile = element as HTMLImageElement;
    return { source: tile.getAttribute("src"), width: tile.naturalWidth, height: tile.naturalHeight, opacity: getComputedStyle(tile).opacity };
  }));
  expect(tiles.length).toBeLessThan(48);
  expect(tiles.every(tile => tile.width > 0 && tile.width <= 514 && tile.height > 0 && tile.height <= 514)).toBe(true);
  expect(tiles.some(tile => tile.width >= 512 && tile.height >= 512)).toBe(true);
  expect(tiles.every(tile => tile.opacity === "1")).toBe(true);
  expect(viewerRequests.some(path => /\/great-wave\/\d+_\d+\.jpg$/.test(path))).toBe(true);
  expect(viewerRequests).not.toContain("/assets/content/viewer/great-wave.jpg");
  await expect(image).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Download image", exact: true })).toHaveAttribute(
    "href", new URL("/assets/content/viewer/great-wave.jpg", page.url()).href,
  );
  await capture(page, "great-wave-native-detail");
  const detailRequests = [...viewerRequests];
  const recordZoomOut = canvas.evaluate((element) => new Promise<{ scale: number; readyTiles: number }[]>((resolve, reject) => {
    const frames: { scale: number; readyTiles: number }[] = [];
    const start = performance.now();
    let moving = false;
    const sample = () => {
      const scale = Number(element.getAttribute("data-zoom"));
      const animating = element.getAttribute("data-animating") === "true";
      if (animating) moving = true;
      if (animating && scale > 1.3) frames.push({ scale, readyTiles: element.querySelectorAll('.artwork-viewer-tile[data-ready="true"]').length });
      if (moving && !animating) { resolve(frames); return; }
      if (performance.now() - start > 2000) { reject(new Error("Zoom-out animation did not settle")); return; }
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  }));
  await canvas.press("Home");
  const zoomOutFrames = await recordZoomOut;
  expect(new Set(zoomOutFrames.map(frame => frame.scale)).size).toBeGreaterThan(2);
  expect(zoomOutFrames.every(frame => frame.readyTiles > 0), "Decoded detail must remain visible during zoom-out").toBe(true);
  await expect(canvas).toHaveAttribute("data-zoom", "1.00");
  await writeFile(`${evidenceDirectory}/tile-delivery.json`, JSON.stringify({ detailRequests, viewerRequests, tiles, zoomOutFrames }, null, 2));
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(activeArticle(page)).toHaveAttribute("data-piece-id", "great-wave");
});

test("opening tiles visibly reveal after native decoding on fresh and cached opens", async ({ page, context }) => {
  type TileFrame = { time: number; tiles: { id: number; source: string; opacity: number; maskOpacity: number; delay: number; ready: boolean; decoded: boolean; width: number; height: number }[] };
  type FadeProbe = { decoded: WeakSet<HTMLImageElement>; ids: WeakMap<HTMLImageElement, number>; nextId: number; frames: TileFrame[]; running: boolean };
  await page.addInitScript(() => {
    const probe = { decoded: new WeakSet<HTMLImageElement>(), ids: new WeakMap<HTMLImageElement, number>(), nextId: 1, frames: [], running: false };
    (window as unknown as { tileFadeProbe: typeof probe }).tileFadeProbe = probe;
    const decode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = function () {
      const promise = decode.call(this);
      // Observe native decoding without delaying it or changing animation timing.
      void promise.then(() => probe.decoded.add(this)).catch(() => {});
      return promise;
    };
  });
  await openToday(page);
  await page.evaluate(() => document.fonts.ready);
  const opener = activeArticle(page).getByRole("button", { name: "View image in full screen", exact: true });
  const dialog = page.getByTestId("artwork-viewer");
  const canvas = page.getByTestId("artwork-viewer-canvas");
  const screen = (await page.getByTestId("device-screen").boundingBox())!;
  // Interior image pixels: exclude native status chrome, captions and controls.
  const clip = { x: screen.x + 4, y: screen.y + screen.height * .25, width: screen.width - 8, height: screen.height * .48, scale: 1 };
  const session = await context.newCDPSession(page);
  const evidence: Record<string, { frames: TileFrame[]; pixelChange: unknown }> = {};
  await mkdir(evidenceDirectory, { recursive: true });
  for (const phase of ["fresh-open", "cached-reopen"]) {
    await expect(dialog).toHaveCount(0);
    await page.evaluate(() => {
      const probe = (window as unknown as { tileFadeProbe: FadeProbe }).tileFadeProbe;
      probe.frames = [];
      probe.running = true;
      const sample = () => {
        if (!probe.running) return;
        const tiles = Array.from(document.querySelectorAll<HTMLImageElement>(".artwork-viewer-tile")).map(tile => {
          if (!probe.ids.has(tile)) probe.ids.set(tile, probe.nextId++);
          const cell = tile.parentElement!;
          return {
            id: probe.ids.get(tile)!, source: tile.getAttribute("src")!, opacity: Number(getComputedStyle(tile).opacity),
            maskOpacity: Number(getComputedStyle(cell, "::before").opacity), delay: parseFloat(getComputedStyle(tile).transitionDelay),
            ready: tile.dataset.ready === "true", decoded: probe.decoded.has(tile), width: tile.naturalWidth, height: tile.naturalHeight,
          };
        });
        if (tiles.length) probe.frames.push({ time: performance.now(), tiles });
        requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    await opener.click();
    await page.mouse.move(10, 10);
    await expect(dialog.locator(".artwork-viewer-image")).toBeVisible();
    const captures: string[] = [];
    for (let index = 0; index < 3; index += 1) {
      const screenshot = await session.send("Page.captureScreenshot", { format: "png", clip, captureBeyondViewport: false });
      captures.push(screenshot.data);
      await writeFile(`${evidenceDirectory}/${phase}-reveal-${index + 1}.png`, Buffer.from(screenshot.data, "base64"));
      await page.waitForTimeout(50);
    }
    await expect.poll(() => dialog.locator(".artwork-viewer-tile").evaluateAll(elements =>
      elements.length > 0 && elements.every(element => element.getAttribute("data-ready") === "true" && getComputedStyle(element).opacity === "1"),
    )).toBe(true);
    const settled = await session.send("Page.captureScreenshot", { format: "png", clip, captureBeyondViewport: false });
    await writeFile(`${evidenceDirectory}/${phase}-settled-detail.png`, Buffer.from(settled.data, "base64"));
    await capture(page, `${phase}-settled`);
    const frames = await page.evaluate(() => {
      const probe = (window as unknown as { tileFadeProbe: FadeProbe }).tileFadeProbe;
      probe.running = false;
      return probe.frames;
    });
    const samples = frames.flatMap(frame => frame.tiles);
    const intermediate = samples.filter(tile => tile.opacity > 0 && tile.opacity < 1);
    expect(new Set(intermediate.map(tile => tile.opacity)).size, `${phase}: actual intermediate rendered opacity values`).toBeGreaterThan(2);
    expect(samples.some(tile => tile.opacity === 0 && tile.maskOpacity > .6), `${phase}: visible dark initial tile mask`).toBe(true);
    expect(samples.some(tile => tile.maskOpacity > 0 && tile.maskOpacity < .6), `${phase}: mask visibly fades`).toBe(true);
    expect(samples.some(tile => tile.opacity === 1 && tile.maskOpacity === 0)).toBe(true);
    expect(samples.filter(tile => tile.ready || tile.opacity > 0).every(tile => tile.decoded), `${phase}: reveal follows native decode`).toBe(true);
    expect(intermediate.every(tile => tile.width > 0 && tile.width <= 514 && tile.height > 0 && tile.height <= 514)).toBe(true);
    expect(new Set(samples.map(tile => tile.delay)).size).toBeGreaterThan(1);
    const pixelChange = await page.evaluate(async ({ first, last }) => {
      const pixels = async (data: string) => {
        const image = new Image(); image.src = `data:image/png;base64,${data}`; await image.decode();
        const canvas = document.createElement("canvas"); canvas.width = image.width; canvas.height = image.height;
        const ctx = canvas.getContext("2d")!; ctx.drawImage(image, 0, 0);
        return ctx.getImageData(0, 0, image.width, image.height).data;
      };
      const [a, b] = await Promise.all([pixels(first), pixels(last)]);
      let total = 0, changed = 0;
      for (let i = 0; i < a.length; i += 4) {
        const difference = (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2])) / 3;
        total += difference; if (difference > 12) changed += 1;
      }
      return { meanAbsoluteRgbDifference: total / (a.length / 4), fractionChangingByOver12: changed / (a.length / 4), pixels: a.length / 4 };
    }, { first: captures[0], last: settled.data });
    expect(pixelChange.meanAbsoluteRgbDifference, `${phase}: actual rendered artwork pixels visibly change`).toBeGreaterThan(2);
    expect(pixelChange.fractionChangingByOver12).toBeGreaterThan(.1);
    evidence[phase] = { frames, pixelChange };
    expect(await dialog.locator(".artwork-viewer-image").evaluate(element => ({ width: (element as HTMLImageElement).naturalWidth, height: (element as HTMLImageElement).naturalHeight })))
      .toEqual({ width: 768, height: 511 });
    await expect(canvas).toHaveAttribute("data-animating", "false");
    // Opening reveal does not depend on any tap, zoom, wheel, or reset.
    expect(Number(await canvas.getAttribute("data-zoom"))).toBeGreaterThan(2);
    await page.keyboard.press("Escape");
    await expect(opener).toBeFocused();
  }
  const ids = Object.values(evidence).map(phase => new Set(phase.frames.flatMap(frame => frame.tiles.map(tile => tile.id))));
  expect([...ids[0]].every(id => !ids[1].has(id))).toBe(true);
  await writeFile(`${evidenceDirectory}/opening-tile-fade-frames.json`, JSON.stringify(evidence, null, 2));
  await session.detach();
});

test("a failed optional detail tile keeps the preview and controls usable", async ({ page }) => {
  let failedTiles = 0;
  await page.route(/\/viewer\/tiles\/death-of-socrates\/\d+_\d+\.jpg$/, async (route) => {
    failedTiles += 1;
    await route.abort("failed");
  });
  await openToday(page);
  await activeArticle(page).locator(".today-hero").click();
  const dialog = page.getByTestId("artwork-viewer");
  const canvas = page.getByTestId("artwork-viewer-canvas");
  await expect(dialog.locator(".artwork-viewer-image")).toBeVisible();
  await canvas.press("Shift+Equal");
  await expect(canvas).toHaveAttribute("data-animating", "false");
  await expect.poll(() => failedTiles).toBeGreaterThan(0);
  await expect(dialog.locator('.artwork-viewer-tile[data-ready="true"]')).toHaveCount(0);
  await expect.poll(() => dialog.locator('.artwork-viewer-tile-cell[data-failed="true"]').count()).toBeGreaterThan(0);
  expect(await dialog.locator('.artwork-viewer-tile-cell[data-failed="true"]').evaluateAll(elements => elements.every(element => getComputedStyle(element, "::before").opacity === "0"))).toBe(true);
  await expect(dialog.locator(".artwork-viewer-image")).toBeVisible();
  expect(await dialog.locator(".artwork-viewer-image").evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await expect(dialog.getByRole("status")).toHaveCount(0);
  await expect(dialog.locator("button, a[download]")).toHaveCount(2);
  await expect(dialog.getByRole("link", { name: "Download image", exact: true })).toBeVisible();
  await capture(page, "detail-failure-preview-fallback");
  await canvas.press("0");
  await expect(canvas).toHaveAttribute("data-zoom", "1.00");
});

test("point zoom animates around the selected detail and dragging interrupts it", async ({ page }) => {
  await openToday(page);
  await activeArticle(page).locator(".today-hero").click();
  const dialog = page.getByTestId("artwork-viewer");
  const canvas = page.getByTestId("artwork-viewer-canvas");
  const plane = dialog.locator(".artwork-viewer-plane");
  await expect(dialog.locator(".artwork-viewer-image")).toBeVisible();
  await canvas.press("Home");
  await expect(canvas).toHaveAttribute("data-zoom", "1.00");
  await expect(canvas).toHaveAttribute("data-animating", "false");
  const matrix = () => plane.evaluate((element) => {
    const value = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    const canvas = element.closest<HTMLElement>(".artwork-viewer-canvas")!;
    const fitWidth = Math.min(canvas.clientWidth, canvas.clientHeight * 4000 / 2663);
    return { scale: parseFloat(getComputedStyle(element).width) / fitWidth, x: value.e, y: value.f };
  });
  await page.evaluate(() => {
    const canvas = document.querySelector<HTMLElement>(".artwork-viewer-canvas")!;
    const frames: { time: number; scale: number }[] = [];
    (window as unknown as { galleryZoomFrames: typeof frames }).galleryZoomFrames = frames;
    const sample = () => {
      if (canvas.dataset.animating === "true") frames.push({ time: performance.now(), scale: Number(canvas.dataset.zoom) });
      if (canvas.isConnected) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  const bounds = (await canvas.boundingBox())!;
  const cssWidth = await canvas.evaluate(element => element.clientWidth);
  const screenScale = bounds.width / cssWidth;
  const point = { x: 50, y: 0 };
  await page.mouse.click(bounds.x + bounds.width / 2 + point.x * screenScale, bounds.y + bounds.height / 2);
  await expect(canvas).toHaveAttribute("data-zoom", "1.60");
  await expect(canvas).toHaveAttribute("data-animating", "false");
  const anchored = await matrix();
  expect(anchored.x).toBeCloseTo(point.x * (1 - anchored.scale), 1);
  expect(anchored.y).toBeCloseTo(0, 1);
  const frames = await page.evaluate(() => (window as unknown as { galleryZoomFrames: { time: number; scale: number }[] }).galleryZoomFrames);
  expect(new Set(frames.filter(frame => frame.scale > 1 && frame.scale < 1.6).map(frame => frame.scale)).size).toBeGreaterThan(2);
  await capture(page, "anchored-point-zoom");

  await canvas.press("Home");
  await expect(canvas).toHaveAttribute("data-zoom", "1.00");
  await expect(canvas).toHaveAttribute("data-animating", "false");
  await canvas.click();
  await expect(canvas).toHaveAttribute("data-animating", "true");
  await page.waitForTimeout(60);
  await drag(page, canvas, 40);
  await expect(canvas).toHaveAttribute("data-animating", "false");
  const interrupted = await matrix();
  expect(interrupted.scale).toBeGreaterThan(1);
  expect(interrupted.scale).toBeLessThan(1.6);
  await page.waitForTimeout(400);
  expect(await matrix()).toEqual(interrupted);
  await expect(activeArticle(page)).toHaveAttribute("data-piece-id", "death-of-socrates");
  await writeFile(`${evidenceDirectory}/point-zoom-motion.json`, JSON.stringify({ point, anchored, frames, interrupted }, null, 2));
});

test("reduced motion applies point and keyboard zoom immediately", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openToday(page);
  await activeArticle(page).locator(".today-hero").click();
  const canvas = page.getByTestId("artwork-viewer-canvas");
  await expect(page.locator(".artwork-viewer-image")).toBeVisible();
  await expect.poll(() => page.locator('.artwork-viewer-tile[data-ready="true"]').count()).toBeGreaterThan(0);
  const reducedTiles = await page.locator('.artwork-viewer-tile').evaluateAll(elements => elements.map(element => ({
    transition: getComputedStyle(element).transitionDuration,
    maskTransition: getComputedStyle(element.parentElement!, "::before").transitionDuration,
  })));
  expect(reducedTiles.every(tile => tile.transition === "0s" && tile.maskTransition === "0s")).toBe(true);
  await canvas.press("Home");
  expect(await canvas.getAttribute("data-zoom")).toBe("1.00");
  await canvas.click();
  expect(await canvas.getAttribute("data-zoom")).toBe("1.60");
  expect(await canvas.getAttribute("data-animating")).toBe("false");
  await canvas.press("0");
  expect(await canvas.getAttribute("data-zoom")).toBe("1.00");
  await canvas.press("Shift+Equal");
  expect(Number(await canvas.getAttribute("data-zoom"))).toBeGreaterThan(1);
  expect(await canvas.getAttribute("data-animating")).toBe("false");
});
