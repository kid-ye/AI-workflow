"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { Globe } from "lucide-react";

const navLinks = [
  { label: "Agents", href: "/agents" },
  { label: "Resources", href: "/resources" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 lg:px-24 py-6 w-full max-w-[1500px] mx-auto bg-transparent">
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center gap-10">
        <Link
          href="/"
          className="flex items-center font-bold text-xl tracking-tight text-zinc-950"
        >
          <span className="font-bold mr-[1px]">II</span>Revdau
        </Link>
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-[15px] font-medium text-zinc-800 hover:text-black transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Right: CTA Buttons */}
      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <div className="hidden md:flex items-center text-[15px] font-medium text-zinc-600 transition-colors mr-2 cursor-pointer group rounded-full px-3 py-1.5 hover:bg-zinc-100/80">
          <Globe
            strokeWidth={2}
            className="w-4 h-4 mr-2 text-zinc-500 group-hover:text-zinc-800 transition-colors"
          />
          <select className="bg-transparent outline-none cursor-pointer text-zinc-700 hover:text-zinc-950 appearance-none font-sans font-medium focus:ring-0">
            <option value="en">English</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>

        {session ? (
          <>
            <div className="flex items-center gap-3 mr-2">
              <span className="text-sm font-medium text-zinc-700">
                {session.user?.name || session.user?.email}
              </span>
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
              )}
            </div>
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="rounded-full px-5 h-10 text-[15px] border-zinc-200 text-zinc-950 hover:bg-zinc-50 font-normal"
            >
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              variant="outline"
              className="rounded-full px-5 h-10 text-[15px] border-zinc-200 text-zinc-950 hover:bg-zinc-50 font-normal"
            >
              Log in
            </Button>
            <Button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="rounded-full px-5 h-10 text-[15px] bg-black text-white hover:bg-zinc-800 font-medium"
            >
              Sign up
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
