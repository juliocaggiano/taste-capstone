import { expect, test, type Page } from "@playwright/test";

const activeArticle = (page: Page) => page.locator('.daily-slide[data-active="true"] .today-article');
const countValue = (page: Page) => activeArticle(page).locator(".today-save-count-value");

type CountFrame = {
  text: string;
  digits: { text: string; y: number; opacity: number }[][];
};
type CountSampler = { frames: CountFrame[]; running: boolean };

async function openToday(page: Page) {
  await page.goto("/");
  await expect(activeArticle(page)).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect(countValue(page)).toHaveText("+65");
  await expect(activeArticle(page).locator(".today-save-primary")).toHaveAttribute("aria-pressed", "false");
}

async function startSampling(page: Page) {
  await page.evaluate(() => {
    const count = document.querySelector<HTMLElement>('.daily-slide[data-active="true"] .today-save-count-value')!;
    const sample: CountSampler = { frames: [], running: true };
    (window as unknown as { saveCountSampler: CountSampler }).saveCountSampler = sample;
    const frame = () => {
      if (!sample.running || !count.isConnected) return;
      sample.frames.push({
        text: count.textContent ?? "",
        digits: Array.from(count.querySelectorAll(".today-save-digit")).map(digit =>
          Array.from(digit.querySelectorAll(".today-save-digit-glyph")).map(glyph => {
            const style = getComputedStyle(glyph);
            return { text: glyph.textContent ?? "", y: new DOMMatrixReadOnly(style.transform).m42, opacity: Number(style.opacity) };
          }),
        ),
      });
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
}

async function stopSampling(page: Page): Promise<CountFrame[]> {
  return page.evaluate(() => {
    const sample = (window as unknown as { saveCountSampler: CountSampler }).saveCountSampler;
    sample.running = false;
    return sample.frames;
  });
}

async function expectSettled(page: Page, value: number) {
  await expect(countValue(page)).toHaveText(`+${value}`);
  await expect.poll(() => countValue(page).evaluate(element => {
    const glyphs = Array.from(element.querySelectorAll(".today-save-digit-glyph"));
    return glyphs.length === 2 && glyphs.every(glyph => {
      const style = getComputedStyle(glyph);
      return Math.abs(new DOMMatrixReadOnly(style.transform).m42) < .01 && Number(style.opacity) === 1;
    });
  })).toBe(true);
}

test("Save rolls only the changed digit upward and unsave reverses it", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openToday(page);
  const save = activeArticle(page).locator(".today-save-primary");

  await startSampling(page);
  await save.click();
  await expect(save).toHaveAttribute("aria-pressed", "true");
  await expectSettled(page, 66);
  const increment = await stopSampling(page);
  expect(increment.some(frame => frame.digits[1]?.some(glyph => glyph.text === "5" && glyph.y < -.1))).toBe(true);
  expect(increment.some(frame => frame.digits[1]?.some(glyph => glyph.text === "6" && glyph.y > .1))).toBe(true);
  expect(increment.every(frame => frame.digits[0]?.length === 1 && frame.digits[0][0].text === "6" && Math.abs(frame.digits[0][0].y) < .01)).toBe(true);

  await startSampling(page);
  await save.click();
  await expect(save).toHaveAttribute("aria-pressed", "false");
  await expectSettled(page, 65);
  const decrement = await stopSampling(page);
  expect(decrement.some(frame => frame.digits[1]?.some(glyph => glyph.text === "6" && glyph.y > .1))).toBe(true);
  expect(decrement.some(frame => frame.digits[1]?.some(glyph => glyph.text === "5" && glyph.y < -.1))).toBe(true);
  expect(decrement.every(frame => frame.digits[0]?.length === 1 && frame.digits[0][0].text === "6" && Math.abs(frame.digits[0][0].y) < .01)).toBe(true);
});

test("rapid Save toggles settle on the current count without leftover digits", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openToday(page);
  const save = activeArticle(page).locator(".today-save-primary");
  const bounds = await save.boundingBox();
  if (!bounds) throw new Error("Save button has no visible bounds");
  const point = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };

  for (let index = 0; index < 5; index += 1) {
    await page.mouse.click(point.x, point.y);
    // Reverse before the 240ms digit motion finishes.
    await page.waitForTimeout(35);
  }
  await expect(save).toHaveAttribute("aria-pressed", "true");
  await expectSettled(page, 66);
  await expect(countValue(page).locator(".today-save-digit-glyph")).toHaveCount(2);
  await save.click();
  await expectSettled(page, 65);
});

test("reduced motion changes the count immediately without rolling digits", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openToday(page);
  const save = activeArticle(page).locator(".today-save-primary");

  await startSampling(page);
  await save.click();
  await expect(save).toHaveAttribute("aria-pressed", "true");
  await expect(countValue(page)).toHaveText("+66");
  await save.click();
  await expect(save).toHaveAttribute("aria-pressed", "false");
  await expect(countValue(page)).toHaveText("+65");
  const frames = await stopSampling(page);
  expect(frames.length).toBeGreaterThan(0);
  expect(frames.every(frame => frame.text === "+65" || frame.text === "+66")).toBe(true);
  expect(frames.every(frame => frame.digits.length === 0)).toBe(true);
  await expect(countValue(page).locator(".today-save-digit-glyph")).toHaveCount(0);
});
