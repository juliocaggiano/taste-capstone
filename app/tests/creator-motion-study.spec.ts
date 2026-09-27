import { expect, test, type Page } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const evidence = fileURLToPath(new URL("../../qa/creator-motion-variations-2026-09-23/", import.meta.url));
const modes = ["slide", "glide", "dissolve"] as const;
const layer = (page: Page) => page.locator(".creator-page-transition");
const front = (page: Page) => page.locator(".creator-page-transition-surface");
const creatorTrigger = (page: Page) => page.locator('.daily-slide[data-active="true"]')
  .getByRole("button", { name: "Open creator profile for Jacques-Louis David", exact: true }).last();

test.beforeAll(async () => { await mkdir(evidence, { recursive: true }); });

async function observeStorage(page: Page) {
  await page.addInitScript(() => {
    const calls: string[] = [];
    Object.defineProperty(window, "__studyStorageWrites", { value: calls });
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (this === localStorage && /daily-culture.*(?:preferences|favourites|followed-creators|collections)/.test(key)) calls.push(key);
      original.call(this, key, value);
    };
  });
}

async function expectNoStorageWrites(page: Page) {
  expect(await page.evaluate(() => (window as unknown as { __studyStorageWrites: string[] }).__studyStorageWrites)).toEqual([]);
}

async function waitForOpen(page: Page) {
  await expect(layer(page)).toHaveAttribute("data-phase", "open");
  await expect(front(page)).toHaveCSS("transform", "none");
  await expect(front(page)).toHaveCSS("opacity", "1");
}

async function sampleClose(page: Page) {
  return page.evaluate(async () => {
    const surface = document.querySelector<HTMLElement>(".creator-page-transition-surface")!;
    const width = surface.clientWidth;
    const samples: { ms: number; x: number; y: number; sx: number; sy: number; opacity: number; radius: number; parentX: number; parentY: number; parentOpacity: number; statusY: number }[] = [];
    document.querySelector<HTMLButtonElement>(".creator-reference-back")!.click();
    const start = performance.now();
    while (performance.now() - start < 600) {
      const element = document.querySelector(".creator-page-transition-surface");
      if (!element) break;
      const style = getComputedStyle(element);
      const matrix = new DOMMatrixReadOnly(style.transform);
      const parentStyle = getComputedStyle(document.querySelector(".app-page-surface")!);
      const parentMatrix = new DOMMatrixReadOnly(parentStyle.transform);
      samples.push({ ms: performance.now() - start, x: matrix.e, y: matrix.f, sx: matrix.a, sy: matrix.d,
        opacity: Number(style.opacity), radius: parseFloat(style.borderRadius), parentX: parentMatrix.e,
        parentY: parentMatrix.f, parentOpacity: Number(parentStyle.opacity),
        statusY: document.querySelector(".status-bar")!.getBoundingClientRect().y });
      await new Promise(requestAnimationFrame);
    }
    return { width, samples, elapsed: performance.now() - start };
  });
}

