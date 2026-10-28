import Link from "next/link";
import { Plus } from "lucide-react";
import { SignOutButton } from "@/components/signout-button";
export function Topbar({ title, subtitle = "Real estate sales workspace" }: { title: string; subtitle?: string }) {
  return <header className="topbar"><div><h1>{title}</h1><p>{subtitle}</p></div><div className="top-actions"><Link className="primary" href="/leads/new"><Plus size={17}/> Add Lead</Link><SignOutButton /></div></header>;
}
