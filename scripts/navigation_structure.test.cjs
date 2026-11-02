const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const expected={pt:['/pt/sobre.html','/pt/investigacao.html','/pt/projetos.html','/pt/formacao-palestras.html','/pt/contacto.html'],en:['/en/about.html','/en/research.html','/en/projects.html','/en/speaking-training.html','/en/contact.html']};
for(const lang of ['pt','en'])for(const file of fs.readdirSync(path.join(root,lang)).filter(f=>f.endsWith('.html'))){
  test(`${lang}/${file}: five primary routes, home identity and secondary discovery`,()=>{
    const html=fs.readFileSync(path.join(root,lang,file),'utf8');
    const nav=html.match(/<nav\b[^>]*>[\s\S]*?<\/nav>/)?.[0];
    const routes=[...(nav?.split('<button')[0]||'').matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m=>m[1]);
    assert.deepEqual(routes,expected[lang]);
    const header=html.match(/<header\b[^>]*>[\s\S]*?<\/header>/)?.[0]||'';
    assert.ok(header.includes(`href="/${lang}/"`),'Identity must lead home');
    const footer=html.match(/<footer>[\s\S]*?<\/footer>/)?.[0]||'';
    for(const route of lang==='pt'?['/pt/noticias.html','/pt/publicacoes.html']:['/en/news.html','/en/publications.html'])assert.ok(footer.includes(`href="${route}"`),`Missing secondary discovery ${route}`);
    const pairs=lang==='pt'?{ 'sobre.html':'experiencia.html','experiencia.html':'sobre.html','investigacao.html':'publicacoes.html','publicacoes.html':'investigacao.html'}:{'about.html':'experience.html','experience.html':'about.html','research.html':'publications.html','publications.html':'research.html'};
    if(pairs[file]){
      const local=html.match(/<nav class="section-nav"[\s\S]*?<\/nav>/)?.[0]||'';
      assert.ok(local.includes(`href="/${lang}/${pairs[file]}"`),'Area must expose its sibling subpage');
      assert.ok(local.includes('aria-current="page"'),'Mark current subpage');
    }
    if(file==='index.html')assert.ok(html.includes('class="home-news"'),'Home must expose current news');
  });
}
