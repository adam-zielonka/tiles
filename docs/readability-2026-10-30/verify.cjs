const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const base = process.env.ISSUE31_URL || 'http://127.0.0.1:4198/';
const out = process.env.ISSUE31_OUT || '/tmp/issue31-work';
fs.mkdirSync(out, { recursive: true });
const rgb = s => s.match(/[\d.]+/g).slice(0, 3).map(Number);
const luminance = a => a.map(x => x / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4).reduce((s, x, i) => s + x * [.2126, .7152, .0722][i], 0);
const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
const gray = a => { const v = a.reduce((s, x, i) => s + x * [.2126, .7152, .0722][i], 0); return [v, v, v]; };
const expectedCounts = { all: 32, 0: 2, 1: 10, 2: 9, 3: 9, 4: 9, 5: 2 };
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined, env: { ...process.env, LD_LIBRARY_PATH: process.env.CHROMIUM_LIB_PATH || process.env.LD_LIBRARY_PATH || '' } });
  const report = { date: new Date().toISOString(), base, browser: browser.version(), fixture: 'Only hard-coded demo material/TO/bin identifiers replaced in in-memory JS responses; original assets separately verified. Quantities/state/logic unchanged.', runs: [] };
  for (const mobile of [false, true]) {
    const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 1000 }, isMobile: mobile, hasTouch: mobile });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/assets/*.js', async route => {
      const response = await route.fetch();
      const original = await response.text();
      const body = original.replaceAll('200.777.001', 'DEMO-A').replaceAll('200.777.002', 'DEMO-B').replaceAll('200.777.042', 'DEMO-MISSING').replaceAll('`1234567`', '`DEMO-TO`').replaceAll('storageBin:`A`', 'storageBin:`DEMO-A`').replaceAll('storageBin:`B`', 'storageBin:`DEMO-B`');
      assert.notEqual(body, original, 'Synthetic fixture must replace demo identifiers');
      await route.fulfill({ response, body });
    });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const run = { mobile, states: [], errors };
    const button = text => page.getByRole('button', { name: text, exact: true });
    const select = async text => {
      const b = button(text);
      if (mobile) await b.tap(); else { await b.focus(); await page.keyboard.press('Enter'); }
      await page.waitForFunction(s => document.querySelector('.TilesDemo > header main button[aria-pressed="true"]')?.textContent === s, text);
      assert.equal(await page.locator('.TilesDemo > header main [aria-pressed="true"]').count(), 1);
      assert.equal(await page.locator('.Tile').count(), expectedCounts[text]);
    };
    const shots = async name => {
      await page.evaluate(() => { window.getSelection()?.removeAllRanges(); return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
      for (const mode of ['color', 'grayscale']) {
        await page.evaluate(mode => document.documentElement.style.filter = mode === 'grayscale' ? 'grayscale(1)' : '', mode);
        await page.screenshot({ path: `${out}/${mobile ? 'phone' : 'desktop'}-${name}-${mode}.png`, fullPage: true });
      }
      await page.evaluate(() => document.documentElement.style.filter = '');
    };
    for (const step of ['all', '0', '1', '2', '3', '4', '5']) {
      await select(step);
      const tiles = await page.locator('.Tile').evaluateAll(es => es.map(e => ({ text: e.textContent, info: e.querySelector('section:last-child p:last-child').textContent, value: e.querySelector('main').textContent.trim(), progress: e.parentElement.style.getPropertyValue('--tile-progress'), background: e.parentElement.style.getPropertyValue('--tile-color') })));
      if (step === '0') assert.ok(tiles.every(t => t.info === 'Picking not started yet'));
      if (step === '1') assert.ok(tiles.some(t => t.info === 'Not available on warehouse') && tiles.some(t => t.info === 'TO: DEMO-TO'));
      if (step === '2') assert.ok(tiles.some(t => t.info.startsWith('Something is wrong')));
      if (step === '3') assert.ok(tiles.some(t => t.info === 'Ready to scan') && tiles.some(t => t.info === 'Scanned: 1/6') && tiles.some(t => t.progress === '16.666666666666668%'));
      if (step === '4') assert.ok(tiles.every(t => t.info.startsWith('Scanned:')));
      if (step === '5') assert.ok(tiles.every(t => t.info === 'Everything is done'));
      const errorStyles = await page.locator('.Tile').evaluateAll(es => es.filter(e => e.parentElement.style.getPropertyValue('--tile-color') === '#e16758').map(e => {
        const p = e.querySelector('section:last-child p:last-child'); const c = getComputedStyle(p); const icon = e.querySelector('main svg path');
        return { color: c.color, background: e.parentElement.style.getPropertyValue('--tile-color'), font: c.fontSize, icon: getComputedStyle(icon).fill, text: p.textContent };
      }));
      for (const s of errorStyles) {
        const bg = s.background.slice(1).match(/../g).map(x => parseInt(x, 16));
        s.contrast = contrast(rgb(s.color), bg); s.grayContrast = contrast(gray(rgb(s.color)), gray(bg));
        assert.ok(s.contrast >= 4.5 && s.grayContrast >= 4.5);
        assert.equal(s.icon, s.color); assert.equal(s.font, '16px');
      }
      const active = await button(step).evaluate(e => ({ shadow: getComputedStyle(e).boxShadow, pressed: e.getAttribute('aria-pressed'), rect: e.getBoundingClientRect().toJSON() }));
      assert.match(active.shadow, /inset/);
      run.states.push({ step, tiles, errorStyles, active });
      if (step === '2' || step === '3') {
        if (mobile) await page.touchscreen.tap(16, 18); // leave the filter: verify its persistent selection, not the transient tap flash
        if (!mobile) { await button(step).focus(); await page.keyboard.press('Tab'); }
        await shots(`step${step}`);
      }
    }
    await select('2');
    if (mobile) await page.touchscreen.tap(16, 18);
    await button('Highlight').focus();
    await page.keyboard.press('Tab'); // cycles to first control
    await button('all').focus();
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').innerText(), '0');
    const focus = await page.locator(':focus').evaluate(e => ({ text: e.textContent, outline: getComputedStyle(e).outline, offset: getComputedStyle(e).outlineOffset, shadow: getComputedStyle(e).boxShadow, visible: e.matches(':focus-visible') }));
    assert.ok(focus.visible); assert.match(focus.outline, /dashed/); assert.equal(focus.offset, '2px');
    assert.equal(focus.shadow, 'none', 'Inactive focus is distinct from selected filter');
    assert.match(await button('2').evaluate(e => getComputedStyle(e).boxShadow), /inset/, 'Active border persists after blur');
    await shots('active-focus');
    await page.keyboard.press('Space'); assert.equal(await button('0').getAttribute('aria-pressed'), 'true');
    await page.keyboard.press('Shift+Tab'); assert.equal(await page.locator(':focus').innerText(), 'all');
    await page.keyboard.press('Enter'); assert.equal(await button('all').getAttribute('aria-pressed'), 'true');
    await select('0'); await button('--').click(); assert.equal(await button('5').getAttribute('aria-pressed'), 'true');
    await button('++').click(); assert.equal(await button('0').getAttribute('aria-pressed'), 'true');
    await button('Highlight').click(); assert.equal(await button('Highlight').getAttribute('aria-pressed'), 'true'); assert.ok(await page.locator('.Highlight').count() > 0);
    await button('Highlight').click(); assert.equal(await button('Highlight').getAttribute('aria-pressed'), 'false'); assert.equal(await page.locator('.Highlight').count(), 0);
    run.focus = focus; run.widths = [];
    for (const width of [320, 390, 600, 900, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const size = await page.evaluate(() => ({ inner: innerWidth, document: document.documentElement.scrollWidth }));
      assert.equal(size.document, size.inner); run.widths.push(size);
    }
    assert.deepEqual(errors, []); report.runs.push(run); await context.close();
  }
  await browser.close(); fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ passed: true, browser: report.browser, states: report.runs.map(r => r.states.map(s => s.step)), contrast: report.runs[0].states.flatMap(s => s.errorStyles).map(e => [e.contrast, e.grayContrast]), focus: report.runs[0].focus, images: fs.readdirSync(out).filter(x => x.endsWith('.png')).length }));
})().catch(e => { console.error(e); process.exit(1); });
