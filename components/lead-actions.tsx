"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function LeadActions({id,status,temperature}:{id:string;status:string;temperature:string}) {
  const [s,setS]=useState(status); const [t,setT]=useState(temperature); const [busy,setBusy]=useState(false); const router=useRouter();
  async function save(){setBusy(true);try{const r=await fetch(`/api/leads/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:s,temperature:t})});const d=await r.json();if(!r.ok)throw new Error(d.error);router.refresh();}catch(e){alert(e instanceof Error?e.message:"Could not update lead.");}finally{setBusy(false)}}
  async function remove(){if(!confirm("Delete this lead and its related notes, follow-ups and site visits?"))return;setBusy(true);try{const r=await fetch(`/api/leads/${id}`,{method:"DELETE"});const d=await r.json();if(!r.ok)throw new Error(d.error);router.refresh();}catch(e){alert(e instanceof Error?e.message:"Could not delete lead.");}finally{setBusy(false)}}
  return <div className="row-actions"><select aria-label="Lead status" value={s} onChange={e=>setS(e.target.value)}>{["NEW","CONTACTED","INTERESTED","QUALIFIED","SITE_VISIT_PLANNED","SITE_VISIT_DONE","NEGOTIATION","BOOKED","NOT_INTERESTED","LOST","DUPLICATE","INVALID"].map(x=><option key={x}>{x}</option>)}</select><select aria-label="Lead temperature" value={t} onChange={e=>setT(e.target.value)}>{["HOT","WARM","COLD"].map(x=><option key={x}>{x}</option>)}</select><button className="secondary" disabled={busy} onClick={save}>Save</button><button className="danger" disabled={busy} onClick={remove}>Delete</button></div>;
}
