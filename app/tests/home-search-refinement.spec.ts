import { expect, test, type Page } from "@playwright/test";

const article = (page: Page) => page.locator('.daily-slide[data-active="true"] .today-article');
const trigger = (page: Page) => article(page).getByRole("button", { name: "Search stories", exact: true });
const search = (page: Page) => page.locator(".home-search-surface");
const field = (page: Page) => search(page).locator(".discover-search input");
const resultScroll = (page: Page) => search(page).locator(".app-scroll > .mobile-scroll");
const results = (page: Page) => search(page).locator(".discover-artwork-card");
const scopes = (page: Page) => search(page).getByRole("radiogroup", { name: "Search filters", exact: true });
const keyboard = (page: Page) => page.locator(".keyboard-dock");
const storyBack = (page: Page) => page.getByRole("button", { name: "Close story", exact: true });
const filterSheet = (page: Page) => page.getByRole("dialog", { name: "Sort & Filter", exact: true });

async function openApp(page: Page, theme: "light" | "dark" = "light") {
  await page.addInitScript(selectedTheme => {
    localStorage.setItem("daily-culture.preferences.v1", JSON.stringify({ locale: "en", theme: selectedTheme, textSize: "default" }));
    localStorage.setItem("daily-culture-followed-people-v1", "[]");
  }, theme);
  await page.goto("/");
  await expect(article(page)).toHaveAttribute("data-piece-id", "death-of-socrates");
  await page.evaluate(() => document.fonts.ready);
}

async function expectOpen(page: Page, height: 32 | 44 = 32) {
  await expect(search(page)).toBeVisible();
  await expect(field(page)).toBeFocused();
  await expect(keyboard(page)).toHaveAttribute("data-visible", "true");
  await expect(search(page).locator(".discover-search")).toHaveCSS("height", `${height}px`);
  await expect(scopes(page).getByRole("radio")).toHaveText(["Artworks", "Artists", "Accounts", "Medium"]);
  await expect(search(page).getByRole("heading", { name: "Gallery", exact: true })).toBeVisible();
  await expect(search(page).getByRole("button", { name: "Filters", exact: true })).toBeVisible();
  await expect(page.locator(".bottom-nav")).toHaveCount(0);
}

async function expectClosed(page: Page) {
  await expect(search(page)).toHaveCount(0);
  await expect(keyboard(page)).toHaveAttribute("data-visible", "false");
  await expect(trigger(page)).toBeFocused();
}

async function chooseScope(page: Page, name: "Artworks" | "Artists" | "Accounts" | "Medium") {
  await scopes(page).getByRole("radio", { name, exact: true }).click();
  await expect(scopes(page).getByRole("radio", { name, exact: true })).toHaveAttribute("aria-checked", "true");
}

test("Home keeps its edition and reading position while shared search retains the selected result", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await openApp(page);
  await page.locator(".daily-screen").focus();
  await page.keyboard.press("ArrowRight");
  await expect(article(page)).toHaveAttribute("data-piece-id", "divine-comedy");
  await expect.poll(() => trigger(page).evaluate(button =>
    Math.abs(button.getBoundingClientRect().right - button.closest("[data-phone-screen]")!.getBoundingClientRect().right))).toBeLessThan(20);
  const retainedDaily = await page.locator(".daily-screen").elementHandle();
  const dailyScroll = page.locator(".daily-scroll > .mobile-scroll");
  await dailyScroll.evaluate(element => { element.scrollTop = 120; });
  const readingPosition = await dailyScroll.evaluate(element => element.scrollTop);
  expect(readingPosition).toBe(120);
  const originLeft = (await trigger(page).boundingBox())!.x;
  // Native activation keeps Playwright from scrolling the underlying story to its header.
  await trigger(page).evaluate(button => { button.focus({ preventScroll: true }); button.click(); });
  await expectOpen(page);
  expect((await search(page).locator(".discover-search").boundingBox())!.x).toBeLessThan(originLeft);
  const retainedSearch = await search(page).elementHandle();
  await search(page).getByRole("button", { name: "List view", exact: true }).click();
  await field(page).fill("a");
  await expect.poll(() => results(page).count()).toBeGreaterThan(5);
  await resultScroll(page).evaluate(element => { element.scrollTop = element.scrollHeight; });
  const savedOffset = await resultScroll(page).evaluate(element => element.scrollTop);
  expect(savedOffset).toBeGreaterThan(0);
  const chosenId = await results(page).last().getAttribute("data-piece-id");
  await results(page).last().click();
  await expect(storyBack(page)).toBeVisible();
  await expect(search(page)).not.toBeVisible();
  await expect(keyboard(page)).toHaveAttribute("data-visible", "false");
  expect(await retainedDaily!.evaluate(element => element.isConnected)).toBe(true);
  expect(await retainedSearch!.evaluate(element => element.isConnected)).toBe(true);
  await storyBack(page).click();
  await expect(search(page)).toBeVisible();
  await expect(field(page)).toHaveValue("a");
  await expect(search(page).locator(".discover-gallery-grid")).toHaveAttribute("data-layout", "list");
  await expect(keyboard(page)).toHaveAttribute("data-visible", "false");
  await expect(search(page).locator(`.discover-artwork-card[data-piece-id="${chosenId}"]`)).toBeFocused();
  await expect.poll(() => resultScroll(page).evaluate((element, previous) =>
    Math.abs(element.scrollTop - Math.min(previous, Math.max(0, element.scrollHeight - element.clientHeight))), savedOffset)).toBeLessThan(2);
  await field(page).focus();
  await expect(keyboard(page)).toHaveAttribute("data-visible", "true");
  await page.keyboard.press("Escape");
  await expectClosed(page);
  await expect(article(page)).toHaveAttribute("data-piece-id", "divine-comedy");
  expect(await dailyScroll.evaluate(element => element.scrollTop)).toBe(readingPosition);
  expect(errors).toEqual([]);
});

