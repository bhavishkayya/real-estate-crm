import { redirect } from "next/navigation";
import { Topbar } from "@/components/topbar";
import { prisma } from "@/lib/prisma";
import { requireRoles } from "@/lib/auth";
import { UserCreateForm } from "@/components/crud-forms";
import { UserToggle } from "@/components/user-toggle";
export const dynamic = "force-dynamic";
export default async function UsersPage(){let current;try{current=await requireRoles(["SUPER_ADMIN","ADMIN","SALES_MANAGER","MANAGEMENT"])}catch{redirect("/login")}const canManage=current.role==="SUPER_ADMIN"||current.role==="ADMIN";const users=await prisma.user.findMany({select:{id:true,name:true,email:true,role:true,active:true,createdAt:true},orderBy:{createdAt:"desc"}});return <><Topbar title="Users" subtitle="Manage team accounts and access roles"/><div className="content">{canManage&&<div className="card"><div className="card-head"><h2>Create user</h2><span className="muted">Admin access required</span></div><UserCreateForm/></div>}<div className="card" style={{marginTop:18}}><div className="card-head"><h2>Team accounts</h2><span className="muted">{users.length} users</span></div><div className="table-wrap"><table className="table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role.replaceAll("_"," ")}</td><td>{u.active?"Active":"Disabled"}</td><td>{canManage?<UserToggle id={u.id} active={u.active}/>:"—"}</td></tr>)}</tbody></table></div></div></div></>}
