import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/60 bg-background/50 py-16 px-6 md:px-12 lg:px-24">
      <div className="mx-auto max-w-[72rem]">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center font-heading font-bold text-2xl tracking-tight text-foreground"
            >
              <span className="font-bold mr-[1px]">II</span>Revdau
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs font-sans">
              Powering the best enterprises, creators, and developers with
              next-generation AI agents. Deploy systems that talk, type, and
              take action.
            </p>
            <div className="flex gap-4 mt-2">
              <a
                href="#"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-zinc-200 hover:text-zinc-900 transition-colors"
              >
                <span className="font-bold text-sm">𝕏</span>
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-zinc-200 hover:text-zinc-900 transition-colors"
              >
                <span className="font-bold text-sm">in</span>
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-zinc-200 hover:text-zinc-900 transition-colors"
              >
                <span className="font-bold text-sm">git</span>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex flex-col gap-3 font-sans">
            <h4 className="font-semibold text-foreground text-sm mb-1">
              Product
            </h4>
            <Link
              href="/agents"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ElevenAgents
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Voice Generation
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Integrations
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </div>

          <div className="flex flex-col gap-3 font-sans">
            <h4 className="font-semibold text-foreground text-sm mb-1">
              Company
            </h4>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Careers
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </div>

          <div className="flex flex-col gap-3 font-sans">
            <h4 className="font-semibold text-foreground text-sm mb-1">
              Resources
            </h4>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              API Reference
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Community
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Status
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 font-sans text-xs text-muted-foreground">
          <p>© {currentYear} Revdau Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
