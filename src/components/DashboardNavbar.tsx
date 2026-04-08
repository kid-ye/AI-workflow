"use client";
import { Search, Bell, Grid } from "lucide-react";

export default function DashboardNavbar() {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 flex items-center justify-between px-8 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" strokeWidth={1.5} />
          <input 
            className="w-full bg-input border border-border py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent placeholder:text-muted-foreground text-foreground transition-colors rounded-lg" 
            placeholder="Search agents, workflows..." 
            type="text" 
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-muted-foreground">
          <button className="hover:text-accent transition-colors relative">
            <Bell className="w-5 h-5" strokeWidth={1.5} />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-accent border border-background"></span>
          </button>
          <button className="hover:text-accent transition-colors">
            <Grid className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="h-6 w-px bg-border"></div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-foreground tracking-tight">Alex Rivera</span>
          <div className="w-8 h-8 border border-border rounded-md">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkmKtfwmLwbcWdLR_iPqSRzkQg6WJq-QdMOzwSFuyNMAmTE2EqCZ3ZvYeaDeR5YDXuAPgIwfZgkNAD15fv_QMkvUGap3WcA0nIzkkLZtPQRFHKEOUfUlRFleOLcV99Xjyj02Gp5BnQMesHkYn4ZSbxBeuMSdpDAgLW2jrlprRVbyerPtl5bTBJO4t1RplndQeuOy5Wy1XynluyZwxEWiHGcO-OB7Tl9l4_rPsbjeS4z_669HFrvyi_Rs5NSM3rO4pYjEj4lyH2_mA" alt="Alex Rivera" />
          </div>
        </div>
      </div>
    </header>
  );
}
