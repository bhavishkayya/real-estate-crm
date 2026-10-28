"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function UserToggle({id,active}:{id:string;active:boolean}){const [busy,setBusy]=useState(false);const router=useRouter();async function toggle(){if(!confirm(`${active?"Disable":"Enable"} this account?`))return;setBusy(true);try{const r=await fetch(`/api/users/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({active:!active})});const d=await r.json();if(!r.ok)throw new Error(d.error);router.refresh();}catch(e){alert(e instanceof Error?e.message:"Unable to update user.");}finally{setBusy(false)}}return <button className="secondary" disabled={busy} onClick={toggle}>{active?"Disable":"Enable"}</button>}
