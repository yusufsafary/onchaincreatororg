import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5">
          <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">404</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
          Page not found
        </h1>
        <p className="text-muted-foreground text-base mb-8 leading-relaxed">
          This page doesn't exist or has been moved.
        </p>
        <Link href="/">
          <button className="inline-flex items-center gap-2 bg-foreground text-background font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
