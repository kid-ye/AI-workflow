"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  GitBranch,
  Mic,
  Database,
  Phone,
  FileText,
  Settings,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen z-40 bg-muted w-64 flex flex-col border-r border-border">
        <Link
          href="/"
          className="group block p-6 border-b border-border hover:bg-background/50 transition-colors"
        >
          <h1 className="text-2xl font-semibold tracking-tighter text-foreground group-hover:text-accent transition-colors">
            Revoice Labs
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mt-1 group-hover:text-foreground transition-colors">
            ARCHITECT
          </p>
        </Link>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${pathname === "/dashboard" ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
          >
            <LayoutDashboard className="w-4 h-4" strokeWidth={1.5} />
            <span className="tracking-tight">Dashboard</span>
          </Link>
          <Link
            href="/agents"
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${pathname?.startsWith("/agents") ? "text-accent border-l-2 border-accent pl-[10px]" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Bot className="w-4 h-4" strokeWidth={1.5} />
            <span className="tracking-tight">Agents</span>
          </Link>
          <Link
            href="/workflow"
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${pathname === "/workflow" ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
          >
            <GitBranch className="w-4 h-4" strokeWidth={1.5} />
            <span className="tracking-tight">Workflows</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mic className="w-4 h-4" strokeWidth={1.5} />
            <span className="tracking-tight">Voices</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Database className="w-4 h-4" strokeWidth={1.5} />
            <span className="tracking-tight">Data Sources</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Phone className="w-4 h-4" strokeWidth={1.5} />
            <span className="tracking-tight">Telephony</span>
          </Link>
          <Link
            href="/logs"
            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${pathname === "/logs" ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
          >
            <FileText className="w-4 h-4" strokeWidth={1.5} />
            <span className="tracking-tight">Logs</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings className="w-4 h-4" strokeWidth={1.5} />
            <span className="tracking-tight">Settings</span>
          </Link>

          <div className="pt-4 mt-6 border-t border-border/50">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                strokeWidth={1.5}
              />
              <span className="tracking-tight">Return to Site</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 mt-auto border-t border-border">
          <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
            <div className="w-8 h-8 bg-muted flex items-center justify-center overflow-hidden rounded-md"></div>
            <ChevronDown
              className="w-4 h-4 text-muted-foreground"
              strokeWidth={1.5}
            />
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
