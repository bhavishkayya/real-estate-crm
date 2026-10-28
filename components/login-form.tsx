"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function LoginForm() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false); const router=useRouter();
  async function submit(e:React.FormEvent) { e.preventDefault(); setError(""); setBusy(true); try { const res=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})}); const data=await res.json(); if(!res.ok) throw new Error(data.error||"Login failed"); router.replace("/dashboard"); router.refresh(); } catch(err) { setError(err instanceof Error?err.message:"Login failed"); } finally { setBusy(false); } }
  return <form className="login-form" onSubmit={submit}><label>Email address<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} /></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} /></label>{error&&<p className="error">{error}</p>}<button className="primary full" disabled={busy}>{busy?"Signing in…":"Sign in securely"}</button><p className="muted">Use the administrator credentials configured in Hostinger and created by the seed command.</p></form>;
}
