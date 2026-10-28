import { redirect } from "next/navigation";
import Link from "next/link";
import { Topbar } from "@/components/topbar";
import { LeadCreateForm } from "@/components/crud-forms";
import { requireUser } from "@/lib/auth";
export default async function NewLeadPage(){try{await requireUser()}catch{redirect("/login")}return <><Topbar title="Add lead"/><div className="content"><div className="page-title"><div><h2>Create new lead</h2><span className="muted">Required fields are marked with *</span></div><Link className="secondary" href="/leads">Back to leads</Link></div><div className="card" style={{maxWidth:1000}}><LeadCreateForm/></div></div></>}
