import Link from "next/link";
import { LayoutDashboard, Users, Building2, CalendarClock, MapPin, BarChart3, UserCog, Settings } from "lucide-react";
const items = [["Dashboard","/dashboard",LayoutDashboard],["Leads","/leads",Users],["Projects","/projects",Building2],["Follow-ups","/follow-ups",CalendarClock],["Site Visits","/site-visits",MapPin],["Reports","/reports",BarChart3],["Users","/users",UserCog],["Settings","/settings",Settings]] as const;
export function Sidebar() {
  return <aside className="sidebar"><Link className="brand" href="/dashboard"><div className="brand-mark">R</div><div><b>RealEstate CRM</b><small>Sales Command Center</small></div></Link><nav>{items.map(([label,href,Icon])=><Link href={href} key={href}><Icon size={18}/><span>{label}</span></Link>)}</nav><div className="sidebar-user"><div className="avatar">CRM</div><div><b>Secure workspace</b><small>Account-based access</small></div></div></aside>;
}
