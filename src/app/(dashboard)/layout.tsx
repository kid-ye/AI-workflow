"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Bot, GitBranch, Mic, Database, Phone, FileText, Settings, ChevronDown } from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen z-40 bg-muted w-64 flex flex-col border-r border-border">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-semibold tracking-tighter text-foreground">AUDITORY</h1>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mt-1">ARCHITECT</p>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`}>
            <LayoutDashboard className="w-4 h-4" strokeWidth={1.5} />
            <span className="tracking-tight">Dashboard</span>
          </Link>
          <Link href="/agents" className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${pathname?.startsWith('/agents') ? 'text-accent border-l-2 border-accent pl-[10px]' : 'text-muted-foreground hover:text-foreground'}`}>
            <Bot className="w-4 h-4" strokeWidth={1.5} />
            <span className="tracking-tight">Agents</span>
          </Link>
          <Link href="/workflow" className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${pathname === '/workflow' ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`}>
            <GitBranch className="w-4 h-4" strokeWidth={1.5} />
            <span className="tracking-tight">Workflows</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Mic className="w-4 h-4" strokeWidth={1.5} />
            <span className="tracking-tight">Voices</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Database className="w-4 h-4" strokeWidth={1.5} />
            <span className="tracking-tight">Data Sources</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Phone className="w-4 h-4" strokeWidth={1.5} />
            <span className="tracking-tight">Telephony</span>
          </Link>
          <Link href="/logs" className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${pathname === '/logs' ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`}>
            <FileText className="w-4 h-4" strokeWidth={1.5} />
            <span className="tracking-tight">Logs</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-4 h-4" strokeWidth={1.5} />
            <span className="tracking-tight">Settings</span>
          </Link>
        </nav>

        <div className="p-4 mt-auto border-t border-border">
          <div className="flex items-center gap-3 p-3 bg-card">
            <div className="w-8 h-8 bg-muted flex items-center justify-center overflow-hidden">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyEvMqGoLzdL-88KJR4Vul3NGFW9LwcooUvN_nFFqBI16AjLYe2AuG66N06gQiwHonOPQhXDLvEbsSRo6aYL8ZHlPjOxbJPxwr3sT8_hHS9WuFA1HG5hg3rl7nuys7gYW0jfakNNB63ZM1MFJKb-Bq4GnWT1UOvrfXuR7W3cQVjpBTErpH3Px9qCcgkqnSDqjzudvIw8YVI0RfNBSoeU3tTqcYr-KUFPymFkLc52hSeKHCxBMJTYurP3GSqsLTTxeeWuqoGz-UEu4" alt="Nexus Org" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate tracking-tight">Nexus Org</p>
              <p className="text-[10px] text-muted-foreground truncate font-mono tracking-wide">ENTERPRISE</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
          </div>
        </div>
      </aside>

      {/* Top Navbar */}
      <DashboardNavbar />

      {/* Main Content Area */}
      <main className="ml-64 mt-16 min-h-[calc(100vh-4rem)] bg-background">
        {children}
      </main>
    </div>
  );
}