for (const [index, mode] of modes.entries()) {
  const device = index === 1 ? "pixel-10" : "iphone";
  test(`${mode}: full-size return retains reading position and focus on ${device}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await observeStorage(page);
    await page.goto(`/?creator-motion-study=${mode}`);
    if (device === "pixel-10") {
      await page.getByTestId("device-picker").click();
      await page.getByTestId("device-option-pixel-10").click();
    }
    await expect(layer(page)).toHaveAttribute("data-variant", mode);
    await waitForOpen(page);
    await page.getByRole("button", { name: "Close creator profile", exact: true }).click();
    await expect(layer(page)).toHaveCount(0);
    const trigger = creatorTrigger(page);
    await trigger.scrollIntoViewIfNeeded();
    const scroll = page.locator(".app-page-surface .mobile-scroll");
    const parent = await scroll.elementHandle();
    const before = await scroll.evaluate(element => element.scrollTop);
    expect(before).toBeGreaterThan(100);
    await trigger.click();
    await waitForOpen(page);
    await expect(page.locator(".app-page-surface")).toHaveAttribute("inert");
    await page.getByTestId("phone-frame").screenshot({ path: `${evidence}/${mode}-${device}-open.png` });
    const { width, samples, elapsed } = await sampleClose(page);
    expect(samples.length).toBeGreaterThan(3);
    expect(samples.every(s => Math.abs(s.sx - 1) < .001 && Math.abs(s.sy - 1) < .001 && Math.abs(s.y) < .001 && s.radius === 0)).toBe(true);
    expect(samples.every(s => Math.abs(s.parentY) < .001 && Math.abs(s.statusY - samples[0].statusY) < .1)).toBe(true);
    if (mode === "slide") {
      expect(samples.every(s => s.opacity === 1)).toBe(true);
      expect(samples.some(s => s.x > width * .75)).toBe(true);
      expect(samples[0].parentX).toBeLessThan(-width * .05);
      expect(samples.at(-1)!.parentX).toBeGreaterThan(-2);
    } else if (mode === "glide") {
      expect(samples.every(s => s.x >= -.01 && s.x <= 28.01)).toBe(true);
      expect(samples.some(s => s.x > 24 && s.opacity < .1)).toBe(true);
      expect(samples.filter(s => s.ms >= 125).every(s => s.opacity < .05)).toBe(true);
    } else {
      expect(samples.every(s => Math.abs(s.x) < .001 && Math.abs(s.parentX) < .001)).toBe(true);
      expect(samples.filter(s => s.ms >= 110).every(s => s.opacity < .05)).toBe(true);
      expect(samples.filter(s => s.ms < 60).every(s => s.parentOpacity < .05)).toBe(true);
    }
    await expect(layer(page)).toHaveCount(0);
    await expect(trigger).toBeFocused();
    expect(await parent!.evaluate(element => element.isConnected)).toBe(true);
    expect(await scroll.evaluate(element => element.scrollTop)).toBe(before);
    await page.getByTestId("phone-frame").screenshot({ path: `${evidence}/${mode}-${device}-returned.png` });
    await expectNoStorageWrites(page);
    expect(errors).toEqual([]);
    await writeFile(`${evidence}/${mode}-${device}-motion.json`, JSON.stringify({ before, width, elapsed, samples, errors }, null, 2));
  });
}

test("all variations handle immediate close and reduced motion without persistence", async ({ page }) => {
  await observeStorage(page);
  for (const mode of modes) {
    await page.goto(`/?creator-motion-study=${mode}`, { waitUntil: "domcontentloaded" });
    // Native activation avoids Playwright waiting for a moving button to settle.
    await page.locator(".creator-reference-back").evaluate((button: HTMLButtonElement) => button.click());
    await expect(layer(page)).toHaveCount(0, { timeout: 1000 });
    await expectNoStorageWrites(page);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const mode of modes) {
    await page.goto(`/?creator-motion-study=${mode}`);
    await waitForOpen(page);
    await page.getByRole("button", { name: "Close creator profile", exact: true }).click();
    await expect(layer(page)).toHaveCount(0, { timeout: 200 });
    const trigger = creatorTrigger(page);
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    await waitForOpen(page);
    await page.keyboard.press("Escape");
    await expect(layer(page)).toHaveCount(0, { timeout: 200 });
    await expect(trigger).toBeFocused();
    await expectNoStorageWrites(page);
  }
});

test("study selection does not replace the selected slide default", async ({ page }) => {
  await page.goto("/?creator-motion-study=glide");
  await waitForOpen(page);
  await page.goto("/");
  await expect(layer(page)).toHaveCount(0);
  await page.locator('.daily-slide[data-active="true"] .today-creator button').click();
  await expect(layer(page)).toHaveAttribute("data-variant", "slide");
  await waitForOpen(page);
  const { samples, width } = await sampleClose(page);
  expect(samples.every(s => s.sx === 1 && s.sy === 1 && s.y === 0 && s.radius === 0 && s.opacity === 1)).toBe(true);
  expect(samples.some(s => s.x > width * .75)).toBe(true);
  await expect(layer(page)).toHaveCount(0);
});

test("comparison controls operate all three real profiles and narrow selection", async ({ page }) => {
  await observeStorage(page);
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/motion-study.html");
  for (const mode of modes) await expect(page.locator(`article[data-variant="${mode}"] .state`)).toHaveText("Artist profile open");
  await page.getByRole("button", { name: "Close all", exact: true }).click();
  for (const mode of modes) {
    await expect(page.locator(`article[data-variant="${mode}"] .state`)).toHaveText("Previous page restored");
    await expect(page.frameLocator(`article[data-variant="${mode}"] iframe`).locator(".creator-page-transition")).toHaveCount(0);
  }
  await page.getByRole("button", { name: "Open all", exact: true }).click();
  for (const mode of modes) {
    const frame = page.frameLocator(`article[data-variant="${mode}"] iframe`);
    await expect(frame.locator(".creator-page-transition")).toHaveAttribute("data-variant", mode);
    await expect(frame.locator(".creator-page-transition-surface")).toHaveCSS("transform", "none");
    await expect(frame.locator(".creator-page-transition-surface")).toHaveCSS("opacity", "1");
  }
  await page.screenshot({ path: `${evidence}/comparison-desktop.png`, fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "02 Short glide", exact: true }).click();
  await expect(page.locator('article[data-variant="glide"]')).toBeVisible();
  await expect(page.locator('article[data-variant="slide"]')).toBeHidden();
  await expect(page.locator('article[data-variant="dissolve"]')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: `${evidence}/comparison-narrow.png`, fullPage: true });
  for (const frame of page.frames()) expect(await frame.evaluate(() => (window as unknown as { __studyStorageWrites: string[] }).__studyStorageWrites)).toEqual([]);
});
