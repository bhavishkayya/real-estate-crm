import Link from "next/link";
import { Topbar } from "@/components/topbar";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DataTable, Badge } from "@/components/data-table";
export const dynamic = "force-dynamic";
export default async function Dashboard() {
  let user; try { user = await requireUser(); } catch { redirect("/login"); }
  const where = user.role === "SALES_EXECUTIVE" ? { ownerId: user.id } : {};
  const [total,hot,booked,visits,due,leads,statuses] = await Promise.all([
    prisma.lead.count({where}), prisma.lead.count({where:{...where,temperature:"HOT"}}), prisma.lead.count({where:{...where,status:"BOOKED"}}),
    prisma.siteVisit.count(), prisma.followUp.count({where:{...(user.role==="SALES_EXECUTIVE"?{ownerId:user.id}:{}),completed:false,dueAt:{lte:new Date()}}}),
    prisma.lead.findMany({where,orderBy:{createdAt:"desc"},take:8,include:{project:{select:{name:true}},owner:{select:{name:true}}}}),
    prisma.lead.groupBy({by:["status"],where,_count:{_all:true}})
  ]);
  return <><Topbar title="Dashboard" subtitle={`Welcome back, ${user.name}`} /><div className="content"><div className="stats grid"><div className="stat"><div className="stat-label">Total leads</div><div className="stat-value">{total}</div><div className="stat-sub">Saved in MySQL</div></div><div className="stat"><div className="stat-label">Hot leads</div><div className="stat-value">{hot}</div><div className="stat-sub">Need timely attention</div></div><div className="stat"><div className="stat-label">Site visits</div><div className="stat-value">{visits}</div><div className="stat-sub">All scheduled visits</div></div><div className="stat"><div className="stat-label">Bookings</div><div className="stat-value">{booked}</div><div className="stat-sub">{due} overdue follow-ups</div></div></div>
  <div className="two grid"><div className="card"><div className="card-head"><h2>Lead pipeline</h2><Link className="muted" href="/reports">View reports →</Link></div><div className="pipeline">{statuses.map(s=><div className="stage" key={s.status}><b>{s.status.replaceAll("_"," ")}</b><strong>{s._count._all}</strong><div className="bar"><span style={{width:`${total?Math.max(3,s._count._all/total*100):0}%`}}/></div></div>)}</div></div><div className="card"><div className="card-head"><h2>Quick actions</h2></div><div className="quick-links"><Link href="/leads/new">＋ Add lead</Link><Link href="/projects/new">＋ Add project</Link><Link href="/follow-ups">Schedule follow-up →</Link><Link href="/site-visits">Schedule site visit →</Link></div></div></div>
  <div className="card" style={{marginTop:18}}><div className="card-head"><h2>Recent leads</h2><Link className="muted" href="/leads">View all →</Link></div><DataTable headers={["Lead","Project","Source","Status","Owner","Budget"]}>{leads.map(l=><tr key={l.id}><td><b>{l.fullName}</b><div className="muted">{l.leadCode} · {l.mobile}</div></td><td>{l.project.name}</td><td>{l.source}</td><td><Badge tone={l.status}>{l.status.replaceAll("_"," ")}</Badge></td><td>{l.owner?.name||"Unassigned"}</td><td>{l.budget?`₹${Number(l.budget).toLocaleString("en-IN")}`:"—"}</td></tr>)}</DataTable></div></div></>;
}
