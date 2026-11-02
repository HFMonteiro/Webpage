const { test, expect } = require('@playwright/test');

const baseURL = process.env.SITE_BASE_URL || 'http://127.0.0.1:4173';

for (const locale of ['pt', 'en']) {
  const projects = locale === 'pt' ? 'projetos' : 'projects';
  const process = locale === 'pt' ? 'process-mining-saude' : 'process-mining-healthcare';

  test(`${locale} motion keeps navigation, history and dialog focus native`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}/${locale}/`);
    await page.locator('#navigation-toggle').click();
    await page.locator('#navigation-links a').nth(2).click();
    await expect(page).toHaveURL(`${baseURL}/${locale}/${projects}.html`);
    await expect(page.locator('body')).toHaveCSS('transform', 'none');
    await page.locator('[data-project="hospital"]').click();
    await expect(page.locator('#project-dialog')).toBeVisible();
    await page.locator('#close').press('Escape');
    await expect(page.locator('#project-dialog')).not.toBeVisible();
    await expect(page.locator('[data-project="hospital"]')).toBeFocused();
    await page.goBack();
    await expect(page).toHaveURL(`${baseURL}/${locale}/`);
    await expect(page.locator('#main')).toBeVisible();
  });

  test(`${locale} reduced motion can change live without hiding content`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`${baseURL}/${locale}/${projects}.html`);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('html')).toHaveClass(/reduced-motion/);
    expect(await page.locator('.reveal-target').evaluateAll(elements =>
      elements.every(element => getComputedStyle(element).opacity === '1')
    )).toBeTruthy();
    await page.locator('[data-project="hospital"]').click();
    await expect(page.locator('#project-dialog')).toHaveCSS('animation-name', 'none');
    await page.goto(`${baseURL}/${locale}/${process}.html`);
    await expect(page.locator('.connector').first()).toHaveCSS('animation-name', 'none');
    await page.locator('#cohort').selectOption('repeat');
    await expect(page.locator('#case-count')).toContainText('30');
  });

  test(`${locale} observer failure leaves content visible`, async ({ page }) => {
    await page.addInitScript(() => {
      window.IntersectionObserver = class {
        constructor() { throw new Error('Observer unavailable for test'); }
      };
    });
    await page.goto(`${baseURL}/${locale}/${projects}.html`);
    await expect(page.locator('#project-hospital')).toBeVisible();
    expect(await page.locator('.reveal-target').count()).toBe(0);
    await expect(page.locator('body')).toHaveCSS('opacity', '1');
  });
}
