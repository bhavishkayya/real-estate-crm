"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function FollowUpToggle({id,completed}:{id:string;completed:boolean}) { const [busy,setBusy]=useState(false);const router=useRouter();async function toggle(){setBusy(true);try{const r=await fetch(`/api/follow-ups/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({completed:!completed})});if(!r.ok)throw new Error();router.refresh();}catch{alert("Could not update follow-up.");}finally{setBusy(false)}}return <button className="secondary" disabled={busy} onClick={toggle}>{completed?"Reopen":"Mark done"}</button>; }
