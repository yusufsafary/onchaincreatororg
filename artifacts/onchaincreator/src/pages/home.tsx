import { useState, useEffect, useRef } from "react";
import { ArrowRight, Menu, X, CheckCircle, Zap, Shield, Users, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CHAINS = ["Solana", "Ethereum", "Base", "Arbitrum", "Polygon", "BNB Chain"];

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <rect width="30" height="30" rx="7" fill="#090909"/>
        <circle cx="9" cy="15" r="5" stroke="#E8F000" strokeWidth="2.2" fill="none"/>
        <line x1="14.2" y1="12.5" x2="15.8" y2="12.5" stroke="#E8F000" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="14.2" y1="17.5" x2="15.8" y2="17.5" stroke="#E8F000" strokeWidth="2.2" strokeLinecap="round"/>
        <circle cx="21" cy="15" r="5.5" fill="#E8F000"/>
        <circle cx="21" cy="15" r="2.4" fill="#090909"/>
      </svg>
      <span className="font-bold text-foreground text-[15px] tracking-tight">OnchainCreator</span>
    </div>
  );
}

const NAV_LINKS = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Campaigns", href: "#campaigns" },
  { label: "Demo", href: "#demo" },
  { label: "Team", href: "#team" },
  { label: "Blog", href: "#" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <a href="/" aria-label="OnchainCreator home">
            <Logo />
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
            <div className="ml-1 flex items-center gap-1 px-3 py-1.5 rounded-md border border-border/60 text-sm text-muted-foreground cursor-default">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: "#9945FF" }} />
              <span className="text-foreground font-medium">Solana</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-0.5 border border-border rounded-full px-2 py-1">
              <button className="px-2 py-0.5 text-xs font-semibold text-foreground rounded-full bg-white/10">EN</button>
              <button className="px-2 py-0.5 text-xs font-medium text-muted-foreground rounded-full hover:bg-white/5">JP</button>
            </div>
            <button className="px-4 py-1.5 text-sm font-medium text-foreground hover:bg-white/5 rounded-full transition-colors">
              Log In
            </button>
            <a href="#waitlist">
              <button className="px-4 py-1.5 text-sm font-semibold bg-foreground text-background rounded-full hover:opacity-90 transition-opacity">
                Get Started
              </button>
            </a>
          </div>

          <button
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-background/98 backdrop-blur-sm flex flex-col pt-16 px-6 pb-8 overflow-y-auto">
          <div className="flex flex-col gap-1 mt-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="py-3 text-lg font-medium text-foreground border-b border-border/40 hover:text-primary transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <div className="flex items-center gap-1 self-start border border-border rounded-full px-2 py-1">
              <button className="px-2 py-0.5 text-xs font-semibold text-foreground rounded-full bg-white/10">EN</button>
              <button className="px-2 py-0.5 text-xs font-medium text-muted-foreground rounded-full hover:bg-white/5">JP</button>
            </div>
            <button className="w-full py-3 text-base font-medium text-foreground border border-border rounded-xl hover:bg-white/5 transition-colors">
              Log In
            </button>
            <a href="#waitlist" onClick={() => setMenuOpen(false)}>
              <button className="w-full py-3 text-base font-semibold bg-foreground text-background rounded-xl hover:opacity-90 transition-opacity">
                Get Started
              </button>
            </a>
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
  const [handle, setHandle] = useState("");
  const [chain, setChain] = useState("Solana");
  const [showAdvanced, setShowAdvanced] = useState(false);
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
        body: JSON.stringify({ email: email.trim(), role, handle: handle.trim() || null, chain }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        toast({ title: data.message || "You're on the waitlist!", description: "We'll reach out soon." });
      } else {
        toast({ title: "Something went wrong", description: data.error || "Please try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Connection error", description: "Please check your internet and try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-primary" />
        </div>
        <p className="text-lg font-semibold text-foreground">You're in!</p>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          We'll notify you when your spot opens. Welcome to the network.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 max-w-sm mx-auto sm:mx-0">
      <div className="flex gap-1 p-1 bg-card border border-border rounded-lg self-start">
        {(["creator", "project"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${
              role === r ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {r === "creator" ? "Creator" : "Project"}
          </button>
        ))}
      </div>

      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
      />

      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors self-start"
      >
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
        {showAdvanced ? "Less options" : "Add handle & chain"}
      </button>

      {showAdvanced && (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@yourhandle (optional)"
            className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <select
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            className="w-full bg-card border border-border text-foreground rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
          >
            {CHAINS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-foreground text-background font-semibold text-sm rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Joining..." : "Join Waitlist"}
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
  { title: "Instant Payments", desc: "Get paid in USDC or native tokens directly to your wallet after campaign approval." },
  { title: "Transparent Campaigns", desc: "All campaign terms, budgets, and deliverables visible on the platform." },
  { title: "Creator Analytics", desc: "Track your reach, engagement, and earnings across all campaigns in one dashboard." },
  { title: "Project Discovery", desc: "Projects get matched with creators who have the right audience and credibility." },
];

const CHAINS_LOGOS = [
  { name: "Solana", color: "#9945FF" },
  { name: "Ethereum", color: "#627EEA" },
  { name: "Base", color: "#0052FF" },
  { name: "Arbitrum", color: "#28A0F0" },
  { name: "Polygon", color: "#8247E5" },
  { name: "BNB Chain", color: "#F0B90B" },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section ref={heroRef} className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #E8F000 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-8">
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
                Open Beta V0.1 — Web3 Creator Marketplace
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-4">
              <span className="text-foreground block">Where Creators</span>
              <span className="text-foreground/25 block">Meet Projects.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              The marketplace connecting Web3 content creators with onchain projects.
              Find campaigns, get verified, get paid.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <a href="#campaigns">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-foreground text-background font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 active:scale-[0.98] transition-all">
                  Browse Campaigns <ArrowRight className="w-4 h-4" />
                </button>
              </a>
              <a href="#how-it-works">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-border text-foreground font-medium px-6 py-3 rounded-full text-sm hover:bg-white/5 active:scale-[0.98] transition-all">
                  How it Works
                </button>
              </a>
            </div>

            <div id="waitlist">
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
                {CHAINS_LOGOS.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center gap-1.5 bg-background border border-border rounded-full px-2.5 py-1"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    <span className="text-xs font-medium text-foreground">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16">
            <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">How it Works</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground max-w-xl">
              Get paid for creating.<br />
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
                  <span className="text-4xl font-black text-foreground/8 select-none">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="campaigns" className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16">
            <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Platform Features</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground max-w-xl">
              Built for the<br />
              <span className="text-foreground/30">onchain economy.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-card p-7">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mb-5" />
                <h3 className="text-sm font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo section */}
      <section id="demo" className="py-20 sm:py-28 px-4 sm:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row lg:items-center gap-10">
            <div className="flex-1">
              <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Live Demo</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-4">
                See the platform<br />in action.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
                Watch how a creator discovers a campaign, submits their content, and gets paid — all in under 5 minutes.
              </p>
              <button className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 active:scale-[0.98] transition-all">
                Watch Demo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="lg:w-72 xl:w-80 shrink-0 bg-background border border-border rounded-2xl aspect-video flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-center px-4">
                <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-transparent border-l-primary ml-0.5" />
                </div>
                <p className="text-xs text-muted-foreground">Demo coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-20 sm:py-28 px-4 sm:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Team</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Built by builders.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "OnchainCreator Team", role: "Building the future of creator monetization on Web3.", initials: "OC" },
            ].map((m) => (
              <div key={m.name} className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{m.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground mb-4">
            Ready to get paid<br />
            <span className="text-foreground/25">for your content?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Join 1,200+ creators already building their Web3 audience and earning from campaigns.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#waitlist">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-foreground text-background font-semibold px-8 py-4 rounded-full text-base hover:opacity-90 active:scale-[0.98] transition-all">
                Join the Waitlist <ArrowRight className="w-5 h-5" />
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <Logo />
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
            <a href="#campaigns" className="hover:text-foreground transition-colors">Campaigns</a>
            <a href="#demo" className="hover:text-foreground transition-colors">Demo</a>
            <a href="#team" className="hover:text-foreground transition-colors">Team</a>
            <a href="#" className="hover:text-foreground transition-colors">Blog</a>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 OnchainCreator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
