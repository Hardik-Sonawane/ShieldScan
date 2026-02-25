"use client";

import { useState, useEffect } from "react";
import { Shield, Lock, AlertTriangle, Eye, CheckCircle2, ChevronRight, ChevronDown, ArrowRight, Code, Download } from "lucide-react";

interface Issue {
  title: string;
  impact: string;
  difficulty: string;
  score_impact: number;
  category: string;
  fix_title: string;
  fix_snippet: string;
  details?: Record<string, unknown>;
}

interface ScanResult {
  id?: number;
  url: string;
  score: number;
  grade: string;
  issues: Issue[];
  ai_summary: string;
}
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isAuthConfirmed, setIsAuthConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("paid") === "true") {
        setIsPremium(true);
        const savedResult = localStorage.getItem("lastScanResult");
        if (savedResult) {
          const parsed = JSON.parse(savedResult);
          if (parsed.id) {
            setResult(parsed);
          }
        }
      }
    }
  }, []);

  const handleCheckout = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    window.location.href = `${apiUrl}/api/checkout?site=${encodeURIComponent(result?.url || "")}`;
  };

  const setExpanded = (i: number) => {
    if (expandedIssue === i) setExpandedIssue(null);
    else setExpandedIssue(i);
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    if (!isAuthConfirmed) {
      setError("Please confirm you have authorization to scan this domain.");
      return;
    }

    // basic url formatting
    let formattedUrl = url;
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }

    setIsScanning(true);
    setError("");
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: formattedUrl }),
      });

      if (!res.ok) {
        throw new Error("Failed to scan website.");
      }

      const data = await res.json();
      setResult(data);
      localStorage.setItem("lastScanResult", JSON.stringify(data));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred");
      }
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50 print:hidden">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">ShieldScan</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#trust" className="hover:text-white transition-colors">Trust Center</a>
          </nav>
          <div className="flex items-center gap-4 text-sm font-medium">
            <a href="/auth/login" className="text-slate-400 hover:text-white transition-colors">Log in</a>
            <a href="/auth/login" className="bg-white text-slate-950 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors inline-block text-center cursor-pointer">
              Get Started
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-32">
        {/* Hero Section */}
        <AnimatePresence mode="wait">
          {!result && !isScanning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Active Scanning Engine Live
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                See exactly how <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">hackers</span> see your website.
              </h1>
              <p className="text-xl text-slate-400 mb-12">
                Turn security from scary into fixable. Enter your domain to find critical vulnerabilities and get copy-paste fixes in minutes.
              </p>

              <form onSubmit={handleScan} className="max-w-2xl mx-auto print:hidden">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex items-center bg-slate-900 border border-white/10 p-2 rounded-2xl shadow-2xl z-10">
                    <Lock className="w-5 h-5 text-slate-500 ml-4 hidden sm:block" />
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full bg-transparent border-none text-white px-4 py-4 focus:outline-none focus:ring-0 text-lg placeholder:text-slate-600"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isScanning}
                      className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-2 disabled:opacity-50"
                    >
                      {isScanning ? "Scanning..." : "Scan Now"}
                      {!isScanning && <ArrowRight className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="mt-6 flex items-start sm:items-center justify-center gap-3 text-sm text-slate-400 text-left relative z-10">
                  <input
                    type="checkbox"
                    id="auth-check"
                    checked={isAuthConfirmed}
                    onChange={(e) => setIsAuthConfirmed(e.target.checked)}
                    className="mt-1 sm:mt-0 w-4 h-4 rounded border-white/20 bg-slate-900 text-emerald-500 outline-none accent-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="auth-check" className="cursor-pointer">
                    I confirm I have authorization to scan this domain and agree to the <a href="#terms" className="underline hover:text-white transition-colors">Terms of Service</a> & <a href="#privacy" className="underline hover:text-white transition-colors">Privacy Policy</a>.
                  </label>
                </div>
              </form>

              {error && (
                <div className="mt-6 text-rose-400 flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </motion.div>
          )}

          {/* Loading State */}
          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-32 text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin"></div>
                <Shield className="w-12 h-12 text-emerald-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Analyzing Target...</h2>
              <p className="text-slate-400">Checking SSL, headers, and AI specific attack surfaces.</p>
            </motion.div>
          )}

          {/* Scan Results */}
          {result && !isScanning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12 max-w-4xl mx-auto"
            >
              {/* Top Score Section */}
              <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 via-yellow-500 to-emerald-500"></div>

                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="shrink-0 flex flex-col items-center justify-center p-8 bg-slate-950 rounded-2xl border border-white/5 relative">
                    <div className={clsx(
                      "absolute inset-0 rounded-2xl blur-xl opacity-20",
                      result.score >= 80 ? "bg-emerald-500" : result.score >= 50 ? "bg-yellow-500" : "bg-rose-500"
                    )}></div>
                    <div className="text-center relative z-10 w-full">
                      <div className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Security Score</div>
                      <div className={clsx(
                        "text-7xl font-bold tracking-tighter",
                        result.score >= 80 ? "text-emerald-400" : result.score >= 50 ? "text-yellow-400" : "text-rose-400"
                      )}>
                        {result.score}<span className="text-3xl text-slate-600">/100</span>
                      </div>
                      <div className="mt-2 text-2xl font-black text-white/20">GRADE {result.grade}</div>
                    </div>

                    {isPremium && (
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/scans/${result.id}/pdf`}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-emerald-400 hover:text-white transition-colors border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 rounded-lg w-full print:hidden"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </a>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <Eye className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold">AI Executive Summary</h3>
                    </div>
                    <p className="text-lg text-slate-300 leading-relaxed border-l-2 border-slate-700 pl-4 py-1">
                      {result.ai_summary}
                    </p>

                    {/* Progress Gap Visual */}
                    {result.issues.length > 0 && (
                      <div className="mt-6 bg-slate-950/50 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-slate-400">{result.issues.length} Issues Found</span>
                          <span className="text-emerald-400 font-medium">Potential Score: 100</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex">
                          <div className={clsx(
                            "h-full rounded-full",
                            result.score >= 80 ? "bg-emerald-500" : result.score >= 50 ? "bg-yellow-500" : "bg-rose-500"
                          )} style={{ width: `${result.score}%` }}></div>
                          <div className="h-full bg-slate-700" style={{ width: `${100 - result.score}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Issues List */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Vulnerabilities Detected</h2>
                  <div className="text-sm text-slate-400">Found {result.issues.length} total issues</div>
                </div>

                {result.issues.length === 0 ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-emerald-300 mb-2">No critical issues found!</h3>
                    <p className="text-slate-400">Your perimeter is looking incredibly solid.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {result.issues.map((issue: Issue, i: number) => {
                      // Blur strategy applied to issues beyond the first 3
                      const isBlurred = i >= 3 && !isPremium;
                      const isExpanded = expandedIssue === i && !isBlurred;

                      return (
                        <div key={i} className="bg-slate-900 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-start gap-6">

                            <div className="flex-1 space-y-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                      {isBlurred ? (
                                        <span className="blur-sm select-none">Hidden Critical Issue Detected</span>
                                      ) : (
                                        issue.title
                                      )}
                                    </h3>
                                    <span className={clsx(
                                      "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                      issue.difficulty === "Easy" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                        issue.difficulty === "Medium" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                                          "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                    )}>
                                      {issue.difficulty} • Fix: {issue.difficulty === "Easy" ? "5m" : issue.difficulty === "Medium" ? "30m" : "Dev"}
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-400 font-mono">{issue.category}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="text-2xl font-bold text-rose-400">-{issue.score_impact}</div>
                                  <div className="text-xs text-slate-500 uppercase">Score Impact</div>
                                </div>
                              </div>

                              <div className="bg-slate-950 rounded-xl p-4 border border-white/5 relative">
                                {isBlurred ? (
                                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-xl">
                                    <button
                                      onClick={handleCheckout}
                                      className="bg-white text-slate-900 px-6 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
                                    >
                                      <Lock className="w-4 h-4" />
                                      Unlock Full Report
                                    </button>
                                  </div>
                                ) : null}
                                <div className={clsx("flex items-start gap-3", isBlurred && "blur-sm")}>
                                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-sm font-medium text-slate-300 mb-1">Business Impact</div>
                                    <p className="text-slate-400">{issue.impact}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Desktop Fix CTA */}
                            {!isBlurred && (
                              <div className="shrink-0 pt-2 flex md:flex-col items-center md:items-end justify-between md:justify-start w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/5 md:pl-6">
                                <button
                                  onClick={() => setExpanded(i)}
                                  className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 group/btn transition-colors text-sm"
                                >
                                  <span>{isExpanded ? "Hide Fix Snippet" : "View Fix Snippet"}</span>
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                  )}
                                </button>
                                <div className="text-xs text-slate-500 mt-2 hidden md:block max-w-[120px] text-right">
                                  {issue.fix_title}
                                </div>
                              </div>
                            )}

                          </div>

                          {/* Expanded Fix Snippet */}
                          {!isBlurred && isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-6 pt-6 border-t border-white/5"
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <Code className="w-5 h-5 text-emerald-400" />
                                <h4 className="font-semibold text-emerald-400">Remediation Guide</h4>
                              </div>
                              <div className="bg-[#0d1117] rounded-xl p-4 overflow-x-auto border border-white/10 relative group/code">
                                <button
                                  onClick={() => navigator.clipboard.writeText(issue.fix_snippet)}
                                  className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-xs px-3 py-1.5 rounded-md opacity-0 group-hover/code:opacity-100 transition-opacity"
                                >
                                  Copy
                                </button>
                                <pre className="text-sm text-emerald-300/90 font-mono whitespace-pre-wrap">
                                  {issue.fix_snippet}
                                </pre>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* The Upgrade Prompt */}
              {result.issues.length > 3 && !isPremium && (
                <div id="pricing" className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl p-8 text-center relative overflow-hidden mt-12">
                  <div className="absolute -inset-24 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-3xl opacity-50"></div>
                  <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                    <Lock className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h3 className="text-3xl font-bold">Unlock Full Fix Guide — $10</h3>
                    <p className="text-lg text-emerald-100/70">
                      See all {result.issues.length} vulnerabilities and get exact copy-paste fix instructions for each one. Plain English. No subscription required.
                    </p>
                    <button
                      onClick={handleCheckout}
                      className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-4 px-10 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] cursor-pointer"
                    >
                      Get Premium Report
                    </button>
                    <div className="text-sm text-emerald-400/60 mt-4">One-time payment • Secure checkout via Stripe</div>
                  </div>
                </div>
              )}

              <div className="text-center pt-8">
                <button
                  onClick={() => { setResult(null); setUrl(""); }}
                  className="text-slate-400 hover:text-white transition-colors underline underline-offset-4"
                >
                  Scan another website
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Information Sections */}
        {!result && !isScanning && (
          <div className="mt-32 space-y-32 border-t border-white/5 pt-20">
            {/* How It Works Section */}
            <section id="how-it-works" className="max-w-4xl mx-auto text-center scroll-mt-24">
              <h2 className="text-3xl font-bold mb-8">How ShieldScan Works</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 text-emerald-400 font-bold text-xl">1</div>
                  <h3 className="font-semibold text-lg mb-2">Scan Your Domain</h3>
                  <p className="text-slate-400 text-sm">Enter your URL. Our engines instantly audit SSL, headers, open ports, and API endpoints.</p>
                </div>
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 text-emerald-400 font-bold text-xl">2</div>
                  <h3 className="font-semibold text-lg mb-2">AI Analysis</h3>
                  <p className="text-slate-400 text-sm">Our AI summarizes your vulnerabilities based on exploitability and business risk.</p>
                </div>
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 text-emerald-400 font-bold text-xl">3</div>
                  <h3 className="font-semibold text-lg mb-2">Copy-Paste Fixes</h3>
                  <p className="text-slate-400 text-sm">Get exact code snippets tailored for Nginx, Express, and others to patch holes fast.</p>
                </div>
              </div>
            </section>

            {/* Pricing Details */}
            <section id="pricing" className="max-w-4xl mx-auto text-center scroll-mt-24">
              <h2 className="text-3xl font-bold mb-8">Simple, Transparent Pricing</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 text-left hover:border-emerald-500/30 transition-colors">
                  <h3 className="text-xl font-semibold mb-2">Single Report PDF</h3>
                  <div className="text-4xl font-bold text-emerald-400 mb-4">$10<span className="text-lg text-slate-500 font-normal"> /one-time</span></div>
                  <ul className="space-y-3 text-slate-400 text-sm mb-8">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Full vulnerability list</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Executive AI Summary</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Exact code fix snippets</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Downloadable PDF format</li>
                  </ul>
                  <a href="/auth/login" className="block text-center bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-medium transition-colors">Get Started</a>
                </div>
                <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 text-left relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Most Popular</div>
                  <h3 className="text-xl font-semibold mb-2">Pro Subscription</h3>
                  <div className="text-4xl font-bold text-white mb-4">$29<span className="text-lg text-slate-500 font-normal"> /month</span></div>
                  <ul className="space-y-3 text-slate-400 text-sm mb-8">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Everything in Single Report</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited scans mapped to history</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Personalized dashboard access</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Automated weekly monitoring</li>
                  </ul>
                  <a href="/auth/login" className="block text-center bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20">Subscribe Now</a>
                </div>
              </div>
            </section>

            {/* Trust Center / Security */}
            <section id="trust" className="max-w-3xl mx-auto scroll-mt-24 text-left bg-slate-900/50 p-8 rounded-2xl border border-white/5">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Shield className="text-emerald-500" /> Trust & Security</h2>
              <p className="text-slate-400 mb-4 leading-relaxed">
                ShieldScan operates under strict, non-intrusive scanning principles. We do not attempt SQL Injection, cross-site scripting (XSS), or deploy malicious payloads against your infrastructure.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Our requests act exactly like a standard modern web browser or search engine crawler. We simply observe the public exposure of your headers, configurations, and surface-level file structures to warn you before a malicious actor discovers them.
              </p>
            </section>

            {/* Terms & Privacy */}
            <section id="terms" className="max-w-4xl mx-auto scroll-mt-24 text-left pb-12">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-xl font-bold mb-4">Terms of Service</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    By using ShieldScan, you attest that you have explicit, documented authorization to run automated security audits against the provided domain.
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Unauthorized usage against third-party entities is strictly prohibited. All scan requests establish an audit trail connected to your IP address for abuse prevention.
                  </p>
                </div>
                <div id="privacy" className="scroll-mt-24">
                  <h2 className="text-xl font-bold mb-4">Privacy Policy</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    We do not sell or index your scan results. Historical data is securely encrypted in transit and exclusively visible to authenticated accounts linked to the scan.
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Card payments are strictly processed via Stripe. We do not touch, capture, or retain raw payment instrumentation data.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950/80 mt-auto py-12 px-6 print:hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-400">
            <Shield className="w-5 h-5" />
            <span className="font-semibold text-white">ShieldScan</span>
            <span className="text-sm">© {new Date().getFullYear()}</span>
          </div>

          <div className="text-center md:text-left text-xs text-slate-500 max-w-2xl">
            <p>
              <strong>Legal Disclaimer:</strong> ShieldScan is a security auditing tool designed strictly for defensive and educational purposes.
              Active scanning features should only be used on domains you explicitly own or have documented authorization to test.
              Unauthorized scanning of third-party infrastructure may violate the Computer Fraud and Abuse Act (CFAA) or local laws.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#terms" className="hover:text-white transition-colors">Terms</a>
            <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="#trust" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
