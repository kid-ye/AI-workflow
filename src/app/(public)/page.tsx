import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, FlaskConical, Hand, Workflow } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 w-full max-w-[72rem] mx-auto px-6 py-28 md:px-12 lg:py-44">
        {/* Asymmetric Hero Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-16 items-center">
          {/* Left Column: Text Dominance */}
          <div className="flex flex-col items-start gap-8 z-10">
            {/* Section Badge */}
            <div className="inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent/5 px-5 py-2">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
                Next-Gen Platform
              </span>
            </div>

            <h1 className="font-heading text-[2.75rem] md:text-6xl lg:text-[5.25rem] leading-[1.05] tracking-[-0.02em] text-foreground">
              Bringing
              <br />
              technology to{" "}
              <span className="gradient-text font-bold">life</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[32rem] font-sans">
              Powering the best enterprises, creators, and developers. From
              ElevenAgents for customer experience, ElevenCreative for content
              creation, to the leading AI voice generator.
            </p>

            <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-4 pt-4">
              <Button size="lg" className="w-full sm:w-auto group">
                Start building for free
                <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Contact sales
              </Button>
            </div>
          </div>

          {/* Right Column: Abstract Interactive Visual */}
          <div className="relative hidden md:flex w-full aspect-square md:aspect-auto h-full min-h-[400px] flex-col items-center justify-center gap-12">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[80%] h-[80%] bg-accent opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />

            {/* The Textural Orb */}
            <div
              className="relative w-[340px] h-[340px] rounded-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] z-10 overflow-hidden"
              style={{
                background:
                  "radial-gradient(circle at 35% 25%, #E3FAFD 0%, #68B1DF 20%, #0B2136 60%, #466751 85%)",
                boxShadow:
                  "inset -20px -20px 60px rgba(0,0,0,0.6), inset 20px 20px 60px rgba(255,255,255,0.8)",
              }}
            >
              {/* Noise Texture Overlay */}
              <div
                className="absolute inset-0 w-full h-full opacity-40 mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />
            </div>

            {/* Orb Controls container */}
            <div className="flex items-center gap-4 z-10 w-full max-w-[400px]">
              {/* Phone Icon Button */}
              <button
                className="flex-shrink-0 w-16 h-16 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200"
                aria-label="Call Agent"
              >
                <Phone className="w-6 h-6 text-black fill-black" />
              </button>

              {/* Message Faux-Input Field */}
              <div className="flex-1 h-16 rounded-full bg-white shadow-lg border border-slate-100 flex items-center px-6 cursor-text hover:border-slate-200 transition-colors">
                <span className="text-[#94a3b8] font-sans text-[1.05rem]">
                  Or type a message...
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* New Bento Features Section */}
      <section className="w-full max-w-[72rem] mx-auto px-6 md:px-12 py-24 flex flex-col gap-12 md:gap-16">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="flex flex-col gap-3 max-w-xl">
            <span className="font-semibold text-sm text-muted-foreground tracking-wide">
              ElevenAgents
            </span>
            <h2 className="font-heading text-[2.5rem] md:text-5xl leading-[1.1] text-foreground tracking-tight">
              Deploy agents that talk,
              <br className="hidden md:block" /> type, and take action
            </h2>
            <Button
              className="w-fit mt-4 bg-foreground hover:bg-zinc-800 text-background rounded-full px-6 transition-smooth"
              size="lg"
            >
              Learn more
            </Button>
          </div>
          <p className="text-lg md:text-[1.15rem] text-foreground max-w-[28rem] leading-[1.6] font-medium pt-2">
            Configure, deploy and monitor natural, human-sounding agents in 70+
            languages with leading accuracy and ultra-low latency across voice
            or chat.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="flex flex-col gap-6">
          {/* Top Row: 2 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Omnichannel */}
            <div className="relative overflow-hidden rounded-[2rem] border border-border h-[450px] p-8 flex flex-col justify-end">
              {/* Background gradient/noise */}
              <div
                className="absolute inset-0 saturate-150 mix-blend-multiply opacity-90"
                style={{
                  background:
                    "radial-gradient(circle at 0% 100%, #204A3B 0%, transparent 60%), radial-gradient(circle at 100% 0%, #D4A373 0%, transparent 50%), radial-gradient(circle at 100% 100%, #1a365d 0%, transparent 60%), #407D5C",
                }}
              />
              <div
                className="absolute inset-0 mix-blend-overlay opacity-30"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
              />

              <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0" />

              {/* Chat Mockup */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[85%] flex flex-col gap-4 text-[0.8rem] md:text-[0.85rem] font-medium z-10 font-sans">
                <div className="self-end bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-2.5 rounded-2xl rounded-tr-sm">
                  Can I get a refund?
                </div>
                <div className="self-start bg-white text-zinc-950 px-4 py-2.5 rounded-2xl rounded-tl-sm w-[80%] shadow-lg">
                  Sure. Can you share your order number please?
                </div>
                <div className="self-end bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-2.5 rounded-2xl rounded-tr-sm">
                  It's EL4543490
                </div>
                <div className="self-start bg-white text-zinc-950 px-4 py-3 rounded-2xl rounded-tl-sm w-[85%] shadow-lg">
                  Thank you. I have initiated the order refund process.
                  <div className="mt-3 flex items-center justify-center gap-2 bg-zinc-50/80 rounded-xl py-2 px-3 border border-zinc-100">
                    <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      S
                    </div>
                    <span className="text-zinc-700 font-semibold text-xs leading-none">
                      Refund completed
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Text */}
              <div className="relative z-10 mt-auto pt-6 text-white font-sans">
                <h3 className="font-semibold text-lg mb-1 leading-snug">
                  Omnichannel agents
                </h3>
                <p className="text-white/80 font-medium text-sm leading-relaxed max-w-sm">
                  Agents listen, read and interact just like humans would across
                  phone, chat, email and WhatsApp.
                </p>
              </div>
            </div>

            {/* Card 2: Analytics */}
            <div className="rounded-[2rem] bg-[#F7F7F7] border border-border h-[450px] p-8 flex flex-col font-sans">
              <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100/60 p-6 flex-1 mb-8 flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-[0.7rem] font-bold text-zinc-600 mb-1">
                      Success rate
                    </h4>
                    <div className="text-[1.35rem] leading-none font-medium text-zinc-900 tracking-tight">
                      61.5%
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 text-[0.65rem] font-bold font-mono tracking-tighter">
                    <div className="flex items-center gap-1.5 justify-end">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></div>
                      <span className="text-slate-800">85.32%</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] shrink-0"></div>
                      <span className="text-slate-800">62.49%</span>
                    </div>
                  </div>
                </div>

                {/* Faux Chart */}
                <div className="relative flex-1 w-full bg-white flex flex-col justify-between">
                  {/* Grid lines */}
                  <div className="flex-1 border-b border-slate-100 flex items-start text-[0.65rem] text-slate-400 font-medium">
                    <span className="-mt-1.5">100%</span>
                  </div>
                  <div className="flex-1 border-b border-slate-100 flex items-center text-[0.65rem] text-slate-400 font-medium whitespace-nowrap">
                    <span className="-mt-0">50%</span>
                  </div>
                  <div className="flex-1 border-b border-slate-300 flex items-end pb-1 text-[0.65rem] text-slate-400 font-medium">
                    <span className="mb-0">0%</span>
                  </div>

                  {/* Vertical highlight line */}
                  <div className="absolute right-[15%] top-0 bottom-0 w-px bg-slate-200 z-0"></div>

                  <svg
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                    style={{ overflow: "visible" }}
                  >
                    <path
                      d="M0,45 Q15,40 30,42 T60,40 T85,38 Q95,35 100,42"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M0,55 Q15,50 30,58 T60,52 T85,55 Q95,50 100,56"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Dots on line highlight */}
                    <circle cx="85" cy="38" r="1.5" fill="#f97316" />
                    <circle cx="85" cy="55" r="1.5" fill="#3b82f6" />
                  </svg>
                </div>

                <div className="flex justify-between text-[0.65rem] text-slate-500 font-medium mt-2">
                  <span>17 Aug</span>
                  <span>24 Aug</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-zinc-950 mb-1 leading-snug">
                  Analytics
                </h3>
                <p className="text-zinc-600 font-medium text-[0.95rem] leading-relaxed">
                  Easily measure success rates and CX metrics, optimizing flows
                  over time.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Row: 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testing */}
            <div className="rounded-[1.5rem] bg-[#F7F7F7] border border-border p-8 flex flex-col items-start font-sans">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-10 shadow-sm">
                <FlaskConical
                  className="w-5 h-5 text-zinc-700"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="font-semibold text-zinc-950 mb-1.5 text-[1.05rem]">
                Testing
              </h3>
              <p className="text-zinc-600 font-medium text-[0.95rem] leading-relaxed">
                Simulate real-world conversations to validate agents behave as
                expected before deployment.
              </p>
            </div>

            {/* Guardrails */}
            <div className="rounded-[1.5rem] bg-[#F7F7F7] border border-border p-8 flex flex-col items-start font-sans">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-10 shadow-sm">
                <Hand className="w-5 h-5 text-zinc-700" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-zinc-950 mb-1.5 text-[1.05rem]">
                Guardrails
              </h3>
              <p className="text-zinc-600 font-medium text-[0.95rem] leading-relaxed">
                Establish clear behavioral and compliance rules that keep agent
                responses aligned with policy.
              </p>
            </div>

            {/* Workflows */}
            <div className="rounded-[1.5rem] bg-[#F7F7F7] border border-border p-8 flex flex-col items-start font-sans">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-10 shadow-sm">
                <Workflow className="w-5 h-5 text-zinc-700" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-zinc-950 mb-1.5 text-[1.05rem]">
                Workflows
              </h3>
              <p className="text-zinc-600 font-medium text-[0.95rem] leading-relaxed">
                Handle complex conversation flows, apply business logic and
                connect securely to systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inverted Section Contrast Example */}
      <section className="bg-foreground text-background py-28 relative overflow-hidden">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-[72rem] mx-auto px-6 md:px-12 relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col gap-6 w-full md:w-1/2">
            <h2 className="font-heading text-4xl md:text-5xl leading-tight">
              Metrics that matter.
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed font-sans max-w-md">
              Restraint in element count. Bold choices in execution.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 w-full md:w-1/2">
            <div className="flex flex-col gap-2">
              <span className="font-heading text-5xl text-white">99%</span>
              <span className="font-mono text-sm tracking-widest text-[#4D7CFF] uppercase">
                Uptime
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-heading text-5xl text-white">2.5s</span>
              <span className="font-mono text-sm tracking-widest text-[#4D7CFF] uppercase">
                Generation
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
