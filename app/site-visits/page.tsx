import { redirect } from "next/navigation";
import { Topbar } from "@/components/topbar";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { SiteVisitForm } from "@/components/crud-forms";
import { VisitStatusForm } from "@/components/visit-status-form";
export const dynamic = "force-dynamic";
export default async function SiteVisitsPage(){try{await requireUser()}catch{redirect("/login")}const visits=await prisma.siteVisit.findMany({include:{lead:{select:{leadCode:true,fullName:true,mobile:true,project:{select:{name:true}}}}},orderBy:{scheduledAt:"asc"},take:300});return <><Topbar title="Site visits" subtitle="Plan visits and record outcomes"/><div className="content"><div className="card"><div className="card-head"><h2>Schedule site visit</h2></div><SiteVisitForm/></div><div className="card" style={{marginTop:18}}><div className="card-head"><h2>Visit schedule</h2><span className="muted">{visits.length} records</span></div><div className="table-wrap"><table className="table"><thead><tr><th>Lead</th><th>Project</th><th>Date</th><th>Status</th><th>Feedback / status</th></tr></thead><tbody>{visits.map(v=><tr key={v.id}><td><b>{v.lead.fullName}</b><div className="muted">{v.lead.leadCode}</div></td><td>{v.lead.project.name}</td><td>{v.scheduledAt.toLocaleString("en-IN")}</td><td>{v.status.replaceAll("_"," ")}</td><td><VisitStatusForm id={v.id} status={v.status} feedback={v.feedback||""}/></td></tr>)}</tbody></table></div>{visits.length===0&&<p className="empty">No site visits scheduled.</p>}</div></div></>}
