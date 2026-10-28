"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Item = {id:string;name?:string;fullName?:string;mobile?:string;leadCode?:string;projectId?:string;location?:string;developer?:string;status?:string;temperature?:string;source?:string;role?:string;email?:string;active?:boolean};
function ErrorText({value}:{value:string}) { return value?<p className="error">{value}</p>:null; }
export function ProjectCreateForm() {
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false); const router=useRouter();
  async function submit(e:React.FormEvent<HTMLFormElement>) { e.preventDefault();setError("");setBusy(true);const f=new FormData(e.currentTarget);try{const r=await fetch("/api/projects",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:f.get("name"),location:f.get("location"),developer:f.get("developer")})});const d=await r.json();if(!r.ok)throw new Error(d.error);router.push("/projects");router.refresh();}catch(x){setError(x instanceof Error?x.message:"Could not save project.");}finally{setBusy(false)}}
  return <form className="form-grid" onSubmit={submit}><label>Project name *<input name="name" required maxLength={150}/></label><label>Location *<input name="location" required maxLength={200}/></label><label className="wide">Developer<input name="developer" maxLength={150}/></label><ErrorText value={error}/><div className="wide"><button className="primary" disabled={busy}>{busy?"Saving…":"Save project"}</button></div></form>;
}
export function LeadCreateForm() {
  const [projects,setProjects]=useState<Item[]>([]);const [users,setUsers]=useState<Item[]>([]);const [error,setError]=useState("");const [busy,setBusy]=useState(false);const router=useRouter();
  useEffect(()=>{Promise.all([fetch("/api/projects"),fetch("/api/users")]).then(async([p,u])=>{if(p.ok)setProjects((await p.json()).projects.filter((x:Item)=>x.status==="ACTIVE"));if(u.ok)setUsers((await u.json()).users.filter((x:Item)=>x.active));}).catch(()=>{});},[]);
  async function submit(e:React.FormEvent<HTMLFormElement>) {e.preventDefault();setError("");setBusy(true);const f=new FormData(e.currentTarget);const body=Object.fromEntries(f.entries());try{const r=await fetch("/api/leads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const d=await r.json();if(!r.ok)throw new Error(d.error);router.push("/leads");router.refresh();}catch(x){setError(x instanceof Error?x.message:"Could not save lead.");}finally{setBusy(false)}}
  return <form className="form-grid" onSubmit={submit}>
    <label>Full name *<input name="fullName" required maxLength={150}/></label><label>Mobile number *<input name="mobile" required maxLength={40} placeholder="+91…"/></label>
    <label>Email<input name="email" type="email" maxLength={254}/></label><label>WhatsApp<input name="whatsapp" maxLength={40}/></label>
    <label>Project *<select name="projectId" required defaultValue=""><option value="" disabled>Select active project</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name} — {p.location}</option>)}</select>{projects.length===0&&<small className="hint">Create a project first if the list is empty.</small>}</label>
    <label>Source *<select name="source" defaultValue="Website">{["Website","Meta Ads","Google Ads","WhatsApp","99acres","MagicBricks","Referral","Broker","Walk-in","Call","Other"].map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Configuration<input name="configuration" placeholder="2 BHK, 3 BHK…"/></label><label>Budget (INR)<input name="budget" type="number" min="0" step="0.01"/></label>
    <label>Status<select name="status" defaultValue="NEW">{["NEW","CONTACTED","INTERESTED","QUALIFIED","SITE_VISIT_PLANNED","SITE_VISIT_DONE","NEGOTIATION","BOOKED","NOT_INTERESTED","LOST","DUPLICATE","INVALID"].map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Temperature<select name="temperature" defaultValue="WARM"><option>HOT</option><option>WARM</option><option>COLD</option></select></label>
    <label>Purpose<select name="purpose" defaultValue=""><option value="">Not specified</option><option value="SELF_USE">Self use</option><option value="INVESTMENT">Investment</option><option value="RENTAL">Rental</option><option value="OTHER">Other</option></select></label>
    <label>Assign owner<select name="ownerId" defaultValue=""><option value="">Unassigned</option>{users.map(u=><option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}</select></label>
    <label>Preferred location<input name="preferredLocation"/></label><label>City<input name="city"/></label>
    <label>Campaign<input name="campaign"/></label><label>Ad set / group<input name="adSet"/></label><label>Ad name<input name="ad"/></label>
    <label className="wide">Initial note<textarea name="notes" maxLength={2000}/></label><div className="wide"><ErrorText value={error}/><button className="primary" disabled={busy||projects.length===0}>{busy?"Saving lead…":"Create lead"}</button></div>
  </form>;
}
export function FollowUpForm() {
 const [leads,setLeads]=useState<Item[]>([]);const [error,setError]=useState("");const router=useRouter();
 useEffect(()=>{fetch("/api/leads").then(r=>r.ok?r.json():{leads:[]}).then(d=>setLeads(d.leads||[])).catch(()=>{});},[]);
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setError("");const f=new FormData(e.currentTarget);try{const r=await fetch("/api/follow-ups",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(f.entries()))});const d=await r.json();if(!r.ok)throw new Error(d.error);router.refresh();(e.target as HTMLFormElement).reset();}catch(x){setError(x instanceof Error?x.message:"Could not create follow-up.");}}
 return <form className="form-grid" onSubmit={submit}><label>Lead *<select name="leadId" required defaultValue=""><option value="" disabled>Select lead</option>{leads.map(l=><option key={l.id} value={l.id}>{l.leadCode} — {l.fullName}</option>)}</select></label><label>Type *<select name="type"><option>Call</option><option>WhatsApp</option><option>Email</option><option>Meeting</option><option>Other</option></select></label><label>Due date & time *<input type="datetime-local" name="dueAt" required/></label><label className="wide">Notes<textarea name="notes"/></label><div className="wide"><ErrorText value={error}/><button className="primary">Schedule follow-up</button></div></form>;
}
export function SiteVisitForm() {
 const [leads,setLeads]=useState<Item[]>([]);const [error,setError]=useState("");const router=useRouter();
 useEffect(()=>{fetch("/api/leads").then(r=>r.ok?r.json():{leads:[]}).then(d=>setLeads(d.leads||[])).catch(()=>{});},[]);
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setError("");const f=new FormData(e.currentTarget);try{const r=await fetch("/api/site-visits",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(f.entries()))});const d=await r.json();if(!r.ok)throw new Error(d.error);router.refresh();(e.target as HTMLFormElement).reset();}catch(x){setError(x instanceof Error?x.message:"Could not schedule visit.");}}
 return <form className="form-grid" onSubmit={submit}><label>Lead *<select name="leadId" required defaultValue=""><option value="" disabled>Select lead</option>{leads.map(l=><option key={l.id} value={l.id}>{l.leadCode} — {l.fullName}</option>)}</select></label><label>Date & time *<input type="datetime-local" name="scheduledAt" required/></label><label>People count<input type="number" name="peopleCount" min="1"/></label><label>Configuration<input name="configuration" placeholder="2 BHK…"/></label><div className="wide"><ErrorText value={error}/><button className="primary">Schedule site visit</button></div></form>;
}
export function UserCreateForm() {
 const [error,setError]=useState("");const router=useRouter();
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setError("");const f=new FormData(e.currentTarget);try{const r=await fetch("/api/users",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(f.entries()))});const d=await r.json();if(!r.ok)throw new Error(d.error);router.refresh();(e.target as HTMLFormElement).reset();}catch(x){setError(x instanceof Error?x.message:"Could not create user.");}}
 return <form className="form-grid" onSubmit={submit}><label>Name *<input name="name" required/></label><label>Email *<input name="email" type="email" required/></label><label>Temporary password *<input name="password" type="password" minLength={12} required/><small className="hint">At least 12 characters.</small></label><label>Role *<select name="role"><option>SALES_EXECUTIVE</option><option>SALES_MANAGER</option><option>MANAGEMENT</option><option>ADMIN</option><option>SUPER_ADMIN</option></select></label><div className="wide"><ErrorText value={error}/><button className="primary">Create user</button></div></form>;
}
