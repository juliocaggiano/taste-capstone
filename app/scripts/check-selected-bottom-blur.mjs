import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch();
try {
 const page=await browser.newPage({viewport:{width:1100,height:1100}});page.setDefaultTimeout(5000);
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:4173/');await page.waitForTimeout(350);
 assert.equal(await page.locator('.scroll-edge-blur--top').count(),0);
 const strength=()=>page.locator('.scroll-edge-blur--bottom').first().evaluate(e=>Number(e.style.getPropertyValue('--edge-strength')));
 assert.equal(await strength(),1);
 const scroll=page.locator('.today-retained-page .mobile-scroll');
 await scroll.evaluate(e=>e.scrollTop=(e.scrollHeight-e.clientHeight)/2);await page.waitForTimeout(200);
 await page.mouse.move(5,5);await page.getByTestId('phone-frame').screenshot({path:'../qa/scroll-edge-blur-2026-09-23/selected-bottom-home.png'});
 await scroll.evaluate(e=>e.scrollTop=e.scrollHeight);await page.waitForTimeout(200);assert.equal(await strength(),0);
 await scroll.evaluate(e=>e.scrollTop=0);await page.waitForTimeout(200);
 const save=page.locator('.daily-slide[data-active=true] .today-save-primary');const before=await save.getAttribute('aria-pressed');await save.click();await page.reload();assert.notEqual(await save.getAttribute('aria-pressed'),before);
 await page.locator('.daily-slide[data-active=true] .today-save-chevron').click();assert.equal(await page.locator('.scroll-edge-viewport').first().evaluate(e=>getComputedStyle(e).visibility),'hidden');await page.keyboard.press('Escape');
 await page.locator('.bottom-nav').getByRole('button',{name:'Settings',exact:true}).click();
 await page.getByRole('button',{name:'View profile',exact:true}).click();await page.waitForTimeout(250);
 assert.equal(await page.locator('.scroll-edge-blur--top').count(),0);
 await page.locator('.taste-profile-screen').evaluate(e=>{const s=e.closest('.mobile-scroll');s.scrollTop=(s.scrollHeight-s.clientHeight)/2});await page.waitForTimeout(250);await page.mouse.move(5,5);
 await page.getByTestId('phone-frame').screenshot({path:'../qa/scroll-edge-blur-2026-09-23/selected-bottom-profile.png'});
 assert.deepEqual(errors,[]);
 const result={passed:['normal Stronger bottom only','end of content clears blur','normal save persists after reload','folder menu stays clear','bottom nav remains clickable','profile bottom only'],errors};
 await fs.writeFile('../qa/scroll-edge-blur-2026-09-23/selected-bottom-check.json',JSON.stringify(result,null,2));console.log('6 selected-bottom checks passed; no page errors.');
} finally {await browser.close();}
