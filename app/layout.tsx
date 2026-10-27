import './globals.css';
import {Sidebar} from '@/components/sidebar';
import Link from 'next/link';
import {Home,Users,Plus,CalendarClock,MoreHorizontal} from 'lucide-react';
export const metadata={title:'RealEstate CRM',description:'Real estate lead management CRM'};
export default function RootLayout({children}:{children:React.ReactNode}){return <div className="shell"><Sidebar/><main className="main">{children}</main><div className="mobile-nav"><Link href="/dashboard"><Home size={18}/><span>Home</span></Link><Link href="/leads"><Users size={18}/><span>Leads</span></Link><Link href="/leads/new"><Plus size={22}/><span>Add</span></Link><Link href="/follow-ups"><CalendarClock size={18}/><span>Alerts</span></Link><Link href="/settings"><MoreHorizontal size={18}/><span>More</span></Link></div></div>}
