import { useState } from "react";
import { Menu, X, CheckCircle, ArrowRight, Zap, Shield, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NAV_LINKS = [
  { label: "How it Works", id: "how-it-works" },
  { label: "Features", id: "features" },
  { label: "Demo", id: "demo" },
  { label: "Team", id: "team" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="30" height="30" rx="7" fill="#090909" />
        <circle cx="9" cy="15" r="5" stroke="#E8F000" strokeWidth="2.2" fill="none" />
        <line x1="14.2" y1="12.5" x2="15.8" y2="12.5" stroke="#E8F000" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="14.2" y1="17.5" x2="15.8" y2="17.5" stroke="#E8F000" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="21" cy="15" r="5.5" fill="#E8F000" />
        <circle cx="21" cy="15" r="2.4" fill="#090909" />
      </svg>
      <span className="font-bold text-foreground text-[15px] tracking-tight">OnchainCreator</span>
    </div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <a href="/" aria-label="OnchainCreator home">
            <Logo />
          </a>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => scrollTo(l.id)}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-white/5 transition-colors"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollTo("waitlist")}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-full hover:opacity-90 active:scale-[0.97] transition-all"
            >
              Join Waitlist
            </button>
            <button
              type="button"
              className="md:hidden w-10 h-10 flex items-center justify-center text-foreground rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-40 bg-background flex flex-col pt-14">
          <div className="flex flex-col px-4 pt-4 pb-8 overflow-y-auto flex-1">
            <div className="flex flex-col">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    scrollTo(l.id);
                    setOpen(false);
                  }}
                  className="w-full text-left py-4 text-lg font-medium text-foreground border-b border-border/40 hover:text-primary transition-colors"
                >
                  {l.label}
                </button>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  scrollTo("waitlist");
                  setOpen(false);
                }}
                className="w-full py-4 text-base font-semibold bg-primary text-primary-foreground rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function WaitlistForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"creator" | "project">("creator");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSuccess(true);
        toast({ title: "You're on the waitlist!", description: "We'll reach out when your spot opens." });
      } else {
        toast({ title: "Couldn't connect to server", description: "Please try again shortly.", variant: "destructive" });
      }
    } catch {
      setSuccess(true);
      toast({ title: "You're on the waitlist!", description: "We'll reach out when your spot opens." });
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-primary" />
        </div>
        <p className="text-lg font-semibold text-foreground">You're in!</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          We'll notify you when your spot opens. Welcome to the network.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 max-w-sm">
      <div className="flex gap-1 p-1 bg-card border border-border rounded-xl self-start">
        {(["creator", "project"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
              role === r
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {r === "creator" ? "I'm a Creator" : "I'm a Project"}
          </button>
        ))}
      </div>

      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-3.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Joining…" : "Join as " + (role === "creator" ? "Creator" : "Project")}
      </button>

      <p className="text-xs text-muted-foreground">
        Free to join · 1,200+ creators already signed up
      </p>
    </form>
  );
}

const STATS = [
  { value: "1.2K+", label: "Creators" },
  { value: "140+", label: "Projects" },
  { value: "$1.2M", label: "Paid Out" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create your profile",
    desc: "Sign up as a creator or a Web3 project. Get verified and show your onchain track record.",
    icon: <Users className="w-5 h-5" />,
  },
  {
    step: "02",
    title: "Find campaigns",
    desc: "Browse campaigns from top onchain projects. Filter by chain, budget, and content format.",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    step: "03",
    title: "Get paid onchain",
    desc: "Complete campaigns and receive payment directly to your wallet. No middlemen, no delays.",
    icon: <Shield className="w-5 h-5" />,
  },
];

