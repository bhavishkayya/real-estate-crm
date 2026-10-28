import { redirect } from "next/navigation";
import Link from "next/link";
import { Topbar } from "@/components/topbar";
import { ProjectCreateForm } from "@/components/crud-forms";
import { requireUser } from "@/lib/auth";
export default async function NewProjectPage(){try{await requireUser()}catch{redirect("/login")}return <><Topbar title="Add project"/><div className="content"><div className="page-title"><div><h2>Create project</h2><span className="muted">Project data is saved to MySQL</span></div><Link className="secondary" href="/projects">Back to projects</Link></div><div className="card" style={{maxWidth:800}}><ProjectCreateForm/></div></div></>}
