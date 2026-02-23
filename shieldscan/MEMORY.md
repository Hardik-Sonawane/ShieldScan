# ShieldScan — Project Memory File
> Last updated: 2026-02-23
> Version: 3.0 — Final Updated Plan

---

## 🎯 Identity & Core Promise
- **Product**: ShieldScan — Security Clarity Platform
- **Tagline**: "See exactly how hackers see your website — and fix it in minutes."
- **Core Promise**: Turn security from scary into fixable
- **Revenue Goal**: $10,000+ MRR
- **Launch Target**: 30 days from start
- **Markets**: UK, Europe, Australia, USA (Global)

---

## 🧱 Identity Layers
| Layer | What It Means | Revenue Role |
|-------|--------------|--------------|
| Scanning | Entry point — free result | Acquisition |
| Fixing | WOW moment — nobody does this well | First payment |
| Monitoring | New issues appear constantly | Retention |
| Trust Badge | Certified Secure — annual renewal | Recurring revenue |
| Agency Layer | White label — agencies resell | Scale |

---

## 🎭 WOW Moment Components

### 1. Security Score
- Score 0–100, large, immediate
- Color: Red (0-40), Yellow (41-70), Green (71-100)
- Letter grade: F, D, C, B, A
- Shareable

### 2. Estimated Risk Impact (plain English)
- Missing CSP → "allows attackers to inject malicious scripts"
- SSL Expiring → "visitors will see security warning"
- Admin Panel Exposed → "brute-force attempts possible"
- Over-permissive CORS → "other sites can impersonate your users"
- Missing DMARC → "attackers can send emails as you"
- MCP Server Exposed → "AI agent connection can be hijacked"

### 3. Fix Difficulty Levels
- 🟢 **Easy** — 5 min — copy-paste config
- 🟡 **Medium** — 30 min — server/DNS edits
- 🔴 **Advanced** — Developer required

### 4. Progress Gap Visual
```
You fixed 3 issues. 7 still open — including 2 critical.
Your score could reach 84 if you fix them all.
```

### 5. Vulnerability Trends Data
- "72% of scanned sites are missing this header"
- "4x more likely on blacklists without this fix"
- "Exploited in 3,400 attacks last week"

---

## 💸 Conversion Design

### Blur Strategy
| Free Users See | Paid Users Unlock |
|---------------|------------------|
| Issue title | Exact header value |
| High-level risk explanation | Step-by-step fix instructions |
| Risk impact in plain English | Copy-paste config (Nginx/Apache/Cloudflare) |
| Difficulty level | Video walkthrough |
| Security score + grade | Historical score tracking |
| Top 3 issues visible | All issues with full detail |

### Upgrade Prompt
> **Unlock Full Fix Guide — $10** | See all 10 vulnerabilities and exact fix instructions for each one.

### Real Urgency (not fake)
- SSL expiring in N days
- Domain appeared on new blacklist today
- New CVE affecting your WordPress version published
- N new vulnerabilities since last scan

---

## 💰 Monetization Tiers
| Tier | Price | Who | Key Features |
|------|-------|-----|-------------|
| Free | $0 | Anyone | Score, top 3, AI summary, blurred fixes |
| Pay Per Scan | $10 | One-time | Full report + PDF |
| Starter | $29/mo | Small biz | Unlimited scans, 3 sites, alerts |
| Pro | $79/mo | Growing | 10 sites, active scan, Trust Center |
| Light Agency | $99/mo | Small agencies | Multi-domain, bulk PDF, branded |
| Agency | $199/mo | Web agencies | White label, client portal, API |
| Growth Agency | $499/mo | Large agencies | Custom domain, bulk tools, compliance |
| Enterprise | $999+/mo | Corporations | SOC 2, ISO mapping, SSO, SLA |

### Additional Revenue
- Scan credit packs (50 or 200 credits)
- Certified Secure badge annual renewal
- One-time compliance reports ($99–$299)
- Affiliate commissions (20–30% recurring)

---

## 🔧 Tech Stack
| Component | Technology |
|-----------|-----------|
| Frontend | Next.js + Tailwind |
| UI Components | Shadcn/UI |
| Backend | FastAPI (Python) |
| Passive Scanning | Python requests + ssl |
| Active Scanning | OWASP ZAP + Nuclei |
| MCP Detection | Custom Python HTTP |
| AI Fix Mode | Claude API hybrid |
| Database | PostgreSQL via Supabase |
| Caching | Redis (24hr TTL) |
| Auth | Clerk or Supabase Auth |
| Payments | Stripe |
| PDF | HTML + Puppeteer |
| Email | Resend |
| Background Jobs | Celery + Redis |
| Affiliate | PartnerStack |

### Architecture Rules
- Cache key: domain + scan type, TTL 24hr, paid users get force-rescan
- AI hybrid only: templates + polish (never fully dynamic)
- Ownership verification REQUIRED before active scanning
- Sandboxed LLM — client data NEVER trains public models
- No Kubernetes/microservices until $100K MRR

---

