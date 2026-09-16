// Rasteriza icon/icon.svg a los PNG que necesita Android (legacy + adaptive foreground).
const fs = require('fs'); const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const root = path.resolve(__dirname, '..');
const svg = fs.readFileSync(path.join(__dirname, 'icon.svg'), 'utf8');
const dens = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  async function render(size, html, out) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<html><body style="margin:0;background:transparent">${html}</body></html>`);
    await page.screenshot({ path: out, omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  }
  for (const [d, k] of Object.entries(dens)) {
    const dir = path.join(root, 'android', 'res', 'mipmap-' + d); fs.mkdirSync(dir, { recursive: true });
    // Icono clásico 48dp con esquinas redondeadas
    const s = Math.round(48 * k);
    const legacy = svg.replace('<rect id="bgrect" width="108" height="108"', '<rect id="bgrect" width="108" height="108" rx="22" ry="22"')
                      .replace('width="108" height="108">', `width="${s}" height="${s}">`);
    await render(s, legacy, path.join(dir, 'ic_launcher.png'));
    // Foreground adaptativo 108dp (sin fondo; el fondo lo pone colors.xml)
    const f = Math.round(108 * k);
    const fg = svg.replace(/<rect id="bgrect"[^>]*\/>/, '').replace('width="108" height="108">', `width="${f}" height="${f}">`);
    await render(f, fg, path.join(dir, 'ic_launcher_foreground.png'));
  }
  await browser.close();
  console.log('iconos listos');
})().catch(e => { console.error(e); process.exit(1); });