test.describe("coarse pointer and dark theme", () => {
  test.use({ hasTouch: true });

  for (const device of ["iphone", "pixel-10"] as const) {
    test(`${device}: shared search clears the keyboard once and stays inside phone safe areas`, async ({ page }) => {
      await openApp(page, "dark");
      if (device === "pixel-10") {
        await page.getByTestId("device-picker").click();
        await page.getByTestId("device-option-pixel-10").click();
      }
      await trigger(page).click();
      await expectOpen(page, 44);
      await expect(keyboard(page)).toHaveCSS("transform", "none");
      await expect(search(page).locator(".discover-search")).toHaveCSS("transform", "none");
      const measure = () => search(page).evaluate(root => {
        const screen = root.closest<HTMLElement>("[data-phone-screen]")!;
        const screenRect = screen.getBoundingClientRect();
        const scale = screenRect.width / screen.offsetWidth;
        const header = root.querySelector<HTMLElement>(".discover-search")!.getBoundingClientRect();
        const viewport = root.querySelector<HTMLElement>(".app-scroll > .mobile-scroll")!.getBoundingClientRect();
        const dock = screen.querySelector<HTMLElement>(".keyboard-dock")!.getBoundingClientRect();
        const color = getComputedStyle(root).backgroundColor;
        return {
          top: (header.top - screenRect.top) / scale,
          left: (header.left - screenRect.left) / scale,
          right: (screenRect.right - header.right) / scale,
          viewportBottom: viewport.bottom,
          keyboardTop: dock.top,
          closedBottom: (screenRect.bottom - viewport.bottom) / scale,
          opaque: color !== "transparent" && !color.endsWith(", 0)") && (!color.startsWith("rgba") || color.endsWith(", 1)")),
          scale,
        };
      });
      const geometry = await measure();
      expect(geometry.top).toBeGreaterThanOrEqual(device === "pixel-10" ? 64 : 60);
      expect(geometry.left).toBeGreaterThanOrEqual(8);
      expect(geometry.left).toBeLessThanOrEqual(16);
      expect(geometry.right).toBeCloseTo(geometry.left, 0);
      // Matching edges catches both keyboard overlap and applying its height twice.
      expect(Math.abs(geometry.viewportBottom - geometry.keyboardTop)).toBeLessThan(2 * geometry.scale);
      expect(geometry.opaque).toBe(true);
      await field(page).fill("a");
      await expect(search(page).locator(".discover-search")).toHaveCSS("height", "44px");
      await field(page).press("Enter");
      await expect(keyboard(page)).toHaveAttribute("data-visible", "false");
      await expect.poll(async () => (await measure()).closedBottom).toBeCloseTo(device === "pixel-10" ? 48 : 34, 0);
      await search(page).getByRole("button", { name: "Close search", exact: true }).click();
      await expectClosed(page);
    });
  }
});

