'use client';
import {Bell,Plus,Search} from 'lucide-react';
export function Topbar({title}:{title:string}){return <header className="topbar"><div><h1>{title}</h1><p>Real-time sales overview</p></div><div className="top-actions"><div className="global-search"><Search size={17}/><input placeholder="Search leads, projects, phone..."/></div><button className="icon-btn"><Bell size={19}/><i/></button><button className="primary"><Plus size={17}/> Add Lead</button></div></header>}
