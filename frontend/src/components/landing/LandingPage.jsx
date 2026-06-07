import { useState } from "react";
import centralLogo from "../../assets/central_logo.png";
import { useInView } from "../../hooks/useInView";
import {
  IconBarChart,
  IconCheck,
  IconDashboard,
  IconHistory,
  IconPayment,
  IconReport,
  IconShield,
} from "../icons";
import LandingBackground from "./LandingBackground";
import LoginModal from "./LoginModal";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#contact", label: "Contact" },
];

const TRUST_ITEMS = [
  "Role-Based Access",
  "Automated Verification",
  "Secure & Transparent",
];

const FEATURES = [
  {
    title: "Real-Time Dashboard",
    description:
      "Authorized staff access live operational insights inside a protected portal — no public data exposure",
    icon: IconDashboard,
    accent: "text-[#22D3EE]",
    bg: "bg-[rgba(34,211,238,0.12)]",
    hover: "hover:border-[rgba(34,211,238,0.45)] hover:shadow-[0_0_28px_rgba(34,211,238,0.2)]",
  },
  {
    title: "Automated Verification",
    description:
      "Telebirr, CBE Birr, Amole and all mobile payments verified automatically",
    icon: IconShield,
    accent: "text-[#10B981]",
    bg: "bg-[rgba(16,185,129,0.12)]",
    hover: "hover:border-[rgba(16,185,129,0.45)] hover:shadow-[0_0_28px_rgba(16,185,129,0.2)]",
  },
  {
    title: "Multi-Channel Payments",
    description:
      "Cash, Telebirr, CBE Birr, Amole and all major Ethiopian bank apps supported",
    icon: IconPayment,
    accent: "text-[#22D3EE]",
    bg: "bg-[rgba(34,211,238,0.12)]",
    hover: "hover:border-[rgba(34,211,238,0.45)] hover:shadow-[0_0_28px_rgba(34,211,238,0.2)]",
  },
  {
    title: "Patient Payment History",
    description: "Complete searchable payment records for every patient in seconds",
    icon: IconHistory,
    accent: "text-[#F59E0B]",
    bg: "bg-[rgba(245,158,11,0.12)]",
    hover: "hover:border-[rgba(245,158,11,0.45)] hover:shadow-[0_0_28px_rgba(245,158,11,0.2)]",
  },
  {
    title: "Automated Reports",
    description: "Daily, weekly and monthly financial reports generated automatically",
    icon: IconReport,
    accent: "text-[#22D3EE]",
    bg: "bg-[rgba(34,211,238,0.12)]",
    hover: "hover:border-[rgba(34,211,238,0.45)] hover:shadow-[0_0_28px_rgba(34,211,238,0.2)]",
  },
  {
    title: "Full Audit Trail",
    description: "Every transaction recorded with timestamp and staff accountability",
    icon: IconBarChart,
    accent: "text-[#10B981]",
    bg: "bg-[rgba(16,185,129,0.12)]",
    hover: "hover:border-[rgba(16,185,129,0.45)] hover:shadow-[0_0_28px_rgba(16,185,129,0.2)]",
  },
];

function FadeIn({ children, className = "" }) {
  const [ref, inView] = useInView({ threshold: 0.12 });
  return (
    <div
      ref={ref}
      className={`landing-fade-up ${inView ? "landing-fade-up--visible" : ""} ${className}`.trim()}
    >
      {children}
    </div>
  );
}

