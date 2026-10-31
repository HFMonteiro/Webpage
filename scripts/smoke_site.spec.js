const { test, expect } = require('@playwright/test');

const baseURL = process.env.SITE_BASE_URL || 'http://127.0.0.1:4173';

for (const locale of ['pt', 'en']) {
  test(`${locale} tablet menu and touch-friendly dialog controls`, async ({ page }) => {
    await page.setViewportSize({ width: 981, height: 780 });
    await page.goto(`${baseURL}/${locale}/${locale === 'pt' ? 'projetos' : 'projects'}.html`);
    await expect(page.locator('#navigation-toggle')).toBeVisible();
    const nav = await page.locator('nav').boundingBox();
    expect(nav.height).toBeLessThanOrEqual(64);
    await page.setViewportSize({ width: 320, height: 780 });
    await page.locator('[data-project="hospital"]').click();
    const close = await page.locator('#close').boundingBox();
    expect(close.height).toBeGreaterThanOrEqual(44);
    expect(close.width).toBeGreaterThanOrEqual(44);
    await page.locator('#close').press('Escape');
    await expect(page.locator('[data-project="hospital"]')).toBeFocused();
    await page.goto(`${baseURL}/${locale}/${locale === 'pt' ? 'formacao-palestras' : 'speaking-training'}.html`);
    await page.locator('[data-participate]').first().click();
    const trainingClose = await page.locator('#close-dialog').boundingBox();
    expect(trainingClose.height).toBeGreaterThanOrEqual(44);
    expect(trainingClose.width).toBeGreaterThanOrEqual(44);
  });
}

for (const locale of ['pt', 'en']) {
  test(`${locale} compact navigation and direct email contact`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const route = locale === 'pt' ? '/pt/contacto.html' : '/en/contact.html';
    await page.goto(baseURL + route);
    const toggle = page.locator('#navigation-toggle');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#navigation-links')).toBeHidden();
    await expect(page.locator('#theme-toggle')).toBeVisible();
    await expect(page.locator('.lang-switcher')).toBeVisible();
    await toggle.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.locator('#navigation-links a').first().focus();
    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('.direct-contact a.email-action')).toHaveAttribute('href', 'mailto:hugo.filipe.b.monteiro@gmail.com');
    await page.locator('[data-copy-email]').click();
    await expect(page.locator('#email-copy-status')).toHaveText(locale === 'pt' ? 'Email copiado.' : 'Email copied.');
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(toggle).toBeHidden();
    await expect(page.locator('#navigation-links')).toBeVisible();
  });
}

for (const locale of ['pt', 'en']) {
  test(`${locale} news navigation and optional LinkedIn privacy`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}/${locale}/`);
    await page.locator('#navigation-toggle').click();
    await page.getByRole('link', { name: locale === 'pt' ? 'Notícias' : 'News', exact: true }).click();
    await expect(page.locator('#main')).toBeVisible();
    await expect(page.locator('#main')).toContainText('Big Data analysis techniques applied to cancer screening programs');
    await expect(page.locator('iframe')).toHaveCount(0);
    await page.setViewportSize({ width: 1440, height: 950 });
    expect(await page.locator('.news-post').evaluate(el => el.getBoundingClientRect().width)).toBeLessThanOrEqual(760);
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBeFalsy();
    const theme = await page.locator('html').getAttribute('data-theme');
    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', theme || 'light');
    await page.locator('[data-linkedin-load]').click();
    await expect(page.locator('iframe')).toHaveCount(1);
    await expect(page.locator('iframe')).toHaveAttribute('src', 'https://www.linkedin.com/embed/feed/update/urn:li:activity:7510770567529144320');
    await page.locator('.lang-switcher a').filter({ hasText: locale === 'pt' ? 'EN' : 'PT' }).click();
    await expect(page).toHaveURL(new RegExp(locale === 'pt' ? '/en/news.html' : '/pt/noticias.html'));
    await expect(page.locator('iframe')).toHaveCount(0);
  });
}

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
      await expect(page.locator('.gallery')).toBeVisible();
      await expect(page.locator('[data-project]')).toHaveCount(4);
      for (const key of ['hospital', 'webpls', 'mapping', 'pmtool']) {
        await page.locator('[data-project="' + key + '"]').click();
        await expect(page.locator('#project-dialog')).toBeVisible();
        await expect(page.locator('#detail-title')).not.toBeEmpty();
        await expect(page.locator('#detail-image')).toBeVisible();
        await page.locator('#close').press('Escape');
        await expect(page.locator('#project-dialog')).not.toBeVisible();
        await expect(page.locator('[data-project="' + key + '"]')).toBeFocused();
      }
    }

    if (testCase.home) {
      const bodyText = await page.locator('body').innerText();
      if (testCase.locale === 'en') {
        expect(bodyText).toMatch(/Public Health\s+and Digital Health/);
        expect(bodyText).toMatch(/View projects/);
      }
      if (testCase.locale === 'pt') {
        expect(bodyText).toMatch(/Saúde Pública\s+e Saúde Digital/);
        expect(bodyText).toMatch(/Ver projetos/);
      }
      await expect(page.locator('.home-work .activity-row')).toHaveCount(4);
      for (const key of ['hospital','webpls','mapping','pmtool']) {
        await expect(page.locator('.home-work a[href$="#project-' + key + '"]')).toHaveCount(1);
      }
      await expect(page.locator('.home-hero__portrait .profile-photo')).toBeVisible();
    }

    if (testCase.speaking) {
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).toMatch(/AI training/);
      expect(bodyText).toMatch(/Price on request/);
      expect(bodyText).not.toMatch(/masterclass|500 participants|2 hours/i);
      await page.locator('[data-participate]').first().click();
      await expect(page.locator('#participation-dialog')).toBeVisible();
      await expect(page.locator('#participation-email')).toHaveAttribute('href', /^mailto:/);
      await page.locator('#close-dialog').press('Escape');
      await expect(page.locator('#participation-dialog')).not.toBeVisible();
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
