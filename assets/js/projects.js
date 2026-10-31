'use strict';
const projects = {
  hospital: {
    title: 'Hospital Simulator', category: 'Simulação hospitalar', status: 'Protótipo demonstrativo',
    image: '/assets/img/projects/hospital.png', alt: 'Vista isométrica real do protótipo Hospital Planner',
    intro: 'Como se relacionam os espaços, os recursos e a resposta de um hospital?',
    context: 'Um simulador para explorar cenários de organização e resposta hospitalar a partir de uma planta. Foi desenvolvido para experimentar e discutir hipóteses, não para orientar decisões clínicas.',
    features: 'Alternar entre a planta 2D e a vista isométrica, configurar recursos, executar cenários e rever o que aconteceu.',
    link: null
  },
  webpls: {
    title: 'WebPLS Gaia', category: 'Planeamento em saúde', status: 'Página pública · Eixos estratégicos',
    image: '/assets/img/projects/webpls.jpg', alt: 'Página pública dos objetivos SMART e eixos estratégicos do WebPLS Gaia e Espinho',
    intro: 'Um portal para consultar o Plano Local de Saúde de Gaia e Espinho.',
    context: 'O microsite do Plano Local de Saúde da ULS Gaia e Espinho organiza a informação do plano em páginas de diagnóstico, prioridades, eixos, programas e monitorização.',
    features: 'A página apresentada cruza os eixos estratégicos com propostas de intervenção, grupos temáticos e indicadores. A navegação permite acompanhar a ligação entre estratégia e respostas locais.',
    link: 'https://webplsulsge.vercel.app/objetivos-eixos.html'
  },
  pmtool: {
    title: 'PMTool', category: 'Process Mining', status: 'Análise de processos · Em desenvolvimento',
    image: '/assets/img/projects/pmtool.png', alt: 'Análise de conformidade no PMTool, com um exemplo de rastreio baseado em dados sintéticos',
    intro: 'Dos registos de atividade aos percursos reais de um processo.',
    context: 'O PMTool permite analisar registos de eventos para descobrir percursos, comparar modelos e estudar o desempenho de processos. Os programas de rastreio são uma das suas aplicações; a abordagem também se aplica a outros serviços e circuitos administrativos.',
    features: 'Identificar variantes, analisar tempos de espera e pontos de acumulação, comparar o percurso observado com um modelo de referência e explorar desvios. A imagem mostra um exemplo de rastreio com dados sintéticos.',
    link: null
  },
  mapping: {
    title: 'Mapping & Power BI', category: 'Dados e inteligência territorial', status: 'Exploração cartográfica · WebGIS Portugal',
    image: '/assets/img/projects/mapping.png', alt: 'WebGIS Portugal com unidades de saúde e limites das ULS sobre um mapa',
    intro: 'Mapas e indicadores para analisar a distribuição dos serviços de saúde.',
    context: 'Esta área de trabalho reúne cartografia e análise de dados de saúde. A componente WebGIS permite explorar a rede de unidades e o enquadramento territorial do SNS.',
    features: 'Explorar unidades de saúde no mapa, cruzar camadas territoriais e consultar indicadores agregados. Aqui, a vista WebGIS mostra a componente cartográfica desta área de trabalho.',
    link: null
  }
};
const projectsEn = {
  hospital: {
    title:'Hospital Simulator', category:'Hospital simulation', status:'Demonstration prototype',
    image:'/assets/img/projects/hospital.png', alt:'Isometric view of the Hospital Planner prototype',
    intro:'How do hospital spaces, resources and response scenarios fit together?',
    context:'A simulator for exploring hospital organisation and response scenarios using a floor plan. It was developed to test and discuss ideas, not to guide clinical decisions.',
    features:'Switch between 2D and isometric views, configure resources, run scenarios and review what happened.', link:null
  },
  webpls: {
    title:'WebPLS Gaia', category:'Health planning', status:'Public portal · Strategic priorities',
    image:'/assets/img/projects/webpls.jpg', alt:'Public WebPLS Gaia e Espinho page of objectives and strategic priorities',
    intro:'A portal for exploring the Gaia e Espinho Local Health Plan.',
    context:'The Local Health Plan microsite brings together the health assessment, priorities, strategic areas, programmes and monitoring for ULS Gaia e Espinho.',
    features:'Explore how strategic priorities connect with proposed interventions, working groups and indicators, and follow the link between planning and local action.',
    link:'https://webplsulsge.vercel.app/objetivos-eixos.html'
  },
  mapping: {
    title:'Mapping & Power BI', category:'Data and geographic analysis', status:'Interactive mapping · WebGIS Portugal',
    image:'/assets/img/projects/mapping.png', alt:'WebGIS Portugal map of healthcare facilities and Local Health Unit boundaries',
    intro:'Maps and indicators for analysing the distribution of healthcare services.',
    context:'This work combines mapping and health data analysis. The WebGIS component lets users explore the healthcare network and its geographic context within Portugal’s National Health Service.',
    features:'Explore healthcare facilities, combine geographic layers and consult aggregate indicators. The WebGIS view shown here illustrates the mapping component of this work.', link:null
  },
  pmtool: {
    title:'PMTool', category:'Process mining', status:'Process analysis · In development',
    image:'/assets/img/projects/pmtool.png', alt:'PMTool conformance analysis using a synthetic screening pathway example',
    intro:'Turn activity records into an understanding of how a process actually works.',
    context:'PMTool analyses event logs to discover pathways, compare models and study process performance. Screening programmes are one application; the approach also applies to other services and administrative workflows.',
    features:'Identify variants, examine waiting times and bottlenecks, compare observed pathways with a reference model and investigate deviations. The image shows a screening example using synthetic data.', link:null
  }
};
const dialog = document.getElementById('project-dialog');
let previousFocus;
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const project = (document.documentElement.lang === 'en' ? projectsEn : projects)[button.dataset.project];
    previousFocus = button;
    for (const key of ['title','category','status','intro','context','features']) {
      document.getElementById('detail-' + key).textContent = project[key];
    }
    const image = document.getElementById('detail-image');
    image.src = project.image;
    image.alt = project.alt;
    const link = document.getElementById('detail-link');
    link.hidden = !project.link;
    if (project.link) link.href = project.link;
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('modal-open');
    document.getElementById('close').focus();
  });
});
document.getElementById('close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  if (previousFocus) previousFocus.focus();
});
