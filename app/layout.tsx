import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
export const metadata = { title: "RealEstate CRM", description: "Real estate lead management CRM" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><div className="shell"><Sidebar /><main className="main">{children}</main><MobileNav /></div></body></html>;
}
