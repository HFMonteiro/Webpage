const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createDemoLog,analyseLog,median}=require('../assets/js/process-mining-model.js');

test('synthetic event log contains 100 completed cases and 430 ordered events',()=>{
  const log=createDemoLog();
  assert.equal(log[0].caseId,'CASE-001');
  assert.equal(log.length,430);
  assert.equal(new Set(log.map(e=>e.caseId)).size,100);
  for(const id of new Set(log.map(e=>e.caseId))){
    const events=log.filter(e=>e.caseId===id);
    assert.equal(events[0].activity,'invitation');
    assert.equal(events.at(-1).activity,'closed');
    assert.ok(events.every((e,i)=>!i||Date.parse(e.timestamp)>=Date.parse(events[i-1].timestamp)));
  }
});

test('directly-follows edges count repeated activity without inventing extra people',()=>{
  const result=analyseLog(createDemoLog());
  assert.equal(result.caseCount,100);
  assert.equal(result.repeatCases,30);
  assert.equal(result.repeatRate,30);
  assert.equal(result.journeyMedian,18);
  assert.equal(result.edges['invitation>booking'].count,100);
  assert.equal(result.edges['booking>booking'].count,30);
  assert.equal(result.edges['booking>booking'].medianDays,9);
  assert.equal(result.edges['booking>attendance'].count,100);
  assert.equal(result.edges['booking>attendance'].medianDays,13);
  assert.equal(result.edges['attendance>closed'].medianDays,2.5);
});

test('pathway filters recompute denominators, rework and elapsed time from events',()=>{
  const log=createDemoLog(),direct=analyseLog(log,'direct'),repeat=analyseLog(log,'repeat');
  assert.equal(direct.caseCount,70);
  assert.equal(direct.repeatRate,0);
  assert.equal(direct.journeyMedian,16.5);
  assert.equal(direct.edges['booking>booking'],undefined);
  assert.equal(repeat.caseCount,30);
  assert.equal(repeat.repeatRate,100);
  assert.equal(repeat.edges['booking>booking'].count,30);
  assert.equal(repeat.edges['booking>attendance'].medianDays,14);
  assert.equal(direct.caseCount+repeat.caseCount,100);
});

test('analysis is order-independent and does not mutate source events',()=>{
  const log=createDemoLog(),before=JSON.stringify(log);
  assert.deepEqual(analyseLog([...log].reverse()),analyseLog(log));
  assert.equal(JSON.stringify(log),before);
  assert.equal(median([4,2,1,3]),2.5);
  assert.equal(median([]),null);
});

test('empty cohorts retain honest denominators and no inferred performance',()=>{
  const result=analyseLog([]);
  assert.equal(result.caseCount,0);
  assert.equal(result.repeatRate,0);
  assert.equal(result.journeyMedian,null);
  assert.deepEqual(result.edges,{});
});
