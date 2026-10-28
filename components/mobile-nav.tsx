"use client";
import Link from "next/link";
import { useState } from "react";
import { Home, Users, Plus, CalendarClock, MoreHorizontal, Building2, MapPin, BarChart3, UserCog, Settings, X } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return <>
    {open && <><button className="mobile-menu-backdrop" aria-label="Close navigation menu" onClick={() => setOpen(false)} /><nav className="mobile-more-menu" aria-label="More modules">
      <Link href="/projects" onClick={() => setOpen(false)}><Building2 size={18}/>Projects</Link>
      <Link href="/site-visits" onClick={() => setOpen(false)}><MapPin size={18}/>Site visits</Link>
      <Link href="/reports" onClick={() => setOpen(false)}><BarChart3 size={18}/>Reports</Link>
      <Link href="/users" onClick={() => setOpen(false)}><UserCog size={18}/>Users</Link>
      <Link href="/settings" onClick={() => setOpen(false)}><Settings size={18}/>Settings</Link>
      <button onClick={() => setOpen(false)}><X size={18}/>Close menu</button>
    </nav></>}
    <div className="mobile-nav">
      <Link href="/dashboard"><Home size={18}/><span>Home</span></Link>
      <Link href="/leads"><Users size={18}/><span>Leads</span></Link>
      <Link href="/leads/new"><Plus size={22}/><span>Add</span></Link>
      <Link href="/follow-ups"><CalendarClock size={18}/><span>Follow-ups</span></Link>
      <button aria-expanded={open} onClick={() => setOpen(v => !v)}><MoreHorizontal size={18}/><span>More</span></button>
    </div>
  </>;
}
