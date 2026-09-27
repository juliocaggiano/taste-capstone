import { expect, test, type Page } from "@playwright/test";

const flow = (page: Page) => page.locator(".create-flow");
const nav = (page: Page, name: string) => page.locator(".bottom-nav").getByRole("button", { name, exact: true });
const action = (page: Page, name: string) => flow(page).getByRole("button", { name, exact: true });

async function chooseArtForm(page: Page, name: string) {
  await flow(page).locator("#create-category").click();
  await flow(page).getByRole("radiogroup", { name: "Art form" }).getByRole("radio", { name, exact: true }).click();
  await expect(flow(page).locator("#create-category")).toContainText(name);
}

async function openCreate(page: Page) {
  await nav(page, "Create").click();
  await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-tab", "create");
}

test("Create validates an artist, title, art form, and context before completing a local preview", async ({ page }) => {
  await page.goto("/");
  const libraryBefore = await page.evaluate(() => localStorage.getItem("daily-culture.boards.v1"));
  await openCreate(page);
  await expect(flow(page).getByRole("heading", { name: "Tell us about the artwork" })).toBeVisible();
  await expect(flow(page).locator(".create-flow-kicker")).toHaveCount(0);

  await action(page, "Continue").click();
  await expect(flow(page).getByRole("alert")).toContainText(/artist/i);
  const artist = flow(page).locator("#create-artist");
  await artist.fill("Dante");
  await flow(page).locator(".create-flow-suggestions").getByRole("option", { name: /Dante Alighieri/ }).click();
  await expect(artist).toHaveValue("Dante Alighieri");

  await action(page, "Continue").click();
  await expect(flow(page).getByRole("alert")).toContainText(/title/i);
  await flow(page).locator("#create-title").fill("A New View of Dante");
  await action(page, "Continue").click();
  await expect(flow(page).getByRole("heading", { name: "Add images" })).toBeVisible();
  await expect(flow(page).locator(".create-flow-kicker")).toHaveCount(0);
  await expect(flow(page).locator(".create-flow-intro")).toHaveCount(0);
  await expect(flow(page)).not.toContainText("Artwork images");
  await expect(flow(page)).toContainText("Up to 3 JPG, PNG, or WebP files.");

  // The image step is optional.
  await action(page, "Continue").click();
  await expect(flow(page).getByRole("heading", { name: "Add the context" })).toHaveCount(0);
  await expect(flow(page).locator("#create-category")).toBeVisible();
  await expect(flow(page).locator(".create-flow-kicker")).toHaveCount(0);
  await expect(flow(page).locator(".create-flow-intro")).toHaveCount(0);
  await action(page, "Continue").click();
  await expect(flow(page).getByRole("alert")).toHaveText("Choose an art form.");
  await flow(page).locator("#create-category").click();
  await expect(flow(page).getByRole("radiogroup", { name: "Art form" }).getByRole("radio", { name: "Painting" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(flow(page).getByRole("radiogroup", { name: "Art form" })).toHaveCount(0);
  await expect(flow(page).locator("#create-category")).toBeFocused();
  await expect(flow(page).getByRole("button", { name: "Continue", exact: true })).toBeVisible();
  await chooseArtForm(page, "Painting");
  await action(page, "Continue").click();
  await expect(flow(page).getByRole("alert")).toHaveText("Add a short explanation of why this work matters.");
  await flow(page).getByRole("textbox", { name: "Why does this work matter?" }).fill("It connects a familiar poem to a new visual interpretation.");
  await action(page, "Continue").click();

  await expect(flow(page).getByRole("heading", { name: "Review your artwork" })).toBeVisible();
  await expect(flow(page).locator(".create-flow-kicker")).toHaveCount(0);
  await expect(flow(page).locator(".create-flow-intro, .create-flow-disclosure")).toHaveCount(0);
  await expect(flow(page)).toContainText("A New View of Dante");
  await expect(flow(page)).toContainText("Dante Alighieri");
  await action(page, "Finish preview").click();
  await expect(flow(page).getByRole("heading", { name: "Artwork preview complete" })).toBeVisible();
  await expect(flow(page)).toContainText("Nothing was sent or added to the Library.");
  expect(await page.evaluate(() => localStorage.getItem("daily-culture.boards.v1"))).toBe(libraryBefore);

  await action(page, "Add another artwork").click();
  await expect(flow(page).getByRole("heading", { name: "Tell us about the artwork" })).toBeVisible();
  await expect(flow(page).locator("#create-artist")).toBeEmpty();
  await expect(flow(page).locator("#create-title")).toBeEmpty();
});

test("An unknown artist and title can be selected without entering placeholder text", async ({ page }) => {
  await page.goto("/");
  await openCreate(page);

  const artist = flow(page).locator("#create-artist");
  const title = flow(page).locator("#create-title");
  await expect(artist).toBeEmpty();
  await expect(title).toBeEmpty();
  await expect(title).toHaveAttribute("placeholder", /Starry Night/);
  await flow(page).getByRole("checkbox", { name: /I don.t know the artist/i }).check();
  await flow(page).getByRole("checkbox", { name: /I don.t know the title/i }).check();
  await action(page, "Continue").click();

  await expect(flow(page).getByRole("heading", { name: "Add images" })).toBeVisible();
  await action(page, "Continue").click();
  await chooseArtForm(page, "Painting");
  await flow(page).getByRole("textbox", { name: "Why does this work matter?" }).fill("The maker and original title are not documented.");
  await action(page, "Continue").click();
  await expect(flow(page)).toContainText("Artist unknown");
  await expect(flow(page)).toContainText("Title unknown");
});

test("Art form stays in Details and supports keyboard selection and outside dismissal", async ({ page }) => {
  await page.goto("/");
  await openCreate(page);
  await flow(page).getByRole("checkbox", { name: /I don.t know the artist/i }).check();
  await flow(page).getByRole("checkbox", { name: /I don.t know the title/i }).check();
  await action(page, "Continue").click();
  await action(page, "Continue").click();

  const trigger = flow(page).locator("#create-category");
  await trigger.click();
  const options = flow(page).getByRole("radiogroup", { name: "Art form" });
  await expect(options).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("End");
  await expect(options.getByRole("radio", { name: "Cinema" })).toHaveAttribute("aria-checked", "true");
  await page.keyboard.press("Enter");
  await expect(options).toHaveCount(0);
  await expect(trigger).toContainText("Cinema");

  await trigger.click();
  const selected = options.getByRole("radio", { name: "Cinema" });
  await expect(selected).toHaveAttribute("aria-checked", "true");
  await expect(selected.locator(".dc-selection-check")).toBeVisible();
  await flow(page).locator("#create-year").click();
  await expect(options).toHaveCount(0);
  await expect(flow(page).locator("#create-year")).toBeFocused();
  await expect(flow(page).locator("#create-medium")).toBeVisible();
});

test("Artist search finds Caravaggio and separates people with similar names", async ({ page }) => {
  await page.goto("/");
  await openCreate(page);

  const artist = flow(page).locator("#create-artist");
  await artist.click();
  await artist.fill("Pieter Bruegel");
  const suggestions = flow(page).locator(".create-flow-suggestions");
  const elder = suggestions.getByRole("option", { name: /Pieter Brueg.*Elder/i });
  const younger = suggestions.getByRole("option", { name: /Pieter Brueg.*Younger/i });
  await expect(elder).toBeVisible();
  await expect(younger).toBeVisible();
  await expect(elder).toContainText(/15\d\d/);
  await expect(younger).toContainText(/15\d\d/);
  await younger.click();
  await expect(artist).toHaveValue(/Pieter Brueg.*Younger/i);

  await artist.fill("Caravaggio");
  const caravaggio = suggestions.getByRole("option", { name: /Caravaggio/i });
  await expect(caravaggio).toBeVisible();
  await expect(caravaggio).toContainText("Michelangelo Merisi");
  await expect(caravaggio).toContainText("1571–1610");
  await caravaggio.click();
  await expect(artist).toHaveValue(/Caravaggio/i);
  await expect.poll(async () => page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem("daily-culture.create-artwork-draft.v1") ?? "{}");
    return saved.draft?.artistId;
  })).toBe("caravaggio");
  await flow(page).locator(".create-flow-close").click();
  await page.reload();
  await openCreate(page);
  await expect(flow(page).locator("#create-artist")).toHaveValue("Caravaggio");
  await expect(flow(page).locator(".create-flow-selected-artist")).toContainText("Michelangelo Merisi");
});