test("shared result scrolling reaches the last work and dragging does not open artwork", async ({ page }) => {
  await openApp(page);
  await trigger(page).click();
  await expectOpen(page);
  await search(page).getByRole("button", { name: "List view", exact: true }).click();
  await field(page).fill("a");
  await expect.poll(() => results(page).count()).toBeGreaterThan(5);
  const row = (await results(page).nth(2).boundingBox())!;
  const panel = (await resultScroll(page).boundingBox())!;
  const x = row.x + row.width / 2;
  const startY = Math.min(row.y + row.height / 2, panel.y + panel.height - 24);
  await page.mouse.move(x, startY);
  await page.mouse.down();
  await page.mouse.move(x, Math.max(panel.y + 90, startY - 100), { steps: 12 });
  await page.mouse.up();
  await expect(search(page)).toBeVisible();
  await expect(storyBack(page)).toHaveCount(0);
  await expect(keyboard(page)).toHaveAttribute("data-visible", "true");
  await expect(field(page)).toBeFocused();
  await expect.poll(() => resultScroll(page).evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  await page.mouse.move(panel.x + panel.width / 2, panel.y + panel.height / 2);
  await page.mouse.wheel(0, 2000);
  await expect.poll(() => results(page).last().evaluate(button => {
    const viewport = button.closest(".mobile-scroll")!.getBoundingClientRect();
    const bounds = button.getBoundingClientRect();
    return bounds.top >= viewport.top - 1 && bounds.bottom <= viewport.bottom + 1;
  })).toBe(true);
  await expect(storyBack(page)).toHaveCount(0);
  await results(page).last().click();
  await expect(storyBack(page)).toBeVisible();
});

test("Home scopes, clearing, and medium filtering leave bottom Search independent", async ({ page }) => {
  await openApp(page);
  const navigation = page.locator(".bottom-nav");
  await navigation.getByRole("button", { name: "Search", exact: true }).click();
  const discoverField = page.locator(".discover-retained-page .discover-search input");
  await discoverField.fill("Japan");
  await discoverField.press("Enter");
  await navigation.getByRole("button", { name: "Daily", exact: true }).click();
  await trigger(page).click();
  await expectOpen(page);
  await expect(field(page)).toHaveValue("");
  await field(page).fill("qzx-no-such-work");
  await expect(search(page).locator(".discover-empty")).toBeVisible();
  await expect(results(page)).toHaveCount(0);
  await search(page).getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(field(page)).toHaveValue("");
  await expect(field(page)).toBeFocused();
  await expect.poll(() => results(page).count()).toBeGreaterThan(5);
  await chooseScope(page, "Medium");
  await search(page).locator(".discover-medium-selection").getByRole("radio", { name: "Literature", exact: true }).click();
  await field(page).fill("Dante");
  await expect(results(page)).toHaveCount(1);
  await expect(results(page).locator("strong")).toHaveText("The Divine Comedy");
  await search(page).getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(search(page).locator(".discover-medium-selection").getByRole("radio", { name: "Literature", exact: true })).toHaveAttribute("aria-checked", "true");
  await chooseScope(page, "Artworks");
  await expect(search(page).locator(".discover-medium-selection")).toHaveCount(0);
  await field(page).fill("David");
  await expect(results(page)).toHaveCount(1);
  await expect(results(page).locator("strong")).toHaveText("The Death of Socrates");
  await search(page).getByRole("button", { name: "Close search", exact: true }).click();
  await expectClosed(page);
  await navigation.getByRole("button", { name: "Search", exact: true }).click();
  await expect(discoverField).toHaveValue("Japan");
  await expect(page.locator(".discover-retained-page .discover-gallery-grid")).toHaveAttribute("data-layout", "grid");
});

test("Gallery Filters and layout survive an artwork round trip with correct sheet focus", async ({ page }) => {
  await openApp(page);
  await trigger(page).click();
  await expectOpen(page);
  await field(page).fill("a");
  const filters = search(page).getByRole("button", { name: "Filters", exact: true });
  await filters.click();
  await expect(filterSheet(page)).toBeVisible();
  await expect(keyboard(page)).toHaveAttribute("data-visible", "false");
  await filterSheet(page).getByRole("combobox", { name: /^Sort by\b/ }).click();
  await page.getByRole("option", { name: "Title Z–A", exact: true }).click();
  await filterSheet(page).getByRole("combobox", { name: /^Medium\b/ }).click();
  await page.getByRole("option", { name: "Painting", exact: true }).click();
  await filterSheet(page).getByRole("button", { name: "Done", exact: true }).click();
  await expect(filterSheet(page)).toHaveCount(0);
  await expect(search(page)).toBeVisible();
  await expect(filters).toBeFocused();
  await expect(filters).toHaveAttribute("data-active", "true");
  await search(page).getByRole("button", { name: "List view", exact: true }).click();
  const titles = await results(page).locator("strong").allTextContents();
  expect(titles.length).toBeGreaterThan(1);
  expect(titles).toEqual([...titles].sort((a, b) => b.localeCompare(a, "en")));
  const selected = results(page).last();
  await selected.click();
  await expect(storyBack(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(storyBack(page)).toHaveCount(0);
  await expect(selected).toBeFocused();
  await expect(field(page)).toHaveValue("a");
  await expect(keyboard(page)).toHaveAttribute("data-visible", "false");
  await expect(search(page).locator(".discover-gallery-grid")).toHaveAttribute("data-layout", "list");
  await expect(results(page).locator("strong")).toHaveText(titles);
  await filters.click();
  await expect(filterSheet(page).getByRole("combobox", { name: /^Sort by\b/ })).toContainText("Title Z–A");
  await expect(filterSheet(page).getByRole("combobox", { name: /^Medium\b/ })).toContainText("Painting");
  await filterSheet(page).getByRole("button", { name: "Reset filters", exact: true }).click();
  await filterSheet(page).getByRole("button", { name: "Done", exact: true }).click();
  await expect(filters).toBeFocused();
  await expect(filters).toHaveAttribute("data-active", "false");
  await search(page).getByRole("button", { name: "Grid view", exact: true }).click();
  await expect(search(page).locator(".discover-gallery-grid")).toHaveAttribute("data-layout", "grid");
});

test("Home artist and account profiles return to their query and opening row without reopening the keyboard", async ({ page }) => {
  await openApp(page);
  await trigger(page).click();
  await expectOpen(page);
  await chooseScope(page, "Artists");
  await field(page).fill("David");
  const artist = search(page).getByRole("button", { name: "View artist: Jacques-Louis David", exact: true });
  await artist.click();
  await expect(page.getByRole("button", { name: "Close creator profile", exact: true })).toBeVisible();
  await expect(search(page)).not.toBeVisible();
  await expect(keyboard(page)).toHaveAttribute("data-visible", "false");
  await page.keyboard.press("Escape");
  await expect(search(page)).toBeVisible();
  await expect(artist).toBeFocused();
  await expect(field(page)).toHaveValue("David");
  await expect(scopes(page).getByRole("radio", { name: "Artists", exact: true })).toHaveAttribute("aria-checked", "true");
  await expect(keyboard(page)).toHaveAttribute("data-visible", "false");
  await chooseScope(page, "Accounts");
  await field(page).fill("Mara");
  const account = search(page).getByRole("button", { name: "View profile: Mara Vale", exact: true });
  await account.click();
  const visitor = page.locator(".taste-account-profile-layer");
  await expect(visitor.getByRole("heading", { name: "Mara Vale", exact: true })).toBeVisible();
  await expect(search(page)).not.toBeVisible();
  await expect(visitor.getByRole("button", { name: "Back", exact: true })).toBeFocused();
  await visitor.getByRole("button", { name: "Follow Mara Vale", exact: true }).click();
  await expect(visitor.locator("#account-profile-tab-followers strong")).toHaveText("1");
  await visitor.getByRole("button", { name: "Back", exact: true }).click();
  await expect(visitor).toHaveCount(0);
  await expect(account).toBeFocused();
  await expect(field(page)).toHaveValue("Mara");
  await expect(scopes(page).getByRole("radio", { name: "Accounts", exact: true })).toHaveAttribute("aria-checked", "true");
  await expect(keyboard(page)).toHaveAttribute("data-visible", "false");
  await expect(search(page).getByRole("button", { name: "Following Mara Vale. Unfollow", exact: true })).toHaveAttribute("aria-pressed", "true");
  await account.click();
  await page.keyboard.press("Escape");
  await expect(visitor).toHaveCount(0);
  await expect(account).toBeFocused();
  await expect(search(page)).toBeVisible();
});
