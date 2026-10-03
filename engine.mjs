// Bounded, deterministic planner. All adapters below operate on synthetic local data.
export const clock = n => `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
export function createState() {
  return {
    version:1, calendarRevision:0, nextPlan:1, nextReceipt:1,
    constraints:{pickup:900,travel:30,lunch:false},
    calendar:[
      {id:'standup',title:'Team stand-up',start:540,end:570,fixed:true},
      {id:'lunch',title:'Lunch break',start:720,end:765,fixed:true},
      {id:'review',title:'Project review',start:840,end:885,fixed:false},
      {id:'pickup',title:'School pickup',start:900,end:915,fixed:true}
    ],
    tasks:[{id:'report',title:'Finish project report',duration:60,deadline:1020,status:'todo'}],
    inbox:[{id:'school',source:'School bulletin (synthetic)',text:'Pickup is at 15:00. Allow 30 minutes to travel.'}],
    plan:null, jobs:[], receipts:[], outbox:[], outage:false,
    messages:[{role:'assistant',text:'Tomorrow has a pickup conflict. Ask me to rescue your day: I can reconcile the calendar, protect travel time and help finish your report.'}]
  };
}
export function overlaps(a,b) {return a.start < b.end && b.start < a.end;}
function audit(s,kind,action,detail,status='completed') {
  s.receipts.push({id:`receipt-${s.nextReceipt++}`,kind,action,detail,status,at:new Date().toISOString(),simulation:true});
}
function say(s,text) {s.messages.push({role:'assistant',text});return text;}
export function buildPlan(s) {
  for(const job of s.jobs) if(job.adapter==='message' && ['awaiting-approval','failed'].includes(job.status)) {
    job.status='superseded';audit(s,'message',job.id,'A new plan superseded this unsent handoff.','superseded');
  }
  const p=s.constraints.pickup;
  const calendar=s.calendar.filter(e=>!['pickup','travel','report-focus'].includes(e.id)).map(e=>({...e}));
  const travel={id:'travel',title:'Travel to pickup',start:p-s.constraints.travel,end:p,fixed:true};
  const pickup={id:'pickup',title:'School pickup',start:p,end:p+15,fixed:true};
  const actions=[];const reasons=[];const issues=[];
  const review=calendar.find(e=>e.id==='review');
  const blocks=[travel,pickup];
  if(review && blocks.some(b=>overlaps(review,b))) {
    const duration=review.end-review.start;
    let candidate=null;
    for(let t=780;t+duration<=1020;t+=15) {
      const b={start:t,end:t+duration};
      if(![...calendar.filter(e=>e.id!=='review'),...blocks].some(e=>overlaps(b,e))) {candidate=b;break;}
    }
    if(candidate) {actions.push({key:'move-review',adapter:'calendar',label:`Move project review to ${clock(candidate.start)}`,payload:{id:'review',...candidate}});Object.assign(review,candidate);reasons.push('The review overlaps the 30-minute trip to school.');}
    else issues.push('No safe slot for the project review. Adjust your calendar before applying.');
  }
  // Fixed events can never be silently moved to make a plan appear feasible.
  for(const e of calendar.filter(e=>e.fixed)) if(blocks.some(b=>overlaps(e,b))) issues.push(`${e.title} conflicts with travel or pickup. This fixed event needs your decision.`);
  const currentPickup=s.calendar.find(e=>e.id==='pickup');
  if(currentPickup?.start!==p) actions.push({key:'move-pickup',adapter:'calendar',label:`Update pickup to ${clock(p)}`,payload:{id:'pickup',start:p,end:p+15}});
  if(!s.calendar.some(e=>e.id==='travel' && e.start===travel.start && e.end===travel.end)) actions.push({key:'travel',adapter:'calendar',label:`Protect travel ${clock(travel.start)}–${clock(travel.end)}`,payload:travel});
  const report=s.tasks.find(t=>t.id==='report');
  const occupied=[...calendar,...blocks];
  let focus=null;
  for(let t=720;t+report.duration<=report.deadline;t+=15) {
    const b={start:t,end:t+report.duration};
    // Without the explicit lunch preference we may use lunch for focus, but never overlap other fixed appointments.
    const considered=occupied.filter(e=>s.constraints.lunch || e.id!=='lunch');
    if(!considered.some(e=>overlaps(b,e))) {focus={id:'report-focus',title:'Report focus block',...b,fixed:false};break;}
  }
  if(!focus) issues.push('No uninterrupted report slot before 17:00. Nothing will be applied until the conflict is resolved.');
  else if(!s.calendar.some(e=>e.id==='report-focus' && e.start===focus.start && e.end===focus.end)) {
    // An explicit preview discloses any lunch replacement; it is never hidden in execution.
    if(!s.constraints.lunch && occupied.some(e=>e.id==='lunch' && overlaps(focus,e))) {
      actions.push({key:'release-lunch',adapter:'calendar',label:'Replace lunch with focus time (say “keep lunch free” to protect it)',payload:{id:'lunch',remove:true}});
      reasons.push('The first draft uses your lunch slot. You can protect lunch before approving.');
    }
    actions.push({key:'focus',adapter:'calendar',label:`Reserve report focus ${clock(focus.start)}–${clock(focus.end)}`,payload:focus});
  }
  if(!s.outbox.some(m=>m.pickup===p && m.status==='sent')) actions.push({key:'handoff',adapter:'message',label:'Prepare a pickup handoff for Sam; sending needs separate approval',payload:{recipient:'Sam (synthetic)',text:`I will handle school pickup at ${clock(p)}. Travel time is protected and the report has a focus slot.`,pickup:p}});
  const id=`plan-${s.nextPlan++}`;
  s.plan={id,baseRevision:s.calendarRevision,actions:actions.map(a=>({...a,id:`${id}:${a.key}`,status:'proposed'})),reasons,issues,focus,travel,pickup,status:issues.length?'blocked':'proposed'};
  audit(s,'plan','preview',`${id}: ${actions.length} proposed actions, ${issues.length} blocking conflicts`,'preview');
  return s.plan;
}
function runJob(s,job) {
  if(job.status==='completed') return;
  job.attempts=(job.attempts||0)+1;
  if(job.adapter==='message') {
    if(!job.approved) {job.status='awaiting-approval';return;}
    if(s.outage) {s.outage=false;job.status='failed';audit(s,'message',job.id,'Synthetic transport outage: message was not delivered.','failed');return;}
    const existing=s.outbox.find(m=>m.jobId===job.id);
    if(!existing) s.outbox.push({...job.payload,jobId:job.id,status:'sent'});
    job.status='completed';audit(s,'message',job.id,'Sent to the local synthetic outbox; no external message.');return;
  }
  const index=s.calendar.findIndex(e=>e.id===job.payload.id);
  if(job.payload.remove) {if(index>=0)s.calendar.splice(index,1);}
  else if(index>=0) Object.assign(s.calendar[index],job.payload);
  else s.calendar.push({...job.payload});
  s.calendarRevision++;job.status='completed';audit(s,'calendar',job.id,job.label);
}
export function applyPlan(s) {
  const p=s.plan;
  if(!p) return say(s,'First ask me to plan tomorrow.');
  if(p.status==='applied') return say(s,'This plan is already applied. I have not repeated its calendar changes.');
  if(p.issues.length) return say(s,'The plan has an unresolved fixed-event conflict. No changes were applied.');
  if(p.baseRevision!==s.calendarRevision) {p.status='stale';return say(s,'The source calendar changed after this preview. Ask me to replan so you can approve the current facts. No changes were applied.');}
  for(const a of p.actions) {
    let job=s.jobs.find(j=>j.id===a.id);
    if(!job){job={...a,approved:a.adapter==='calendar',attempts:0};s.jobs.push(job);}
    runJob(s,job);a.status=job.status;
  }
  p.status='applied';
  return say(s,'Your local calendar is updated. The message to Sam is ready for separate approval. Receipts show each action; your report is scheduled, not marked finished.');
}
export function approveMessages(s) {
  const jobs=s.jobs.filter(j=>j.adapter==='message' && j.status==='awaiting-approval');
  if(!jobs.length) return say(s,'There is no unapproved message ready to send.');
  for(const j of jobs) {
    if(j.payload.pickup!==s.constraints.pickup){j.status='superseded';continue;}
    j.approved=true;runJob(s,j);
  }
  return say(s,jobs.some(j=>j.status==='failed')?'The simulated delivery failed. Calendar changes remain completed. Retry will only run failed, already-approved actions.':'Message delivered to the synthetic local outbox. No real email or text was sent.');
}
export function retryFailed(s) {
  const jobs=s.jobs.filter(j=>j.status==='failed' && j.approved);
  if(!jobs.length) return say(s,'No failed, approved actions need a retry. Completed actions were not repeated.');
  for(const j of jobs) runJob(s,j);
  return say(s,'Retried only the failed actions. Check the receipts and local outbox for the actual result.');
}
export function handleCommand(s,input) {
  const text=input.trim().slice(0,1000);if(!text)return '';
  s.messages.push({role:'user',text});
  const q=text.toLowerCase();
  if(/^(apply|approve) (this |the )?plan[.!]?$/.test(q)) return applyPlan(s);
  if(/^(approve|send) (the )?message[.!]?$/.test(q)) return approveMessages(s);
  if(/^(retry|retry failed actions)[.!]?$/.test(q)) return retryFailed(s);
  if(/(explain|why|conflicts)/.test(q)) return say(s,s.plan?.reasons.join(' ')||'The project review ends at 14:45 but pickup needs travel from 14:30. I will propose a move; fixed events are preserved.');
  if(/keep lunch (free|protected)|protect lunch/.test(q)) {
    if(!s.calendar.some(e=>e.id==='lunch')){s.calendar.push({id:'lunch',title:'Lunch break',start:720,end:765,fixed:true});s.calendarRevision++;}
    s.constraints.lunch=true;const p=buildPlan(s);return say(s,p.issues.length?p.issues.join(' '):`Lunch is protected. I rebuilt the preview: report focus is ${clock(p.focus.start)}–${clock(p.focus.end)}. Nothing has been applied.`);
  }
  if(/(move|change).*pickup/.test(q)) {
    const m=q.match(/(?:to|at)\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
    if(!m)return say(s,'What pickup time? Try “Move pickup to 3:30 pm”.');
    let h=Number(m[1]);const min=Number(m[2]||0);
    if(m[3]==='pm' && h<12)h+=12;if(m[3]==='am'&&h===12)h=0;if(!m[3]&&h>=1&&h<=7)h+=12;
    if(h>23 || min>59 || h*60+min<780 || h*60+min>1080)return say(s,'This demo supports pickup between 13:00 and 18:00. The calendar has not changed.');
    s.constraints.pickup=h*60+min;const p=buildPlan(s);return say(s,p.issues.length?p.issues.join(' '):`Pickup is ${clock(p.pickup.start)} in the new preview. I recalculated travel and report time. Approval is still required.`);
  }
  if(/plan|rescue|tomorrow|replan/.test(q)) {const p=buildPlan(s);return say(s,p.issues.length?p.issues.join(' '):`I found a plan with ${p.actions.length} proposed actions. ${p.reasons.join(' ')} Review the preview, revise it or apply it.`);}
  return say(s,'I am a bounded simulation, so I only handle this day-planning workflow. Try “Plan tomorrow”, “Keep lunch free”, “Move pickup to 3:30 pm”, “Explain conflicts”, “Apply this plan”, “Approve the message” or “Retry”.');
}