## 🗺️ 12-Phase Roadmap
| Phase | Timeline | Goal | What Gets Built |
|-------|----------|------|----------------|
| 1 | Days 1-7 | Something live | Landing, passive scan, score, AI summary, MCP check, CORS |
| 2 | Days 8-14 | WOW moment | AI Fix Mode 10 issues, difficulty levels, risk text, PDF |
| 3 | Days 15-21 | First payment | Accounts, Stripe $10, blur, upgrade prompts |
| 4 | Days 22-30 | Ship it | $29 sub, polish, Product Hunt + HN launch |
| 5 | Month 2 | Retain | Emails, change detection, progress timeline, score history |
| 6 | Month 2-3 | Agency revenue | Light Agency Mode |
| 7 | Month 3 | Deeper scanning | Active scanning, SQLi, XSS, CSRF |
| 8 | Month 3-4 | Own 2026 | Full MCP audit, Vibe Coding suite, hallucination scanner |
| 9 | Month 4-5 | B2B | Trust Center, badge, full agency, affiliate |
| 10 | Month 5-6 | Data moat | Trends published, fix library, benchmarks |
| 11 | Month 6-8 | Enterprise | ISO 27001, SOC 2, EU AI Act, Jira |
| 12 | Month 8-12 | Scale | GitHub PRs, PartnerStack, SSO, CISO dashboard |

---

## 📅 30-Day MVP Plan

### Week 1 — Foundation
- Landing page + headline
- SSL checker, security headers analyzer
- Domain blacklist check
- Security score 0–100 with grades
- Top 3 vulnerabilities + risk impact text
- Fix difficulty levels
- MCP server exposure check (HTTP)
- Over-permissive CORS check
- Basic AI summary

### Week 2 — WOW Moment
AI Fix Mode for 10 issues:
1. Missing CSP — exact header value
2. Missing HSTS — Nginx/Apache config
3. Weak TLS version — server config
4. SSL expiring soon — renewal guide
5. Admin panel exposed — restrict access
6. Sensitive files exposed — block guide
7. Missing DMARC — DNS record
8. Over-permissive CORS — AI code fix
9. Mixed content — HTTPS migration
10. MCP server exposed — secure it
- PDF report (executive summary, score, risk breakdown)
- Progress gap visual

### Week 3 — Monetize
- User accounts (signup/login/history)
- Blur strategy implementation
- Stripe pay-per-scan ($10)
- Upgrade prompts throughout
- $29/month subscription

### Week 4 — Ship
- Bug fixes
- Mobile responsive
- Scan under 60 seconds
- Error handling
- Basic analytics
- Product Hunt + HN + Reddit launch

### NOT in 30-Day MVP (Cut Rule)
- Active scanning (Phase 3)
- Full MCP audit (Phase 4)
- 24/7 monitoring (Phase 2)
- Agency dashboard (Phase 3)
- Trust Center (Phase 5)
- Compliance engine (Phase 6)
- WordPress integration (Phase 4+)
- GitHub fix PRs (Phase 6+)

---

## 👥 Target Users
- **B2C**: Small business owners, bloggers, ecommerce, Vibe Coders (AI-built sites)
- **B2B**: Web agencies, developers, IT teams, security consultants
- **Enterprise**: Compliance teams, CISOs, SaaS companies (SOC 2 / ISO 27001)

---

## 🏆 Competitive Advantages
1. **AI Fix Mode** with copy-paste snippets — competitors detect, we FIX
2. **MCP server detection** — zero mainstream tools offer this in 2026
3. **Vibe Coding audit** — built for AI-generated web
4. **Fix difficulty levels** — removes intimidation
5. **Risk impact in business language** — not security jargon
6. **Beautiful PDF reports**

---

## 📊 PMF Validation Signals
| Signal | Meaning | Action |
|--------|---------|--------|
| Conversion >5% | WOW working | Scale acquisition |
| Conversion <3% | WOW needs work | Improve Fix Mode first |
| Unprompted referrals | Early PMF | Interview, double down |
| Churn >15%/mo | Retention failing | Fix monitoring first |
| Agencies asking for white label | Pull signal | Fast-track Light Agency |
| Users asking for compliance | Pull signal | Fast-track compliance |

**#1 Metric Month 1**: First paying customer (not signups, not scans — PAYMENT)

---

## 🔑 The Rules
1. Before building anything: "Does this increase chance of payment in 30 days?"
2. Cut if it doesn't improve: WOW moment, Fix Mode clarity, Report quality, conversion rate, or speed to launch
3. Scope creep phrases to avoid: "this would make it better", "just one more feature", "let me perfect this first"
4. **Ship ugly. Charge anyway.**

## Revenue Milestone Targets
| Timeline | MRR | How |
|----------|-----|-----|
| Week 4 | $50 | 5 × $10 pay-per-scan |
| Month 1 | $500 | 50 pay-per-scan + Starter subs |
| Month 2 | $1,500 | Starter + Pro from launch traffic |
| Month 3 | $3,000 | Light Agency + monitoring |
| Month 6 | $7,000 | Agency + Trust Center |
| Month 9 | $12,000 | Compliance + enterprise + affiliate |
| Month 12 | $20,000+ | PartnerStack + white labels + data |

---

## 🗂️ Project Structure (Week 1 Build)
```
shieldscan/
├── frontend/          # Next.js app
│   ├── app/
│   ├── components/
│   └── ...
├── backend/           # FastAPI
│   ├── main.py
│   ├── scanners/
│   │   ├── ssl_checker.py
│   │   ├── headers_checker.py
│   │   ├── blacklist_checker.py
│   │   ├── mcp_checker.py
│   │   └── cors_checker.py
│   ├── ai/
│   │   └── summary.py
│   └── models/
└── MEMORY.md
```

---

## 🚦 Current Build Status
- [x] MEMORY.md created
- [x] SKILLS.md created
- [x] Backend — FastAPI scaffolding
- [x] Scanners — SSL, Headers, Blacklist, MCP, CORS
- [x] AI Summary — Claude hybrid
- [x] Frontend — Next.js landing + scan UI
- [x] Score system
- [x] PDF generation (MVP print mode)
- [x] Stripe integration (MVP mock redirect)
- [ ] Auth (Clerk/Supabase)
- [ ] Deployment (Vercel + Railway/Render)
