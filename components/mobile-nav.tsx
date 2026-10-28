import Link from "next/link";
import { Home, Users, Plus, CalendarClock, MoreHorizontal } from "lucide-react";
export function MobileNav() { return <div className="mobile-nav"><Link href="/dashboard"><Home size={18}/><span>Home</span></Link><Link href="/leads"><Users size={18}/><span>Leads</span></Link><Link href="/leads/new"><Plus size={22}/><span>Add</span></Link><Link href="/follow-ups"><CalendarClock size={18}/><span>Alerts</span></Link><Link href="/projects"><MoreHorizontal size={18}/><span>More</span></Link></div>; }
