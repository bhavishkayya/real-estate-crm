import { ReactNode } from 'react';
export function Badge({children,tone='default'}:{children:ReactNode;tone?:string}){return <span className={`badge ${tone}`}>{children}</span>}
export function Stat({label,value,sub}:{label:string;value:string;sub:string}){return <div className="stat"><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-sub">{sub}</div></div>}
