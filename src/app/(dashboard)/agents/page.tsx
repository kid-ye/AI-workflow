"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Search,
  Plus,
  MoreHorizontal,
  ArrowDown,
  ArrowRight,
  X,
  Headset,
  Building2,
  PhoneOutgoing,
} from "lucide-react";

type Agent = {
  id: number;
  name: string;
  createdBy: string;
  createdAt: string;
};

const INITIAL_AGENTS: Agent[] = [];

const PERSONAS = [
  {
    icon: Headset,
    title: "Customer Support",
    desc: "Field support inquiries with empathy and precision",
  },
  {
    icon: Building2,
    title: "Front Desk",
    desc: "Handle transfers and general inquiries professionally",
  },
  {
    icon: PhoneOutgoing,
    title: "Sales Rep",
    desc: "Conduct outbound calls and book qualified meetings",
  },
];

export default function AgentsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [search, setSearch] = useState("");
  const [showBanner, setShowBanner] = useState(true);

  React.useEffect(() => {
    const saved = localStorage.getItem("agents");
    setAgents(saved ? JSON.parse(saved) : INITIAL_AGENTS);
  }, []);

  const filtered = agents.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-[1200px] mx-auto px-16 py-20">
      {/* Header */}
      <div className="flex items-end justify-between mb-20 border-b border-border pb-8">
        <div>
          <h1 className="text-7xl font-semibold tracking-tighter leading-none text-foreground mb-2">
            Agents
          </h1>
          <p className="text-base text-muted-foreground tracking-tight">
            Manage your AI call agents
          </p>
        </div>
        <div className="flex gap-4">
          <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors tracking-tight">
            Browse personas
          </button>
          <button
            onClick={() => router.push("/agents/new")}
            className="group relative inline-flex items-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider py-3 transition-all active:translate-y-px"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            New Agent
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent scale-x-100 group-hover:scale-x-110 transition-transform origin-left"></span>
          </button>
        </div>
      </div>

      {/* Persona Banner */}
      {showBanner && (
        <div className="bg-card border border-border p-12 relative mb-20">
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <h2 className="text-3xl font-semibold tracking-tighter mb-3 text-foreground">
            Begin with a persona
          </h2>
          <p className="text-base text-muted-foreground mb-8 tracking-tight leading-relaxed max-w-2xl">
            Pre-configured agent templates to accelerate your workflow
          </p>

          <div className="grid grid-cols-3 gap-6 mb-8">
            {PERSONAS.map((p) => (
              <button
                key={p.title}
                onClick={() => router.push("/agents/new")}
                className="bg-muted border border-border p-8 text-left flex flex-col gap-4 hover:border-accent transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-foreground p-3 bg-background rounded-lg border border-border group-hover:border-accent transition-colors">
                    <p.icon className="w-6 h-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    {p.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed tracking-tight group-hover:text-foreground transition-colors">
                  {p.desc}
                </p>
              </button>
            ))}
          </div>

          <button className="group inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-foreground transition-colors uppercase tracking-wider">
            Browse all personas
            <ArrowRight
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              strokeWidth={2}
            />
          </button>
        </div>
      )}

      {/* Search */}
      <div className="mb-12">
        <div className="relative mb-6">
          <Search
            className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.5}
          />
          <input
            type="text"
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-input border border-border outline-none focus:border-accent placeholder:text-muted-foreground text-base text-foreground transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <button className="text-xs font-mono uppercase tracking-widest border border-border bg-muted px-4 py-2 flex items-center gap-2 hover:border-accent text-muted-foreground hover:text-foreground transition-colors">
            <Plus className="w-3 h-3" strokeWidth={2} /> Creator
          </button>
          <button className="text-xs font-mono uppercase tracking-widest border border-border bg-muted px-4 py-2 flex items-center gap-2 hover:border-accent text-muted-foreground hover:text-foreground transition-colors">
            <Plus className="w-3 h-3" strokeWidth={2} /> Archived
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full border-t border-border">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="py-4 font-mono text-xs uppercase tracking-widest text-muted-foreground w-[40%]">
                Name
              </th>
              <th className="py-4 font-mono text-xs uppercase tracking-widest text-muted-foreground w-[30%]">
                Created by
              </th>
              <th className="py-4 font-mono text-xs uppercase tracking-widest text-muted-foreground w-[25%]">
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors w-min whitespace-nowrap">
                  Created at <ArrowDown className="w-3 h-3" strokeWidth={2} />
                </div>
              </th>
              <th className="py-4 w-[5%]"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-20 text-center text-muted-foreground text-base tracking-tight"
                >
                  No agents found.
                </td>
              </tr>
            )}
            {filtered.map((agent) => (
              <tr
                key={agent.id}
                className="border-b border-border hover:bg-muted transition-colors group cursor-pointer"
              >
                <td className="py-5 font-semibold text-foreground text-lg tracking-tight">
                  {agent.name}
                </td>
                <td className="py-5 text-base text-muted-foreground tracking-tight">
                  {agent.createdBy}
                </td>
                <td className="py-5 text-base text-muted-foreground tracking-tight font-mono text-sm">
                  {agent.createdAt}
                </td>
                <td className="py-5 text-right">
                  <button className="text-muted-foreground hover:text-accent opacity-0 group-hover:opacity-100 transition-all p-1.5">
                    <MoreHorizontal className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
