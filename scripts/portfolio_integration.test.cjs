const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const routes = [
  ['pt/process-mining-saude.html','en/process-mining-healthcare.html','process-mining'],
  ['en/process-mining-healthcare.html','pt/process-mining-saude.html','process-mining'],
  ['pt/projetos.html','en/projects.html','projects'],
  ['en/projects.html','pt/projetos.html','projects'],
  ['pt/formacao-palestras.html','en/speaking-training.html','training'],
  ['en/speaking-training.html','pt/formacao-palestras.html','training'],
  ['pt/legal.html','en/legal.html','legal'],
  ['en/legal.html','pt/legal.html','legal']
];
for (const [file,alternate,kind] of routes) test(`${file}: integrated page uses main-site routes, assets and theme`, () => {
  const html = fs.readFileSync(path.join(root,file),'utf8');
  assert.match(html,/class="(?:portfolio-page|pm-article)/,'Integrated content is not present');
  assert.ok(html.includes(`href="/${alternate}"`),'Equivalent language route is missing');
  assert.match(html,kind==='process-mining'?/href="\/assets\/css\/process-mining.css/:/href="\/assets\/css\/portfolio-pages.css/);
  assert.doesNotMatch(html,/mockups\/|\.\.\/portfolio\.(?:css|js)/);
  assert.equal((html.match(/id="theme-toggle"/g)||[]).length,1,'Use one site theme control');
  assert.ok(html.includes('/assets/js/script.js?'),'Main-site theme script is missing');
  assert.ok(html.includes('0000-0002-6060-3335'),'ORCID footer must be preserved');
  const nav = html.match(/<nav[\s\S]*?<\/nav>/)[0];
  assert.ok(nav.includes(file.startsWith('pt/') ? '/pt/formacao-palestras.html' : '/en/speaking-training.html'));
  if(kind==='projects'){
    assert.equal((html.match(/data-project="/g)||[]).length,4);
    assert.match(html,/id="project-dialog"/);
    for(const key of ['hospital','webpls','mapping','pmtool']) assert.ok(html.includes(`data-project="${key}"`));
  }
  if(kind==='training'){
    assert.match(html,/id="participation-dialog"/);
    assert.doesNotMatch(html,/\b500\b|2 horas|2 hours|masterclass/i);
  }
  if(kind==='legal'){
    assert.doesNotMatch(html,/não comercial|non-commercial/);
    assert.ok(html.includes(file.startsWith('pt/') ? 'id="ia-generativa"' : 'id="generative-ai"'));
    assert.match(html,/LinkedIn/,'Retain the site-specific optional LinkedIn disclosure');
  }
  if(kind==='process-mining'){
    assert.match(html,/id="process-map"/);
    assert.match(html,/\/assets\/js\/process-mining-model.js/);
    assert.match(html,/\/assets\/js\/process-mining.js/);
    assert.doesNotMatch(html,/portfolio-theme|portfolio.js|id="theme"/);
    const listing=fs.readFileSync(path.join(root,file.startsWith('pt/')?'pt/noticias.html':'en/news.html'),'utf8');
    assert.ok(listing.includes(`href="/${file}"`),'News listing must link to the interactive article');
  }
  for(const [,url] of html.matchAll(/(?:href|src)="(\/[^"?#]+)(?:[?#][^"]*)?"/g)){
    const target=path.join(root,url);
    assert.ok(fs.existsSync(target),`Missing integration target ${url}`);
  }
});

test('training draft is bilingual and never sends a message',()=>{
  const script=path.join(root,'assets/js/training.js');
  assert.ok(fs.existsSync(script),'Main-site contact behaviour is missing');
  const {buildParticipationEmail}=require(script);
  for(const language of ['pt-PT','en']){
    const draft=new URL(buildParticipationEmail(language));
    assert.equal(draft.protocol,'mailto:');
    assert.equal(draft.pathname,'hugo.filipe.b.monteiro@gmail.com');
    assert.match(draft.searchParams.get('body'),language==='en'?/training or consulting/:/formação ou consultoria/);
  }
});

test('homepage project deep links resolve to a section in the integrated gallery',()=>{
  for (const [home,projects] of [['pt/index.html','pt/projetos.html'],['en/index.html','en/projects.html']]) {
    const html=fs.readFileSync(path.join(root,home),'utf8');
    const target=fs.readFileSync(path.join(root,projects),'utf8');
    for (const [,id] of html.matchAll(/href="\/(?:pt\/projetos|en\/projects)\.html#([^"]+)"/g)) {
      assert.ok(target.includes(`id="${id}"`),`Missing gallery anchor ${id}`);
    }
  }
});

test('main pages do not load third-party scripts, images or frames automatically',()=>{
  for (const directory of ['pt','en']) for (const file of fs.readdirSync(path.join(root,directory)).filter(f=>f.endsWith('.html'))) {
    const html=fs.readFileSync(path.join(root,directory,file),'utf8');
    for (const [tag] of html.matchAll(/<(?:script|img|iframe|link)\b[^>]*>/gi)) {
      if (/^<link/i.test(tag) && !/rel="(?:stylesheet|preload|modulepreload|icon)"/i.test(tag)) continue;
      const source=tag.match(/(?:src|href)="([^"]+)"/i)?.[1];
      assert.ok(!source || !/^(?:https?:)?\/\//i.test(source),`${directory}/${file}: third-party resource loads without a visitor action`);
    }
  }
});