test("Closing Create restores its draft and uploaded image after reloading", async ({ page }) => {
  await page.goto("/");
  await openCreate(page);
  await expect(flow(page).getByRole("heading", { name: "Tell us about the artwork" })).toBeVisible();
  await flow(page).locator("#create-artist").fill("Ana Silva");
  await flow(page).locator("#create-title").fill("Study of Light");
  await action(page, "Continue").click();
  await expect(action(page, "Add images")).toBeEnabled();

  await flow(page).locator('input[type="file"]').setInputFiles({
    name: "study.png",
    mimeType: "image/png",
    buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l4QAAAAASUVORK5CYII=", "base64"),
  });
  await expect(flow(page).getByRole("img", { name: "study.png" })).toBeVisible();
  await flow(page).getByRole("checkbox", { name: /permission to share these images/i }).check();
  await action(page, "Continue").click();
  await chooseArtForm(page, "Sculpture");
  await flow(page).getByRole("textbox", { name: "Why does this work matter?" }).fill("A study of how light changes a carved surface.");
  await expect(flow(page).locator(".create-flow-dimensions")).toHaveCount(0);
  await expect(action(page, "Save & exit")).toHaveCount(0);
  await flow(page).locator(".create-flow-close").click();
  await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-tab", "daily");

  await page.reload();
  await openCreate(page);
  await expect(flow(page).getByRole("heading", { name: "Add the context" })).toHaveCount(0);
  await expect(flow(page).locator("#create-category")).toBeVisible();
  await expect(flow(page).locator("#create-category")).toContainText("Sculpture");
  await expect(flow(page).getByRole("textbox", { name: "Why does this work matter?" })).toHaveValue("A study of how light changes a carved surface.");
  await expect(flow(page).locator(".create-flow-dimensions")).toHaveCount(0);
  await action(page, "Back").click();
  await expect(flow(page).getByRole("img", { name: "study.png" })).toBeVisible();
  await action(page, "Back").click();
  await expect(flow(page).locator("#create-artist")).toHaveValue("Ana Silva");
  await expect(flow(page).locator("#create-title")).toHaveValue("Study of Light");
});

