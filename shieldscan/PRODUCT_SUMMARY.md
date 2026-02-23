# ShieldScan: Project Overview & Status

## What is ShieldScan?
**ShieldScan** is an automated, AI-powered cybersecurity scanner designed to help small businesses and developers quickly identify and fix vulnerabilities in their web applications. It transforms complicated security jargon into actionable, easy-to-understand metrics (a 1 to 100 score + letter grade), providing users with an immediate "Wow!" moment when they see exactly how hackers view their site.

The platform includes a sleek, modern Next.js frontend and a blazingly fast FastAPI Python backend. Once a scan is complete, ShieldScan uses an AI (Anthropic Claude) to generate an executive summary and provides precise, copy-paste fixes for every issue found.

---

## Features We've Built So Far 🚀

1. **The Core Scanning Engine (Python/FastAPI)**
   - Checks for missing security headers (CSP, HSTS, X-Frame-Options).
   - Audits SSL certificates (validity, upcoming expirations).
   - Probes for exposed sensitive files (`.env`, config files).
   - Scans for exposed admin panels and over-permissive CORS configurations.
   - Detects missing email protection records (DMARC) and modern AI agent vulnerabilities (MCP exposure).

2. **The Frontend (Next.js / Tailwind CSS)**
   - Beautiful, premium dark-mode UI with emerald/teal glows and modern animations (Framer Motion).
   - Engaging loading state while the scan is running to build anticipation.
   - A dashboard that visually represents the score, grade, and progress.
   - Dedicated pages to view detailed breakdowns of each vulnerability alongside exact fix snippets.

3. **AI Executive Summary (Anthropic API)**
   - The backend directly queries Claude (Anthropic API) to ingest the list of found vulnerabilities and return a dynamic, professional, and directly-addressed 2-3 sentence executive summary.

4. **PDF Report Generation**
   - Headless browser rendering via Playwright and HTML templating with Jinja2.
   - Allows "Premium" users to download a beautifully styled PDF of their test results directly to their computer.

5. **Authentication & Database**
   - **Supabase** wired up for secure user login, sign-up, and session auth middleware.
   - SQL database connection via SQLAlchemy to store all historical scan results for authenticated users (currently using local SQLite for development MVP, ready for Supabase Postgres).

---

## Features Left To Do (Roadmap) 🚧

1. **Stripe Payments Integration**
   - Connect Stripe checkout sessions to the frontend to handle actual payments.
   - Implement the pricing tiers: $10 (One-time PDF Report) and $29/mo (Subscription access to the dashboard and history).
   - Configure webhooks to upgrade the user's account status in the database automatically after a successful payment.

2. **Production Deployment**
   - Deploy the Next.js frontend to a provider like Vercel.
   - Deploy the FastAPI backend to a server provider like Render, Fly.io, or DigitalOcean (includes setting up the Playwright environment to run headless in the cloud).
   - Properly route API requests from the deployed frontend to the deployed backend.

3. **Database & Auth Finalization**
   - Switch the local backend SQLite database over to the live Supabase PostgreSQL database URL now that local testing is complete.
   - Re-enable and test "Email Confirmations" in Supabase so users have to verify their identity.

4. **UI Polish & QA**
   - Ensure the dashboard cleanly displays historical scans retrieved from the database.
   - Polish up mobile responsiveness for all pages.
   - Ensure the login flow elegantly redirects users back to the dashboard.
