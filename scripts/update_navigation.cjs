// Emits an apply_patch patch; never writes files. Keep navigation usable without JS.
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
let patch='*** Begin Patch\n';
const entries=['pt','en'].flatMap(locale=>fs.readdirSync(path.join(root,locale)).filter(f=>f.endsWith('.html')).map(file=>({locale,file,relative:locale+'/'+file})));
entries.push({locale:'en',file:'404.html',relative:'404.html'});
for(const {locale,file,relative} of entries){
  if(process.argv[2]&&!relative.startsWith(process.argv[2]))continue;
  let html=fs.readFileSync(path.join(root,relative),'utf8').replace(/\r\n/g,'\n');
  const original=html;
  let changes=[];
  function replace(before,after){
    if(!before||before===after)return;
    if(!html.includes(before))throw Error('Missing source in '+relative);
    changes.push({index:original.indexOf(before),patch:'@@\n'+before.split('\n').map(l=>'-'+l).join('\n')+'\n'+after.split('\n').map(l=>'+'+l).join('\n')+'\n'});
    html=html.replace(before,after);
  }
  const pt=locale==='pt',base='/'+locale+'/';
  const items=pt?[['sobre.html','Perfil'],['investigacao.html','Investigação'],['projetos.html','Projetos'],['formacao-palestras.html','Formação'],['contacto.html','Contacto']]:[['about.html','Profile'],['research.html','Research'],['projects.html','Projects'],['speaking-training.html','Training'],['contact.html','Contact']];
  const group=(pt?{'experiencia.html':'sobre.html','publicacoes.html':'investigacao.html'}:{'experience.html':'about.html','publications.html':'research.html'})[file]||file;
  const nav=html.match(/    <nav\b[^>]*>[\s\S]*?<\/nav>/)?.[0];
  if(nav){
    const controls=nav.slice(nav.indexOf('<button'));
    const opening=nav.slice(0,nav.indexOf('>')+1);
    const links=items.map(([route,label])=>`        <a href="${base+route}"${group===route?' class="active"'+(file===route?' aria-current="page"':''):''}>${label}</a>`).join('\n');
    replace(nav,opening+'\n'+links+'\n        '+controls);
  }
  const h1=html.split('\n').find(l=>l.includes('<h1>Hugo Monteiro</h1>'));
  if(h1)replace(h1,h1.replace('Hugo Monteiro',`<a class="site-home" href="${base}">Hugo Monteiro</a>`));
  const footer=html.match(/<footer>[\s\S]*?<\/footer>/)?.[0];
  const legal=footer?.split('\n').find(l=>l.includes(`href="${base}legal.html"`));
  if(legal&&!footer.includes(`href="${base+(pt?'noticias.html':'news.html')}"`))replace(legal,`            <a href="${base+(pt?'noticias.html':'news.html')}">${pt?'Notícias':'News'}</a> |\n            <a href="${base+(pt?'publicacoes.html':'publications.html')}">${pt?'Publicações':'Publications'}</a> |\n`+legal);
  let local=[];
  if(['sobre.html','experiencia.html'].includes(file))local=[['sobre.html','Sobre'],['experiencia.html','Experiência']];
  if(['about.html','experience.html'].includes(file))local=[['about.html','About'],['experience.html','Experience']];
  if(['investigacao.html','publicacoes.html'].includes(file))local=[['investigacao.html','Investigação'],['publicacoes.html','Publicações'],['noticias.html','Notícias']];
  if(['research.html','publications.html'].includes(file))local=[['research.html','Research'],['publications.html','Publications'],['news.html','News']];
  if(file==='projetos.html')local=[['projetos.html#projetos','Profissionais'],['projetos.html#side-projects','Pessoais']];
  if(file==='projects.html')local=[['projects.html#projetos','Professional'],['projects.html#side-projects','Personal']];
  if(local.length&&!html.includes('class="section-nav"')){
    const main=html.split('\n').find(l=>/<main\b/.test(l));
    replace(main,main+'\n'+`        <nav class="section-nav" aria-label="${pt?'Navegação nesta área':'In this section'}">`+local.map(([route,label])=>`<a href="${base+route}"${file===route?' aria-current="page"':''}>${label}</a>`).join('')+'</nav>');
  }
  if(html.includes('<section class="side-projects" aria-labelledby='))replace('    <section class="side-projects" aria-labelledby="side-projects-title">','    <section class="side-projects" id="side-projects" aria-labelledby="side-projects-title">');
  if(file==='index.html'&&!html.includes('class="home-news"')){
    const news=base+(pt?'noticias.html':'news.html'),article=base+(pt?'process-mining-saude.html':'process-mining-healthcare.html');
    const section=`        <section class="home-news" aria-labelledby="home-news-title">
            <div class="home-news-heading"><h2 id="home-news-title">${pt?'Atualizações':'Latest updates'}</h2><a href="${news}">${pt?'Todas as notícias':'All news'} <span aria-hidden="true">↗</span></a></div>
            <div class="home-news-list">
                <article><time datetime="2026-10-30">${pt?'30 de outubro de 2026':'30 October 2026'}</time><h3><a href="${article}">${pt?'Para além dos totais: compreender o percurso do utente':'Beyond the totals: understanding the patient pathway'}</a></h3><p>${pt?'Explore os percursos, as esperas e as remarcações num exemplo interativo de Process Mining.':'Explore pathways, waiting times and repeat bookings in an interactive process mining example.'}</p></article>
                <article><time datetime="2026-10-11">${pt?'11 de outubro de 2026':'11 October 2026'}</time><h3><a href="${news}#phd-heading">${pt?'Doutoramento concluído em Ciência de Dados de Saúde':'PhD completed in Health Data Science'}</a></h3><p>${pt?'A investigação sobre análise de dados aplicada aos programas de rastreio oncológico.':'Research into data analysis applied to cancer screening programmes.'}</p></article>
            </div>
        </section>`;
    replace('    </main>',section+'\n    </main>');
  }
  for(const name of ['site-controls.css','site-controls.js']){
    const oldLine=html.split('\n').find(l=>l.includes('/'+name+'?'));
    if(oldLine)replace(oldLine,oldLine.replace(/\?v=[^"\s]+/,'?v=20261102-structure'));
  }
  if(['projects.html','projetos.html'].includes(file)){
    const line=html.split('\n').find(l=>l.includes('/portfolio-pages.css?'));
    replace(line,line.replace(/\?v=[^"\s]+/,'?v=20261102-banner'));
  }
  if(changes.length)patch+='*** Update File: '+relative+'\n'+changes.sort((a,b)=>a.index-b.index).map(c=>c.patch).join('');
}
patch+='*** End Patch';
process.stdout.write(patch);
