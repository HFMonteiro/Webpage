const { test, expect } = require('@playwright/test');

const baseURL = process.env.SITE_BASE_URL || 'http://127.0.0.1:4173';

const cases = [
  { name: 'PT projects mobile light', path: '/pt/projetos.html', viewport: { width: 797, height: 958 }, theme: 'light', projects: true, locale: 'pt' },
  { name: 'PT projects mobile dark', path: '/pt/projetos.html', viewport: { width: 797, height: 958 }, theme: 'dark', projects: true, locale: 'pt' },
  { name: 'EN projects desktop dark', path: '/en/projects.html', viewport: { width: 1440, height: 950 }, theme: 'dark', projects: true, locale: 'en' },
  { name: 'PT publications mobile', path: '/pt/publicacoes.html', viewport: { width: 797, height: 958 }, theme: 'light', publications: true },
  { name: 'EN homepage mobile', path: '/en/', viewport: { width: 390, height: 844 }, theme: 'light', home: true, locale: 'en' },
  { name: 'PT homepage mobile', path: '/pt/', viewport: { width: 390, height: 844 }, theme: 'light', home: true, locale: 'pt' },
  { name: 'EN speaking desktop', path: '/en/speaking-training.html', viewport: { width: 1280, height: 900 }, theme: 'light', speaking: true },
  { name: '404 desktop', path: '/404.html', viewport: { width: 1024, height: 768 }, theme: 'light' }
];

function luminance([r, g, b]) {
  const values = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
}

function contrast(foreground, background) {
  const l1 = luminance(foreground);
  const l2 = luminance(background);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

for (const testCase of cases) {
  test(testCase.name, async ({ page }) => {
    const consoleErrors = [];
    const failedRequests = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('ERR_CERT_AUTHORITY_INVALID')) consoleErrors.push(msg.text());
    });
    page.on('requestfailed', (request) => {
      if (request.url().startsWith(baseURL)) failedRequests.push(`${request.method()} ${request.url()}`);
    });

    await page.setViewportSize(testCase.viewport);
    await page.addInitScript((theme) => {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }, testCase.theme);
    await page.goto(`${baseURL}${testCase.path}`, { waitUntil: 'networkidle' });

    await expect(page.locator('#main')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('#theme-toggle')).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow).toBeFalsy();

    if (testCase.projects) {
      await expect(page.locator('.project-index')).toBeVisible();
      await expect(page.locator('.project-card')).toHaveCount(6);
      await expect(page.locator('.project-facts dt').first()).toBeVisible();
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).not.toMatch(/sanitiz/i);
      if (testCase.locale === 'pt') {
        expect(bodyText).toMatch(/Alguns exemplos de trabalho em saúde pública/);
        expect(bodyText).not.toMatch(/Contribution|Output|Selected projects|Featured Work|Additional Applied Work/);
      }
      if (testCase.locale === 'en') {
        expect(bodyText).toMatch(/A selection of applied work across public health/);
        expect(bodyText).toMatch(/Governance/);
      }

      const contrastOk = await page.evaluate(({ contrastSource }) => {
        function rgb(value) {
          const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : [0, 0, 0];
        }
        function lum(color) {
          return color.map((channel) => {
            const c = channel / 255;
            return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
          }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
        }
        function ratio(a, b) {
          const l1 = lum(a);
          const l2 = lum(b);
          return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        }
        return Array.from(document.querySelectorAll('.project-number, .project-facts dt')).every((el) => {
          const fg = rgb(getComputedStyle(el).color);
          const card = el.closest('.project-card') || document.body;
          const bg = rgb(getComputedStyle(card).backgroundColor || getComputedStyle(document.body).backgroundColor);
          return ratio(fg, bg) >= contrastSource;
        });
      }, { contrastSource: 4.5 });
      expect(contrastOk).toBeTruthy();
    }

    if (testCase.home) {
      const bodyText = await page.locator('body').innerText();
      if (testCase.locale === 'en') {
        expect(bodyText).toMatch(/Public Health and Digital Health/);
        expect(bodyText).toMatch(/View projects/);
      }
      if (testCase.locale === 'pt') {
        expect(bodyText).toMatch(/Saúde Pública e Saúde Digital/);
        expect(bodyText).toMatch(/Ver projetos/);
      }
      await expect(page.locator('.overview-cards .card')).toHaveCount(5);
    }

    if (testCase.speaking) {
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).toMatch(/Public health intelligence systems/);
      expect(bodyText).toMatch(/Request guidance/);
    }

    if (testCase.publications) {
      await expect(page.locator('.publication-tools')).toHaveCount(0);
      await expect(page.locator('.publications-list li').first()).toBeVisible();
      expect(await page.locator('.publications-list li').count()).toBeGreaterThanOrEqual(10);
    }

    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });
}
