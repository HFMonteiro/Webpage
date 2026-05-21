const fs = require('fs');
const path = require('path');

const root = process.cwd();
const CSS_VERSION = '20260521-v2projects';
const JS_VERSION = '20260521';
const CSS_HREF = `/assets/css/styles.css?v=${CSS_VERSION}`;
const JS_SRC = `/assets/js/script.js?v=${JS_VERSION}`;
let failures = 0;

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function check(condition, message) {
  if (!condition) {
    failures += 1;
    console.error(`FAIL ${message}`);
  } else {
    console.log(`OK ${message}`);
  }
}

function walk(dir, result = []) {
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) walk(rel, result);
    else result.push(rel);
  }
  return result;
}

function localTargetExists(url) {
  const clean = url.split('#')[0].split('?')[0];
  if (!clean || clean === '/') return exists('index.html');
  let rel = clean.replace(/^\//, '');
  if (rel.endsWith('/')) rel += 'index.html';
  return exists(rel);
}

const pages = [
  { file: 'en/index.html', lang: 'en', alternate: '/pt/' },
  { file: 'en/about.html', lang: 'en', alternate: '/pt/sobre.html' },
  { file: 'en/research.html', lang: 'en', alternate: '/pt/investigacao.html' },
  { file: 'en/experience.html', lang: 'en', alternate: '/pt/experiencia.html' },
  { file: 'en/projects.html', lang: 'en', alternate: '/pt/projetos.html' },
  { file: 'en/publications.html', lang: 'en', alternate: '/pt/publicacoes.html' },
  { file: 'en/contact.html', lang: 'en', alternate: '/pt/contacto.html' },
  { file: 'pt/index.html', lang: 'pt-PT', alternate: '/en/' },
  { file: 'pt/sobre.html', lang: 'pt-PT', alternate: '/en/about.html' },
  { file: 'pt/investigacao.html', lang: 'pt-PT', alternate: '/en/research.html' },
  { file: 'pt/experiencia.html', lang: 'pt-PT', alternate: '/en/experience.html' },
  { file: 'pt/projetos.html', lang: 'pt-PT', alternate: '/en/projects.html' },
  { file: 'pt/publicacoes.html', lang: 'pt-PT', alternate: '/en/publications.html' },
  { file: 'pt/contacto.html', lang: 'pt-PT', alternate: '/en/contact.html' },
  { file: '404.html', lang: 'en', canonical: false, hreflang: false, sitemap: false }
];

check(exists('index.html'), 'root redirect page exists');
check(exists('assets/css/styles.css'), 'global stylesheet exists');
check(exists('assets/js/script.js'), 'global script exists');
check(exists('assets/img/projects-header.svg'), 'projects header asset exists');
check(exists('assets/img/projects-og.png'), 'projects social preview PNG exists');
check(exists('sitemap.xml'), 'sitemap exists');
check(exists('publications/publications_en.html'), 'generated English publications HTML exists');
check(exists('publications/publications_pt.html'), 'generated Portuguese publications HTML exists');

const css = read('assets/css/styles.css');
const js = read('assets/js/script.js');
const sitemap = read('sitemap.xml');

check((css.match(/{/g) || []).length === (css.match(/}/g) || []).length, 'CSS braces are balanced');
check(css.includes('[data-theme="light"] body'), 'explicit light body override exists');
check(css.includes('[data-theme="dark"] body'), 'explicit dark body override exists');
check(css.lastIndexOf('[data-theme="light"] body') > css.lastIndexOf('[data-theme="dark"] body'), 'explicit light override follows dark body rules');
check(js.includes('initializeThemeToggle'), 'theme toggle initializer exists');
check(!js.includes('initializePublicationFilters'), 'publication filter initializer has been removed');
check(!css.includes('.publication-tools'), 'publication filter CSS has been removed');
check(!css.includes('project-card__top'), 'stale project-card__top selector is absent');
check(!css.includes('project-evidence'), 'stale project-evidence selector is absent');

for (const page of pages) {
  check(exists(page.file), `${page.file} exists`);
  const html = read(page.file);
  check(/^\uFEFF?\s*<!DOCTYPE html>/i.test(html), `${page.file} has HTML5 doctype`);
  check(html.includes(`lang="${page.lang}"`), `${page.file} has expected lang`);
  check(/<title>[^<]{10,}<\/title>/.test(html), `${page.file} has descriptive title`);
  check(/<meta name="description" content="[^"]{50,}">/.test(html), `${page.file} has meta description`);
  if (page.canonical !== false) {
    check(/<link rel="canonical" href="https:\/\/www\.hfmonteiro\.com\//.test(html), `${page.file} has absolute canonical`);
  }
  if (page.hreflang !== false) {
    check(html.includes('hreflang="en"'), `${page.file} has English hreflang`);
    check(html.includes('hreflang="pt-PT"'), `${page.file} has Portuguese hreflang`);
  }
  if (page.alternate) {
    check(html.includes(`href="${page.alternate}"`) || html.includes(`href="https://www.hfmonteiro.com${page.alternate}"`), `${page.file} links to alternate language page`);
  }
  check(html.includes(`href="${CSS_HREF}"`), `${page.file} uses versioned stylesheet ${CSS_VERSION}`);
  check(html.includes(`src="${JS_SRC}"`), `${page.file} uses versioned script ${JS_VERSION}`);
  check(html.includes('id="theme-toggle"'), `${page.file} has theme toggle`);
  check(html.includes('class="skip-link"'), `${page.file} has skip link`);
  check(html.includes('id="main"'), `${page.file} has main landmark target`);
  check(!/<meta\s+http-equiv="X-Frame-Options"/i.test(html), `${page.file} does not set X-Frame-Options via meta`);
  if (page.sitemap !== false) {
    check(sitemap.includes(`https://www.hfmonteiro.com/${page.file.replace('index.html', '')}`), `sitemap includes ${page.file}`);
  }
}

for (const file of ['en/projects.html', 'pt/projetos.html']) {
  const html = read(file);
  check(html.includes('https://www.hfmonteiro.com/assets/img/projects-og.png'), `${file} uses PNG social preview`);
  check(!html.includes('https://www.hfmonteiro.com/assets/img/projects-header.svg'), `${file} does not use SVG as social preview`);
  check(html.includes('property="og:image:width" content="1200"'), `${file} declares OG image width`);
  check(html.includes('property="og:image:height" content="630"'), `${file} declares OG image height`);
}

for (const file of ['publications/publications_en.html', 'publications/publications_pt.html']) {
  const html = read(file);
  const count = (html.match(/<li>/g) || []).length;
  check(html.includes('class="publications-list"'), `${file} has publications list`);
  check(count > 0, `${file} has at least one publication`);
  check(/\(20\d{2}\)/.test(html), `${file} includes publication years`);
}

for (const file of walk('.').filter((entry) => entry.endsWith('.html'))) {
  const html = read(file);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:|#)/.test(url)) continue;
    if (url.startsWith('/')) check(localTargetExists(url), `${file} internal target exists: ${url}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} validation check(s) failed.`);
  process.exit(1);
}

console.log('\nSite validation checks passed.');
