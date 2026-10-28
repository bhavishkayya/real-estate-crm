import Link from "next/link";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/topbar";
import { DataTable, Badge } from "@/components/data-table";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { LeadActions } from "@/components/lead-actions";
export const dynamic = "force-dynamic";
export default async function LeadsPage({searchParams}:{searchParams:Promise<{q?:string;status?:string}>}) {
 let user;try{user=await requireUser()}catch{redirect("/login")}
 const params=await searchParams;const q=(params.q||"").trim();const status=params.status||"";
 const where:any={};if(q)where.OR=[{fullName:{contains:q}},{mobile:{contains:q}},{leadCode:{contains:q}},{email:{contains:q}}];if(status)where.status=status;if(user.role==="SALES_EXECUTIVE")where.ownerId=user.id;
 const leads=await prisma.lead.findMany({where,orderBy:{createdAt:"desc"},take:500,include:{project:{select:{name:true}},owner:{select:{name:true}}}});
 return <><Topbar title="Leads" subtitle="Create and manage your lead pipeline"/><div className="content"><div className="page-title"><div><h2>All leads</h2><span className="muted">{leads.length} matching records</span></div><Link className="primary" href="/leads/new">＋ Add lead</Link></div><form className="filters"><input name="q" defaultValue={q} placeholder="Search name, mobile, lead code…"/><select name="status" defaultValue={status}><option value="">All statuses</option>{["NEW","CONTACTED","INTERESTED","QUALIFIED","SITE_VISIT_PLANNED","SITE_VISIT_DONE","NEGOTIATION","BOOKED","NOT_INTERESTED","LOST","DUPLICATE","INVALID"].map(s=><option key={s}>{s}</option>)}</select><button className="secondary">Filter</button></form><div className="card"><DataTable headers={["Lead","Project","Source","Status","Temperature","Owner","Budget","Created","Actions"]}>{leads.map(l=><tr key={l.id}><td><b>{l.fullName}</b><div className="muted">{l.leadCode} · {l.mobile}</div></td><td>{l.project.name}</td><td>{l.source}</td><td><Badge tone={l.status}>{l.status.replaceAll("_"," ")}</Badge></td><td><Badge tone={l.temperature}>{l.temperature}</Badge></td><td>{l.owner?.name||"Unassigned"}</td><td>{l.budget?`₹${Number(l.budget).toLocaleString("en-IN")}`:"—"}</td><td>{l.createdAt.toLocaleDateString("en-IN")}</td><td><LeadActions id={l.id} status={l.status} temperature={l.temperature}/></td></tr>)}</DataTable>{leads.length===0&&<p className="empty">No leads found. Add a lead or adjust the filters.</p>}</div></div></>;
}