const FEATURES = [
  { title: "Onchain Verification", desc: "Your reputation is tied to your wallet. No fake metrics, no fraud." },
  { title: "Multi-chain Support", desc: "Solana, Ethereum, Base, Arbitrum and more. Work across any ecosystem." },
  { title: "Instant Payments", desc: "Get paid in USDC or native tokens directly to your wallet after approval." },
  { title: "Transparent Campaigns", desc: "All campaign terms, budgets, and deliverables visible on the platform." },
  { title: "Creator Analytics", desc: "Track your reach, engagement, and earnings across all campaigns in one dashboard." },
  { title: "Project Discovery", desc: "Projects get matched with creators who have the right audience and credibility." },
];

const CHAINS = [
  { name: "Solana", color: "#9945FF" },
  { name: "Ethereum", color: "#627EEA" },
  { name: "Base", color: "#0052FF" },
  { name: "Arbitrum", color: "#28A0F0" },
  { name: "Polygon", color: "#8247E5" },
  { name: "BNB Chain", color: "#F0B90B" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #E8F000 0%, transparent 65%)" }}
        />

        <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-8">
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                Open Beta · Solana-First Creator Marketplace
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-5">
              <span className="block">Get Paid to</span>
              <span className="block text-primary">Create Web3</span>
              <span className="block text-foreground/25">Content.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Web3 projects need reach. You have it. Find paid campaigns, pitch your
              angle, collect in USD — no agencies, no middlemen, no 45-day payment cycles.
            </p>

            <div id="waitlist" className="scroll-mt-20">
              <WaitlistForm />
            </div>
          </div>

          <div className="lg:pt-8 lg:w-72 xl:w-80 shrink-0">
            <div className="grid grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
              {STATS.map((s) => (
                <div key={s.label} className="bg-card flex flex-col items-center justify-center py-6 px-2">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                    {s.value}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-card border border-border rounded-2xl p-5">
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-mono">Supported Chains</p>
              <div className="flex flex-wrap gap-2">
                {CHAINS.map((c) => (
                  <div key={c.name} className="flex items-center gap-1.5 bg-background border border-border rounded-full px-2.5 py-1">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                    <span className="text-xs font-medium text-foreground">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="scroll-mt-14 py-20 sm:py-28 px-4 sm:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16">
            <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">How it Works</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight max-w-xl">
              Get paid for creating.{" "}
              <span className="text-foreground/30">Simple as that.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="bg-card p-7 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    {item.icon}
                  </div>
                  <span className="text-4xl font-black text-foreground/[0.06] select-none">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-14 py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16">
            <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Platform Features</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight max-w-xl">
              Built for the{" "}
              <span className="text-foreground/30">onchain economy.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-card p-7">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mb-5" />
                <h3 className="text-sm font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="scroll-mt-14 py-20 sm:py-28 px-4 sm:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center gap-10">
            <div className="flex-1">
              <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Live Demo</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
                See the platform<br />in action.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
                Watch how a creator discovers a campaign, submits their content, and gets paid — all in under 5 minutes.
              </p>
              <button
                type="button"
                onClick={() => scrollTo("waitlist")}
                className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Get Early Access <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="lg:w-72 xl:w-80 shrink-0 bg-background border border-border rounded-2xl aspect-video flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-center px-4">
                <div className="w-14 h-14 rounded-full border-2 border-primary/50 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[7px] border-b-[7px] border-l-[12px] border-transparent border-l-primary ml-1" />
                </div>
                <p className="text-sm text-muted-foreground">Demo coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="scroll-mt-14 py-20 sm:py-28 px-4 sm:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Team</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Built by builders.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">OC</span>
              </div>
              <div>
                <p className="text-sm font-semibold">OnchainCreator Team</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Building the future of creator monetization on Web3.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            Ready to get paid<br />
            <span className="text-foreground/25">for your content?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Join 1,200+ creators already building their Web3 audience and earning from campaigns.
          </p>
          <button
            type="button"
            onClick={() => scrollTo("waitlist")}
            className="inline-flex items-center gap-2 bg-foreground text-background font-semibold px-8 py-4 rounded-full text-base hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Join the Waitlist <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <Logo />
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => scrollTo(l.id)}
                className="hover:text-foreground transition-colors"
              >
                {l.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">© 2026 OnchainCreator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
