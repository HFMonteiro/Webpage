(function (root) {
  'use strict';
  const DAY=86400000;
  function median(values){
    if(!values.length) return null;
    const sorted=[...values].sort((a,b)=>a-b),middle=Math.floor(sorted.length/2);
    return sorted.length%2?sorted[middle]:(sorted[middle-1]+sorted[middle])/2;
  }
  function createDemoLog(){
    const result=[];
    for(let i=0;i<100;i++){
      const start=Date.UTC(2026,0,1+i%7),caseId='CASE-'+String(i+1).padStart(3,'0');
      const add=(activity,day)=>result.push({caseId,activity,timestamp:new Date(start+day*DAY).toISOString()});
      add('invitation',0);add('booking',2);
      let attendance;
      if(i<70) attendance=12+i%5;
      else {const rebooking=9+i%5;add('booking',rebooking);attendance=rebooking+13+i%3;}
      add('attendance',attendance);add('closed',attendance+2+i%2);
    }
    return result;
  }
  function analyseLog(log,cohort='all'){
    const grouped=new Map();
    for(const event of log){if(!grouped.has(event.caseId))grouped.set(event.caseId,[]);grouped.get(event.caseId).push(event);}
    let cases=[...grouped.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([caseId,events])=>{
      events=[...events].sort((a,b)=>Date.parse(a.timestamp)-Date.parse(b.timestamp));
      return {caseId,events,repeated:events.filter(e=>e.activity==='booking').length>1,journeyDays:(Date.parse(events.at(-1).timestamp)-Date.parse(events[0].timestamp))/DAY};
    });
    cases=cases.filter(c=>cohort==='all'||(cohort==='repeat'?c.repeated:!c.repeated));
    const edges={},nodes={};
    for(const trace of cases){
      const seen=new Set();
      trace.events.forEach((event,i)=>{
        const node=nodes[event.activity]??={eventCount:0,caseCount:0};node.eventCount++;
        if(!seen.has(event.activity)){node.caseCount++;seen.add(event.activity);}
        if(i){const previous=trace.events[i-1],key=previous.activity+'>'+event.activity;
          const edge=edges[key]??={count:0,waits:[],caseIds:new Set()};
          edge.count++;edge.waits.push((Date.parse(event.timestamp)-Date.parse(previous.timestamp))/DAY);edge.caseIds.add(trace.caseId);
        }
      });
    }
    for(const key of Object.keys(edges)){const edge=edges[key];edges[key]={count:edge.count,caseCount:edge.caseIds.size,medianDays:median(edge.waits)};}
    const repeatCases=cases.filter(c=>c.repeated).length;
    return {caseCount:cases.length,repeatCases,repeatRate:cases.length?repeatCases/cases.length*100:0,journeyMedian:median(cases.map(c=>c.journeyDays)),edges,nodes,cases};
  }
  const api={median,createDemoLog,analyseLog};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.ProcessMiningDemo=api;
})(typeof window!=='undefined'?window:globalThis);
