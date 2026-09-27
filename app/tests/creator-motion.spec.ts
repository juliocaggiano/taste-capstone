import { expect, test, type Page } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const evidence = fileURLToPath(new URL("../../qa/creator-motion-variations-2026-09-23/", import.meta.url));
const activeStory = (page: Page) => page.locator('.daily-slide[data-active="true"]');
for (const device of ["iphone", "pixel-10"] as const) {
  test(`${device}: close slides back at full size and retains reading position`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/");
    if (device === "pixel-10") {
      await page.getByTestId("device-picker").click();
      await page.getByTestId("device-option-pixel-10").click();
    }
    const trigger = activeStory(page).getByRole('button', {name:'Open creator profile for Jacques-Louis David',exact:true}).last();
    await trigger.scrollIntoViewIfNeeded();
    const scroll = page.locator('.app-page-surface .mobile-scroll');
    const parent = await scroll.elementHandle();
    const before = await scroll.evaluate(element => element.scrollTop);
    expect(before).toBeGreaterThan(100);
    const status = await page.locator('.status-bar').boundingBox();
    await trigger.click();
    await expect(page.locator('.app-page-surface')).toHaveAttribute('inert');
    await expect(page.getByRole('button', { name: 'Close creator profile', exact: true })).toBeFocused();
    await expect(page.locator('.creator-page-transition-surface')).toHaveCSS('transform', 'none');
    await page.getByTestId('phone-frame').screenshot({ path: `${evidence}/${device}-open.png` });
    await page.getByRole('button', { name: 'Close creator profile', exact: true }).click();
    await expect(page.locator('.creator-page-transition')).toHaveAttribute('data-phase', 'closing');
    const samples = await page.evaluate(async () => {
      const result: {ms:number;x:number;y:number;scale:number;opacity:number;radius:number;statusY:number}[] = [];
      const start = performance.now();
      while (performance.now() - start < 450) {
        const surface = document.querySelector('.creator-page-transition-surface');
        if (!surface) break;
        const style = getComputedStyle(surface);
        const matrix = new DOMMatrixReadOnly(style.transform);
        result.push({ms: performance.now()-start, x: matrix.e, y: matrix.f, scale: matrix.a, opacity: Number(style.opacity), radius: parseFloat(style.borderRadius), statusY: document.querySelector('.status-bar')!.getBoundingClientRect().y});
        await new Promise(requestAnimationFrame);
      }
      return result;
    });
    expect(samples.length).toBeGreaterThan(3);
    expect(samples.every(sample => sample.scale === 1 && sample.y === 0 && sample.radius === 0 && sample.opacity === 1)).toBe(true);
    expect(samples.some(sample => sample.x > 250)).toBe(true);
    expect(samples.every(sample => Math.abs(sample.statusY - status!.y) < .1)).toBe(true);
    await expect(page.locator('.creator-page-transition')).toHaveCount(0);
    await expect(trigger).toBeFocused();
    expect(await parent!.evaluate(element => element.isConnected)).toBe(true);
    expect(await scroll.evaluate(element => element.scrollTop)).toBe(before);
    await page.getByTestId('phone-frame').screenshot({ path: `${evidence}/${device}-returned.png` });
    await writeFile(`${evidence}/${device}-motion.json`, JSON.stringify({before, samples, errors}, null, 2));
    expect(errors).toEqual([]);
  });
}

test('Library folder, creator filter, follow state and artwork navigation survive the new layer', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', {name:'Library',exact:true}).click();
  await page.getByRole('tab', {name:'Folders',exact:true}).click();
  const folder = page.locator('.library-folder-card').filter({hasText:'My folder'});
  await expect(folder).toHaveAttribute('aria-pressed','true');
  const work = page.locator('.library-work-card').first();
  await work.click();
  const detail = page.locator('.today-article[data-reading-view="detail"]');
  await expect(detail).toBeVisible();
  const creatorTrigger = detail.locator('.today-creator button');
  await creatorTrigger.click();
  const follow = page.locator('.creator-reference .dc-follow-button');
  const originalFollowState = await follow.getAttribute('aria-pressed');
  await follow.click();
  const followState = originalFollowState === 'true' ? 'false' : 'true';
  await expect(follow).toHaveAttribute('aria-pressed',followState);
  await page.getByRole('tab', {name:'Artworks',exact:true}).click();
  await page.getByRole('button', {name:'Sort & Filter',exact:true}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('.creator-page-transition')).toHaveAttribute('data-phase','open');
  await page.keyboard.press('Escape');
  await expect(page.locator('.creator-page-transition')).toHaveCount(0);
  await expect(creatorTrigger).toBeFocused();
  await detail.getByRole('button', {name:'Close story',exact:true}).click();
  await expect(page.getByRole('tab', {name:'Folders',exact:true})).toHaveAttribute('aria-selected','true');
  await expect(folder).toHaveAttribute('aria-pressed','true');
  await expect(work).toBeFocused();
  await work.click();
  await detail.locator('.today-creator button').click();
  await expect(page.locator('.creator-reference .dc-follow-button')).toHaveAttribute('aria-pressed',followState);
  await page.getByRole('tab', {name:'Artworks',exact:true}).click();
  await page.locator('.creator-reference-artwork').first().click();
  await expect(page.locator('.creator-page-transition')).toHaveCount(0);
  await expect(detail).toBeVisible();
});

test('reduced motion returns immediately and repeated opening stays usable', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const trigger = activeStory(page).locator('.today-creator button');
  for (let index=0;index<3;index++) {
    await trigger.click();
    await expect(page.locator('.creator-page-transition-surface')).toHaveCSS('transform','none');
    await page.getByRole('button', {name:'Close creator profile',exact:true}).click();
    await expect(page.locator('.creator-page-transition')).toHaveCount(0, {timeout:200});
    await expect(trigger).toBeFocused();
  }
});

test('narrow dark preview restores focus when unsaving removes the originating library work', async ({ page }) => {
  await page.setViewportSize({width:500,height:900});
  await page.addInitScript(() => {
    localStorage.setItem('daily-culture.preferences.v1', JSON.stringify({theme:'dark'}));
  });
  await page.goto('/');
  await page.getByRole('button', {name:'Library',exact:true}).click();
  const work = page.locator('.library-work-card').first();
  const title = await work.locator('em').innerText();
  await work.click();
  const detail = page.locator('.today-article[data-reading-view="detail"]');
  await detail.locator('.today-save-primary').click();
  await expect(page.locator('.library-retained-page .library-work-card').filter({hasText:title})).toHaveCount(0);
  const creatorTrigger = detail.locator('.today-creator button');
  await creatorTrigger.click();
  await page.setViewportSize({width:650,height:900});
  await page.getByTestId('phone-frame').screenshot({path:`${evidence}/narrow-dark-open.png`});
  await page.getByRole('button', {name:'Close creator profile',exact:true}).click();
  await expect(page.locator('.creator-page-transition')).toHaveCount(0);
  await expect(creatorTrigger).toBeFocused();
  await detail.getByRole('button', {name:'Close story',exact:true}).click();
  await expect(page.getByRole('tab', {name:'Artworks',exact:true})).toBeFocused();
  await expect(page.locator('.daily-culture-app')).toHaveAttribute('data-theme','dark');
});
