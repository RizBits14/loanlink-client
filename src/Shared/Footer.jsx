import { useEffect, useRef } from "react";
import { motion as Motion } from "framer-motion";
import { gsap } from "gsap";
import { ArrowUpRight, ShieldCheck, FileText, Lock, Mail } from "lucide-react";
import logo from "../assets/logo.png";

const Footer = () => {
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 24, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        }
      );
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={wrapRef}
      className="mt-20 border-t"
      style={{
        borderColor: "var(--border)",
        background:
          "linear-linear(180deg, color-mix(in oklab, var(--surface) 96%, transparent), color-mix(in oklab, var(--bg) 100%, transparent))",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3">
              <Motion.img
                src={logo}
                alt="LoanLink Logo"
                className="w-12 h-12"
                whileHover={{ rotate: 6, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
              />
              <h2 className="text-3xl font-bold tracking-wide bg-linear-to-r from-(--primary) to-(--secondary) bg-clip-text text-transparent">
                LoanLink
              </h2>
            </div>

            <p className="mt-5 text-sm leading-relaxed max-w-sm" style={{ color: "var(--muted)" }}>
              LoanLink is a secure and transparent microloan management platform enabling borrowers, managers, and
              administrators to collaborate efficiently.
            </p>

            <div
              className="mt-6 inline-flex items-center gap-2 rounded-2xl border px-4 py-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
              }}
            >
              <ShieldCheck size={18} style={{ color: "var(--success)" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>
                Trusted and Secure
              </span>
            </div>
          </div>

          <div>
            <h6 className="text-sm font-bold tracking-wider uppercase" style={{ color: "var(--text)" }}>
              Quick Links
            </h6>

            <ul className="mt-5 space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/loans", label: "All Loans" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                    style={{ color: "var(--muted)" }}
                  >
                    <span className="transition-colors group-hover:text-(--primary)">{l.label}</span>
                    <ArrowUpRight
                      size={16}
                      className="opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                      style={{ color: "var(--primary)" }}
                    />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
              <Mail size={14} />
              <span>Support available via in-app contact</span>
            </div>
          </div>

          <div>
            <h6 className="text-sm font-bold tracking-wider uppercase" style={{ color: "var(--text)" }}>
              Legal
            </h6>

            <ul className="mt-5 space-y-3">
              <li>
                <a
                  href="/termsandservices"
                  className="group inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                  style={{ color: "var(--muted)" }}
                >
                  <FileText size={16} style={{ color: "var(--primary)" }} />
                  <span className="transition-colors group-hover:text-(--primary)">Terms of Service</span>
                </a>
              </li>
              <li>
                <a
                  href="/privacypolicy"
                  className="group inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                  style={{ color: "var(--muted)" }}
                >
                  <Lock size={16} style={{ color: "var(--primary)" }} />
                  <span className="transition-colors group-hover:text-(--primary)">Privacy Policy</span>
                </a>
              </li>
            </ul>

          </div>
        </div>

        <div
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            © {new Date().getFullYear()} LoanLink. All rights reserved.
          </p>

          <a
            href="#top"
            className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "color-mix(in oklab, var(--surface) 92%, transparent)",
              color: "var(--text)",
              boxShadow: "0 12px 30px color-mix(in oklab, var(--text) 10%, transparent)",
            }}
          >
            Back to top
            <ArrowUpRight size={16} style={{ color: "var(--primary)" }} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
