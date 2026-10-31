(() => {
  'use strict';
  const english=document.documentElement.lang==='en',language=english?'en-GB':'pt-PT';
  const copy=english?{
    stages:{invitation:'Screening invitation',booking:'Appointment booking',attendance:'Appointment',closed:'Case closed'},
    cases:'cases',repeat:'with repeat bookings',journey:'days from invitation to closure, median',days:'days',caseUnit:'cases',repeats:'repeat bookings',
    initialTitle:'Select a step to explore it.',initialText:'Explore the care pathway, see where patients wait, and look at repeat bookings.',
    waitingTitle:'Where is the waiting?',waitingText:'The median gap from booking to the appointment is {days} days. That points to a place to investigate scheduling and capacity — not a cause or a conclusion.',
    nodeCount:'{cases} cases · {events} recorded events',
    notes:{invitation:'The case ID joins individual events into one pathway. To assess coverage, you would also need to include people not reached or still waiting.',booking:'{repeat} cases were booked again. Review these events with the team: was the change expected, necessary or avoidable?',attendance:'Compare the wait between booking and attendance, then ask what was happening in the service. Timing shows where to look, not why it happened.',closed:'This is where the recorded pathway ends. Time from invitation to closure helps compare pathways, but says nothing on its own about the outcome for the person.'},
    noRepeat:'No repeat bookings in this selection.',noRepeatText:'This cohort contains the 70 pathways with one booking event. The repeated-booking pathways have not been deleted; choose All cases to include them again.'
  }:{
    stages:{invitation:'Convite para rastreio',booking:'Marcação de consulta',attendance:'Consulta',closed:'Processo encerrado'},
    cases:'casos',repeat:'com remarcação',journey:'dias do convite ao encerramento, mediana',days:'dias',caseUnit:'casos',repeats:'remarcações',
    initialTitle:'Selecione uma etapa para a explorar.',initialText:'Explore o percurso do utente, os tempos de espera e as remarcações.',
    waitingTitle:'Onde está a espera?',waitingText:'O intervalo mediano entre marcação e consulta é de {days} dias. É um ponto de partida para rever o agendamento e a capacidade, não uma explicação da causa.',
    nodeCount:'{cases} casos · {events} eventos registados',
    notes:{invitation:'O identificador do caso liga os eventos num só percurso. Para avaliar a cobertura, seria também necessário incluir quem não foi contactado ou ainda está à espera.',booking:'{repeat} casos tiveram outra marcação. Reveja estes eventos com a equipa: a mudança era esperada, necessária ou evitável?',attendance:'Compare a espera entre marcação e consulta e procure saber o que estava a acontecer no serviço. O tempo mostra onde olhar, não explica a causa.',closed:'É aqui que termina o percurso registado. O tempo desde o convite permite comparar percursos, mas não diz, por si só, qual foi o resultado para a pessoa.'},
    noRepeat:'Sem remarcações nesta seleção.',noRepeatText:'Este grupo contém os 70 percursos com uma só marcação. Os percursos com remarcação não foram eliminados; escolha Todos os casos para os incluir novamente.'
  };
  const {createDemoLog,analyseLog}=window.ProcessMiningDemo;
  const log=createDemoLog(),map=document.getElementById('process-map'),svg=document.getElementById('connections');
  const state={view:'flow',cohort:'all',selected:null};
  const small=window.matchMedia('(max-width:650px)');
  const number=value=>new Intl.NumberFormat(language,{maximumFractionDigits:1}).format(value);
  const fill=(template,values)=>template.replace(/\{(\w+)\}/g,(_,key)=>values[key]);
  const keys=['invitation>booking','booking>attendance','attendance>closed','booking>booking'];

  function drawConnections(result){
    const mobile=small.matches;
    svg.setAttribute('viewBox',mobile?'0 0 320 580':'0 0 1000 230');
    const paths=mobile?['M112 74V170','M112 234V330','M112 394V490','M224 188H256Q284 188 284 216V226Q284 252 256 252L224 230']:['M160 162H278','M440 162H558','M720 162H838','M320 130C260 22 460 22 400 128'];
    const defs='<defs>'+[['blue','var(--blue)'],['orange','var(--orange)'],['quiet','var(--line)']].map(([id,color])=>`<marker id="arrow-${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${color}"/></marker>`).join('')+'</defs>';
    svg.innerHTML=defs+keys.map((key,i)=>{
      const edge=result.edges[key],repeat=i===3;
      if(!edge)return '';
      const quiet=state.view==='rework'&&!repeat;
      const width=state.view==='flow'?Math.min(5,1+edge.count/25):state.view==='waiting'&&key==='booking>attendance'?5:2;
      return `<path class="connector${repeat?' repeat':''}${quiet?' quiet':''}" style="stroke-width:${width}" d="${paths[i]}" marker-end="url(#arrow-${quiet?'quiet':repeat?'orange':'blue'})"/>`;
    }).join('');
    for(const label of document.querySelectorAll('[data-edge]')){
      const edge=result.edges[label.dataset.edge];label.hidden=!edge;
      if(edge){
        label.textContent=state.view==='waiting'?number(edge.medianDays)+' '+copy.days:number(edge.caseCount)+' '+(label.dataset.edge==='booking>booking'?copy.repeats:copy.caseUnit);
        const [from,to]=label.dataset.edge.split('>');
        label.setAttribute('aria-label',copy.stages[from]+' → '+copy.stages[to]+': '+label.textContent);
      }
    }
  }

  function updateLog(result){
    const select=document.getElementById('example-case'),previous=select.value;
    select.replaceChildren(...result.cases.map(trace=>new Option(trace.caseId,trace.caseId)));
    if(result.cases.some(c=>c.caseId===previous))select.value=previous;
    showTrace(result);
  }
  function showTrace(result){
    const trace=result.cases.find(c=>c.caseId===document.getElementById('example-case').value)||result.cases[0];
    const tbody=document.getElementById('event-rows');tbody.replaceChildren();
    if(!trace)return;
    for(const event of trace.events){
      const row=document.createElement('tr'),activity=document.createElement('td'),time=document.createElement('td');
      activity.textContent=copy.stages[event.activity];
      time.textContent=new Intl.DateTimeFormat(language,{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(event.timestamp));
      row.append(activity,time);tbody.append(row);
    }
  }
  function render(){
    const result=analyseLog(log,state.cohort);
    document.getElementById('case-count').textContent=number(result.caseCount)+' '+copy.cases;
    document.getElementById('secondary-metric').textContent=state.view==='waiting'?number(result.journeyMedian)+' '+copy.journey:number(result.repeatRate)+'% '+copy.repeat;
    for(const button of document.querySelectorAll('[data-view]'))button.setAttribute('aria-pressed',String(button.dataset.view===state.view));
    for(const button of document.querySelectorAll('[data-node]'))button.setAttribute('aria-pressed',String(button.dataset.node===state.selected));
    let title=copy.initialTitle,text=copy.initialText;
    if(state.view==='waiting'){
      title=copy.waitingTitle;text=fill(copy.waitingText,{days:number(result.edges['booking>attendance'].medianDays)});
    }
    if(state.selected){
      title=copy.stages[state.selected]+' · '+fill(copy.nodeCount,{cases:result.nodes[state.selected].caseCount,events:result.nodes[state.selected].eventCount});
      text=fill(copy.notes[state.selected],{repeat:result.repeatCases});
    }
    if(state.view==='rework'&&!result.repeatCases){title=copy.noRepeat;text=copy.noRepeatText;}
    document.getElementById('insight-title').textContent=title;
    document.getElementById('insight-text').textContent=text;
    drawConnections(result);updateLog(result);
  }
  document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
    state.view=button.dataset.view;state.selected=state.view==='rework'?'booking':null;render();
  }));
  document.querySelectorAll('[data-node]').forEach(button=>button.addEventListener('click',()=>{
    state.selected=state.selected===button.dataset.node?null:button.dataset.node;render();
  }));
  document.getElementById('cohort').addEventListener('change',event=>{state.cohort=event.target.value;render();});
  document.getElementById('example-case').addEventListener('change',()=>showTrace(analyseLog(log,state.cohort)));
  small.addEventListener('change',()=>drawConnections(analyseLog(log,state.cohort)));
  render();
})();