test("Explore study Create stays temporary and leaves the main draft untouched", async ({ page }) => {
  const mainDraft = JSON.stringify({ draft: { artist: "Main draft maker", title: "Main draft title" }, step: 1 });
  await page.addInitScript((value) => {
    localStorage.setItem("daily-culture.create-artwork-draft.v1", value);
  }, mainDraft);
  await page.goto("/?explore-study=gallery-first");
  await openCreate(page);
  await expect(flow(page).locator(".create-flow-exit")).toHaveCount(0);
  await expect(flow(page).getByRole("heading", { name: "Tell us about the artwork" })).toBeVisible();
  await expect(flow(page).locator("#create-artist")).toBeEmpty();
  await flow(page).locator("#create-artist").fill("Study only maker");
  await flow(page).locator("#create-title").fill("Study only title");
  await flow(page).locator(".create-flow-close").click();
  await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-tab", "search");
  expect(await page.evaluate(() => localStorage.getItem("daily-culture.create-artwork-draft.v1"))).toBe(mainDraft);
});

test("Closing Create restores the previous tab and focus with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await nav(page, "Search").click();
  await page.locator(".discover-search input").fill("David");
  await page.locator(".discover-gallery").focus();
  await expect(page.locator(".keyboard-dock")).toHaveAttribute("data-visible", "false");
  await openCreate(page);
  await flow(page).locator(".create-flow-close").click();

  await expect(page.locator(".daily-culture-app")).toHaveAttribute("data-tab", "search");
  await expect(page.locator(".create-flow-layer")).toHaveCount(0);
  await expect(page.locator(".discover-search input")).toHaveValue("David");
  await expect(nav(page, "Search")).toBeFocused();
});
