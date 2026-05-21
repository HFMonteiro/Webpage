const fs = require('fs');
const path = require('path');

const root = process.cwd();
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
  { file: 'pt/contacto.html', lang: 'pt-PT', alternate: '/en/contact.html' }
];

check(exists('index.html'), 'root redirect page exists');
check(exists('assets/css/styles.css'), 'global stylesheet exists');
check(exists('assets/js/script.js'), 'global script exists');
check(exists('assets/img/projects-header.svg'), 'projects header asset exists');
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

for (const page of pages) {
  check(exists(page.file), `${page.file} exists`);
  const html = read(page.file);
  check(/^\uFEFF?\s*<!DOCTYPE html>/i.test(html), `${page.file} has HTML5 doctype`);
  check(html.includes(`lang="${page.lang}"`), `${page.file} has expected lang`);
  check(/<title>[^<]{10,}<\/title>/.test(html), `${page.file} has descriptive title`);
  check(/<meta name="description" content="[^"]{50,}">/.test(html), `${page.file} has meta description`);
  check(/<link rel="canonical" href="https:\/\/www\.hfmonteiro\.com\//.test(html), `${page.file} has absolute canonical`);
  check(html.includes('hreflang="en"'), `${page.file} has English hreflang`);
  check(html.includes('hreflang="pt-PT"'), `${page.file} has Portuguese hreflang`);
  check(html.includes(`href="${page.alternate}"`) || html.includes(`href="https://www.hfmonteiro.com${page.alternate}"`), `${page.file} links to alternate language page`);
  check(/href="\/assets\/css\/styles\.css(?:\?v=[^"]+)?"/.test(html), `${page.file} links global stylesheet`);
  check(/src="\/assets\/js\/script\.js(?:\?v=[^"]+)?"/.test(html), `${page.file} loads global script`);
  check(html.includes('id="theme-toggle"'), `${page.file} has theme toggle`);
  check(html.includes('class="skip-link"'), `${page.file} has skip link`);
  check(html.includes('id="main"'), `${page.file} has main landmark target`);
  check(!/<meta\s+http-equiv="X-Frame-Options"/i.test(html), `${page.file} does not set X-Frame-Options via meta`);
  check(sitemap.includes(`https://www.hfmonteiro.com/${page.file.replace('index.html', '')}`), `sitemap includes ${page.file}`);
}

for (const file of ['publications/publications_en.html', 'publications/publications_pt.html']) {
  const html = read(file);
  const count = (html.match(/<li>/g) || []).length;
  check(html.includes('class="publications-list"'), `${file} has publications list`);
  check(count > 0, `${file} has at least one publication`);
  check(/\(20\d{2}\)/.test(html), `${file} includes publication years`);
}

if (failures > 0) {
  console.error(`\n${failures} validation check(s) failed.`);
  process.exit(1);
}

console.log('\nSite validation checks passed.');