"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, Key } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      // Use Next.js soft navigation since it's now a native React Page
      window.location.href = "/workflow";
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0b1326] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Logo/Brand Area */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] shadow-[0_0_40px_rgba(192,193,255,0.2)] flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-[#1000a9]" />
          </div>
          <h1 className="text-3xl font-bold text-[#dae2fd] tracking-tight">Access System</h1>
          <p className="text-[#c7c4d7] mt-2 font-medium">Auditory Architect Protocol</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-[#131b2e] rounded-3xl p-8 shadow-[0_20px_40px_-10px_rgba(7,0,108,0.12)]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#908fa0]">Admin ID</label>
                <input 
                  type="text" 
                  defaultValue="alex.rivera"
                  className="w-full h-12 bg-[#2d3449] text-[#dae2fd] border border-[#464554] rounded-xl px-4 focus:outline-none focus:border-[#c0c1ff] focus:ring-1 focus:ring-[#c0c1ff] transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#908fa0]">Passkey</label>
                <div className="relative">
                  <input 
                    type="password" 
                    defaultValue="••••••••••••"
                    className="w-full h-12 bg-[#2d3449] text-[#dae2fd] border border-[#464554] rounded-xl pl-10 pr-4 focus:outline-none focus:border-[#c0c1ff] focus:ring-1 focus:ring-[#c0c1ff] transition-all"
                    required
                  />
                  <Key className="w-4 h-4 text-[#908fa0] absolute left-4 top-4" />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#c0c1ff] to-[#8083ff] text-[#1000a9] hover:opacity-90 font-bold transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#1000a9] border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Initialize Session <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