export default function LandingPage({ onSelectRole }) {
  const [loginOpen, setLoginOpen] = useState(false);

  function scrollTo(href) {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="landing-page relative min-h-screen text-white">
      <LandingBackground />

      <nav className="landing-nav fixed left-0 right-0 top-0 z-50 border-b border-[rgba(34,211,238,0.1)] bg-[rgba(5,13,26,0.9)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#features" className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[rgba(34,211,238,0.08)] shadow-[0_0_16px_rgba(34,211,238,0.2)] sm:h-11 sm:w-11">
              <img
                src={centralLogo}
                alt="Central City Hospital"
                className="h-9 w-9 object-contain sm:h-10 sm:w-10"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white sm:text-base">
                Central City Hospital
              </p>
              <p className="text-[10px] font-medium text-[#22D3EE] sm:text-xs">
                Powered by AbaderTech System
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => scrollTo(link.href)}
                className="text-sm font-medium text-[#94A3B8] transition-colors hover:text-[#22D3EE]"
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setLoginOpen(true)}
            className="btn-landing-cyan shrink-0 rounded-lg px-5 py-2.5 text-sm font-bold text-white"
          >
            Login
          </button>
        </div>
      </nav>

      <main>
        <section
          id="features"
          className="relative px-4 pb-20 pt-28 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-4xl text-center">
            <img
              src={centralLogo}
              alt=""
              className="mx-auto mb-8 h-20 w-20 object-contain drop-shadow-[0_0_32px_rgba(34,211,238,0.35)] sm:h-24 sm:w-24"
              aria-hidden
            />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#22D3EE] sm:text-sm">
              Hospital Financial Management
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Centralized Hospital Financial
              <br />
              &amp; Revenue Management
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#94A3B8] sm:text-lg">
              A secure platform for Central City Hospital. Financial data and dashboards
              are available only after login — protected by role-based access.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className="btn-landing-cyan w-full rounded-xl px-8 py-4 text-base font-bold sm:w-auto"
              >
                Login to Access
              </button>
              <button
                type="button"
                onClick={() => scrollTo("#features-grid")}
                className="w-full rounded-xl border-2 border-[#22D3EE] bg-transparent px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-[rgba(34,211,238,0.08)] sm:w-auto"
              >
                View Features
              </button>
            </div>
            <ul className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {TRUST_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                  <IconCheck className="h-4 w-4 shrink-0 text-[#22D3EE]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div id="features-grid" className="mx-auto mt-20 max-w-6xl">
            <FadeIn className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Everything Management Needs
              </h2>
              <p className="mt-4 text-[#94A3B8]">
                Built to solve every financial pain point in your hospital
              </p>
            </FadeIn>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <FadeIn key={feature.title} className={`landing-stagger-${i % 3}`}>
                    <article
                      className={`landing-feature-card h-full rounded-2xl border border-[rgba(34,211,238,0.15)] bg-[#112240] p-6 transition-all duration-300 ${feature.hover}`}
                    >
                      <div
                        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}
                      >
                        <Icon className={`h-6 w-6 ${feature.accent}`} />
                      </div>
                      <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">
                        {feature.description}
                      </p>
                    </article>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        <footer
          id="contact"
          className="border-t border-[rgba(34,211,238,0.1)] bg-[#050D1A] px-4 py-12 sm:px-6 lg:px-8"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div>
              <p className="font-bold text-white">Central City Hospital</p>
              <p className="mt-1 text-sm text-[#22D3EE]">Powered by AbaderTech System</p>
            </div>
            <p className="text-sm text-[#94A3B8]">
              © 2026 AbaderTech System. All rights reserved.
            </p>
            <div className="text-sm">
              <p className="font-semibold text-white">Contact Us</p>
              <a
                href="mailto:support@abadertech.com"
                className="mt-1 block text-[#94A3B8] transition-colors hover:text-[#22D3EE]"
              >
                support@abadertech.com
              </a>
              <a
                href="tel:+251925254765"
                className="mt-1 block text-[#94A3B8] transition-colors hover:text-[#22D3EE]"
              >
                0925254765
              </a>
            </div>
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-[#64748B]">
            Centralized Hospital Financial &amp; Revenue Management System — built by
            AbaderTech System for Central City Hospital.
          </p>
        </footer>
      </main>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSelectRole={onSelectRole}
      />
    </div>
  );
}

