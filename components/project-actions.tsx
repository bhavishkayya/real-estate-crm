"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function ProjectActions({id,name,location,developer,status}:{id:string;name:string;location:string;developer:string;status:string}) {
  const [busy,setBusy]=useState(false);const router=useRouter();
  async function edit(){const nextName=prompt("Project name",name);if(nextName===null)return;const nextLocation=prompt("Project location",location);if(nextLocation===null)return;const nextDeveloper=prompt("Developer (optional)",developer);if(nextDeveloper===null)return;setBusy(true);try{const r=await fetch(`/api/projects/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:nextName,location:nextLocation,developer:nextDeveloper})});const d=await r.json();if(!r.ok)throw new Error(d.error);router.refresh();}catch(e){alert(e instanceof Error?e.message:"Could not update project.");}finally{setBusy(false)}}
  async function toggle(){const next=status==="ACTIVE"?"ARCHIVED":"ACTIVE";if(!confirm(`${next==="ARCHIVED"?"Archive":"Reactivate"} ${name}?`))return;setBusy(true);try{const r=await fetch(`/api/projects/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:next})});const d=await r.json();if(!r.ok)throw new Error(d.error);router.refresh();}catch(e){alert(e instanceof Error?e.message:"Could not update project.");}finally{setBusy(false)}}
  return <div className="row-actions"><button className="secondary" disabled={busy} onClick={edit}>Edit</button><button className="secondary" disabled={busy} onClick={toggle}>{status==="ACTIVE"?"Archive":"Reactivate"}</button></div>;
}
