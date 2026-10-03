import {createState,handleCommand,clock} from './engine.mjs';
const KEY='daybridge-demo-v1';
let state;
try {const parsed=JSON.parse(localStorage.getItem(KEY));state=parsed?.version===1 && Array.isArray(parsed.calendar) && Array.isArray(parsed.messages)?parsed:createState();}catch{state=createState();}
const $=s=>document.querySelector(s);
const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{/* Private-mode storage can be unavailable; the in-memory workflow still works. */}}
function render(){
  const log=$('#messages');log.replaceChildren();
  for(const m of state.messages){const b=node('div',undefined,'bubble '+m.role);b.append(node('span',m.role==='user'?'YOU':'DAYBRIDGE','speaker'),node('span',m.text));log.append(b);}log.scrollTop=log.scrollHeight;
  const p=state.plan;$('#plan-status').textContent=p?({proposed:'Awaiting approval',applied:'Calendar applied',blocked:'Needs your decision',stale:'Replan required'}[p.status]):'Not started';
  const content=$('#plan-content');content.replaceChildren();
  if(!p){const empty=node('div',undefined,'empty-plan');empty.append(node('div','↗','orb'),node('strong','Less juggling. More follow-through.'),node('p','Start with “Rescue tomorrow”. Changes stay in preview until you approve.'));content.append(empty);}
  else {if(p.issues.length)content.append(node('p',p.issues.join(' '),'blocked'));const list=node('ol',undefined,'plan-actions');for(let i=0;i<p.actions.length;i++){const a=p.actions[i];const job=state.jobs.find(j=>j.id===a.id);const li=node('li');const label=node('div',undefined,'action-label');label.append(node('span',a.adapter==='message'?'HANDOFF · SEPARATE CONSENT':'CALENDAR','action-service'),node('span',a.label));li.append(node('span',String(i+1).padStart(2,'0'),'action-number'),label,node('span',job?.status||'preview','job-status '+(job?.status||'')));list.append(li);}content.append(list);if(!p.actions.length)content.append(node('p','Everything is already reconciled. No new changes needed.','empty'));}
  $('#apply').disabled=!p || p.status!=='proposed' || !!p.issues.length;
  $('#approve-message').disabled=!state.jobs.some(j=>j.status==='awaiting-approval'&&j.adapter==='message');
  $('#retry').disabled=!state.jobs.some(j=>j.status==='failed'&&j.approved);
  $('#outage').checked=state.outage;
  const timeline=$('#timeline');timeline.replaceChildren();for(const e of [...state.calendar].sort((a,b)=>a.start-b.start)){const c=node('div',undefined,'event '+(e.id==='report-focus'?'time-focus':e.id==='travel'?'time-travel':''));c.append(node('time',`${clock(e.start)}–${clock(e.end)}`),node('strong',e.title),node('span',e.fixed?'Fixed commitment':'Flexible block'));timeline.append(c);}
  $('#summary').textContent=p?.status==='applied'?'Calendar reconciled · report still to do':p?'A revised plan is ready to review':'A pickup conflict needs attention';
  const receipts=$('#receipts');receipts.replaceChildren();if(!state.receipts.length)receipts.append(node('p','Receipts appear only when the planner or local adapters actually run.','empty'));for(const r of [...state.receipts].reverse()){const row=node('div',undefined,'receipt');row.append(node('span',r.id,'receipt-id'),node('span',r.detail,'receipt-detail'),node('span',r.status,'receipt-state '+r.status));receipts.append(row);}
  const out=$('#outbox');out.replaceChildren();for(const j of state.jobs.filter(j=>j.adapter==='message')){const b=node('div',undefined,'handoff-message');b.append(node('span',j.payload.recipient+' · '+j.status,'tiny-tag'),node('p',j.payload.text));out.append(b);}if(!out.childNodes.length)out.append(node('p','No message is staged yet. Every handoff needs explicit approval.','empty'));
  persist();
}
function send(text){handleCommand(state,text);render();}
$('#chat-form').addEventListener('submit',e=>{e.preventDefault();const text=$('#prompt').value;$('#prompt').value='';send(text);});
for(const b of document.querySelectorAll('[data-command]'))b.addEventListener('click',()=>send(b.dataset.command));
$('#apply').addEventListener('click',()=>send('Apply this plan'));
$('#approve-message').addEventListener('click',()=>send('Approve the message'));
$('#retry').addEventListener('click',()=>send('Retry failed actions'));
$('#outage').addEventListener('change',e=>{state.outage=e.target.checked;persist();});
$('#reset').addEventListener('click',()=>{state=createState();render();});
$('#export').addEventListener('click',()=>{const b=new Blob([JSON.stringify({label:'DayBridge synthetic local execution only',exportedAt:new Date().toISOString(),state},null,2)],{type:'application/json'});const u=URL.createObjectURL(b);const a=node('a');a.href=u;a.download='daybridge-simulation-receipts.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);});
render();
