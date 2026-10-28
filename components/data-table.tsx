import type { ReactNode } from "react";
export function DataTable({headers,children}:{headers:string[];children:ReactNode}) { return <div className="table-wrap"><table className="table"><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>; }
export function Badge({children,tone="default"}:{children:ReactNode;tone?:string}) { return <span className={`badge ${tone}`}>{children}</span>; }
