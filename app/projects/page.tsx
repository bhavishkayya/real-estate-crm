import Link from "next/link";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/topbar";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { ProjectActions } from "@/components/project-actions";
export const dynamic = "force-dynamic";
export default async function ProjectsPage(){try{await requireUser()}catch{redirect("/login")}const projects=await prisma.project.findMany({orderBy:{createdAt:"desc"},include:{_count:{select:{leads:true}}}});return <><Topbar title="Projects" subtitle="Project portfolio and lead allocation"/><div className="content"><div className="page-title"><div><h2>Project portfolio</h2><span className="muted">{projects.length} projects</span></div><Link className="primary" href="/projects/new">＋ Add project</Link></div><div className="section-grid">{projects.map(p=><div className="project-card" key={p.id}><div className="project-status">{p.status}</div><h3>{p.name}</h3><p>{p.location}</p><p>{p.developer||"Developer not specified"}</p><div className="project-meta"><div><b>{p._count.leads}</b><small>Leads</small></div><div><b>{p.createdAt.toLocaleDateString("en-IN")}</b><small>Created</small></div></div><ProjectActions id={p.id} name={p.name} location={p.location} developer={p.developer||""} status={p.status}/></div>)}</div>{projects.length===0&&<div className="card empty">No projects yet. Add a project before creating leads.</div>}</div></>}
