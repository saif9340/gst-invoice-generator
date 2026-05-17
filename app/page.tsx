"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: "⚡",
      title: "Instant GST Calculation",
      desc: "Auto-computes CGST, SGST & IGST based on seller and buyer states. Zero manual effort.",
    },
    {
      icon: "📄",
      title: "PDF Download",
      desc: "Export pixel-perfect invoices as PDF in one click. Ready to email or print.",
    },
    {
      icon: "🗂️",
      title: "Invoice History",
      desc: "Every invoice saved locally. Load, reuse, or delete past invoices anytime.",
    },
    {
      icon: "🖨️",
      title: "Print Ready",
      desc: "Clean print layout optimised for A4. Professional invoices every time.",
    },
    {
      icon: "🏢",
      title: "Your Branding",
      desc: "Upload your business logo. Your business name and GSTIN front and centre.",
    },
    {
      icon: "🔒",
      title: "100% Private",
      desc: "All data stays in your browser. Nothing is sent to any server.",
    },
  ];

  const steps = [
    { n: "01", title: "Enter Business Details", desc: "Add your business name, GSTIN and state." },
    { n: "02", title: "Add Products", desc: "List items with HSN codes, quantities and rates." },
    { n: "03", title: "Preview & Export", desc: "Live invoice preview. Download PDF instantly." },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --navy: #0a0f2e;
          --navy2: #111840;
          --saffron: #FF8C00;
          --gold: #F5C842;
          --green: #138808;
          --white: #FAFAFA;
          --muted: #8892b0;
          --card-bg: rgba(255,255,255,0.04);
          --border: rgba(255,255,255,0.08);
        }

        body { background: var(--navy); color: var(--white); }

        .home-wrap {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: var(--navy);
          overflow-x: hidden;
        }

        /* ── NAV ── */
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 60px;
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          background: rgba(10,15,46,0.92);
          backdrop-filter: blur(12px);
          z-index: 100;
        }
        .nav-logo {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 900;
          color: var(--white);
          letter-spacing: -0.5px;
        }
        .nav-logo span { color: var(--saffron); }
        .nav-cta {
          background: var(--saffron);
          color: #fff;
          border: none;
          padding: 10px 24px;
          border-radius: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }
        .nav-cta:hover { background: #e07b00; transform: translateY(-1px); }

        /* ── HERO ── */
        .hero {
          position: relative;
          padding: 100px 60px 80px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* background decorations */
        .hero::before {
          content: '';
          position: absolute;
          top: -60px; right: -100px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(255,140,0,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero::after {
          content: '';
          position: absolute;
          bottom: -100px; left: -80px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(19,136,8,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,140,0,0.1);
          border: 1px solid rgba(255,140,0,0.3);
          color: var(--saffron);
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 24px;
        }
        .hero-badge .dot {
          width: 7px; height: 7px;
          background: var(--saffron);
          border-radius: 50%;
          animation: pulse 1.8s infinite;
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(1.4); }
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(38px, 5vw, 58px);
          font-weight: 900;
          line-height: 1.1;
          color: var(--white);
          margin-bottom: 20px;
        }
        .hero-title .accent { color: var(--saffron); }
        .hero-title .accent2 { color: var(--gold); }

        .hero-sub {
          font-size: 17px;
          color: var(--muted);
          line-height: 1.7;
          margin-bottom: 36px;
          max-width: 480px;
        }

        .hero-btns { display: flex; gap: 14px; flex-wrap: wrap; }

        .btn-primary {
          background: linear-gradient(135deg, var(--saffron), #e07b00);
          color: #fff;
          border: none;
          padding: 15px 34px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 4px 20px rgba(255,140,0,0.35);
        }
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(255,140,0,0.45);
        }

        .btn-secondary {
          background: transparent;
          color: var(--white);
          border: 1px solid var(--border);
          padding: 15px 28px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-secondary:hover { border-color: var(--saffron); color: var(--saffron); }

        .hero-stats {
          display: flex;
          gap: 32px;
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid var(--border);
        }
        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: var(--white);
        }
        .stat-num span { color: var(--saffron); }
        .stat-lbl { font-size: 13px; color: var(--muted); margin-top: 2px; }

        /* ── INVOICE MOCKUP ── */
        .mockup-wrap {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .mockup-glow {
          position: absolute;
          width: 340px; height: 340px;
          background: radial-gradient(circle, rgba(255,140,0,0.15), transparent 70%);
          border-radius: 50%;
        }
        .mockup {
          position: relative;
          background: #ffffff;
          border-radius: 12px;
          padding: 28px;
          width: 340px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06);
          transform: rotate(2deg);
          animation: float 4s ease-in-out infinite;
          color: #111;
        }
        @keyframes float {
          0%,100% { transform: rotate(2deg) translateY(0); }
          50% { transform: rotate(2deg) translateY(-10px); }
        }
        .mockup-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #FF8C00;
        }
        .mockup-biz { font-weight: 800; font-size: 15px; color: #0a0f2e; }
        .mockup-gst { font-size: 10px; color: #888; }
        .mockup-inv { text-align: right; font-size: 11px; color: #555; }
        .mockup-inv strong { color: #0a0f2e; font-size: 13px; display: block; }
        .mockup-bill { font-size: 11px; color: #555; margin-bottom: 12px; }
        .mockup-bill strong { color: #111; display: block; margin-bottom: 2px; font-size: 12px; }
        .mockup-table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 14px; }
        .mockup-table th { background: #f3f4f6; padding: 6px 8px; text-align: left; color: #374151; font-weight: 700; border: 1px solid #e5e7eb; }
        .mockup-table td { padding: 6px 8px; border: 1px solid #e5e7eb; color: #374151; }
        .mockup-totals { text-align: right; font-size: 11px; color: #555; }
        .mockup-total-row { font-size: 14px; font-weight: 800; color: #0a0f2e; border-top: 2px solid #0a0f2e; padding-top: 6px; margin-top: 4px; }
        .mockup-words { font-size: 10px; font-style: italic; color: #888; margin-top: 4px; }

        /* floating badge on mockup */
        .mockup-badge {
          position: absolute;
          top: -16px; right: -20px;
          background: var(--green);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 20px;
          box-shadow: 0 4px 14px rgba(19,136,8,0.4);
          transform: rotate(-4deg);
        }
        .mockup-badge2 {
          position: absolute;
          bottom: -14px; left: -16px;
          background: var(--navy2);
          border: 1px solid var(--saffron);
          color: var(--saffron);
          font-size: 11px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 20px;
          transform: rotate(3deg);
        }

        /* ── SECTION SHARED ── */
        .section { padding: 80px 60px; max-width: 1200px; margin: 0 auto; }
        .section-tag {
          display: inline-block;
          background: rgba(255,140,0,0.1);
          color: var(--saffron);
          border: 1px solid rgba(255,140,0,0.25);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 99px;
          margin-bottom: 16px;
        }
        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 3.5vw, 40px);
          font-weight: 700;
          color: var(--white);
          margin-bottom: 12px;
        }
        .section-sub { font-size: 16px; color: var(--muted); max-width: 520px; line-height: 1.7; margin-bottom: 48px; }

        /* ── FEATURES GRID ── */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .feature-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 28px;
          transition: border-color 0.25s, transform 0.25s, background 0.25s;
          cursor: default;
        }
        .feature-card:hover {
          border-color: rgba(255,140,0,0.4);
          background: rgba(255,140,0,0.04);
          transform: translateY(-4px);
        }
        .feature-icon {
          font-size: 28px;
          margin-bottom: 14px;
          display: block;
        }
        .feature-title { font-size: 16px; font-weight: 700; color: var(--white); margin-bottom: 8px; }
        .feature-desc { font-size: 14px; color: var(--muted); line-height: 1.65; }

        /* ── HOW IT WORKS ── */
        .how-bg {
          background: linear-gradient(135deg, rgba(255,140,0,0.05) 0%, rgba(19,136,8,0.03) 100%);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 80px 0;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          position: relative;
        }
        .steps-grid::before {
          content: '';
          position: absolute;
          top: 36px; left: 16.5%; right: 16.5%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--saffron), transparent);
        }
        .step-card { text-align: center; padding: 0 16px; }
        .step-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 72px; height: 72px;
          border-radius: 50%;
          border: 2px solid var(--saffron);
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 900;
          color: var(--saffron);
          background: var(--navy);
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }
        .step-title { font-size: 17px; font-weight: 700; color: var(--white); margin-bottom: 8px; }
        .step-desc { font-size: 14px; color: var(--muted); line-height: 1.65; }

        /* ── CTA BANNER ── */
        .cta-banner {
          background: linear-gradient(135deg, #FF8C00 0%, #e07000 50%, #c85e00 100%);
          border-radius: 20px;
          padding: 64px 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
          position: relative;
          overflow: hidden;
          margin: 0 60px 80px;
          max-width: 1080px;
          margin-left: auto;
          margin-right: auto;
        }
        .cta-banner::before {
          content: '₹';
          position: absolute;
          right: 40px; top: -20px;
          font-family: 'Playfair Display', serif;
          font-size: 200px;
          font-weight: 900;
          color: rgba(255,255,255,0.07);
          line-height: 1;
        }
        .cta-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 900;
          color: #fff;
          margin-bottom: 10px;
        }
        .cta-sub { font-size: 16px; color: rgba(255,255,255,0.8); }
        .btn-cta-white {
          background: #fff;
          color: var(--saffron);
          border: none;
          padding: 16px 36px;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          flex-shrink: 0;
        }
        .btn-cta-white:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.2); }

        /* ── FOOTER ── */
        .footer {
          border-top: 1px solid var(--border);
          padding: 28px 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: var(--muted);
        }
        .footer-logo {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 700;
          color: var(--white);
        }
        .footer-logo span { color: var(--saffron); }

        /* tricolor bar */
        .tricolor {
          height: 4px;
          background: linear-gradient(90deg, #FF8C00 33.3%, #fff 33.3% 66.6%, #138808 66.6%);
        }

        /* entrance animation */
        .fade-up {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; padding: 60px 24px 40px; }
          .mockup-wrap { display: none; }
          .nav { padding: 16px 24px; }
          .section { padding: 60px 24px; }
          .features-grid { grid-template-columns: 1fr 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
          .steps-grid::before { display: none; }
          .cta-banner { margin: 0 24px 60px; padding: 40px 32px; flex-direction: column; text-align: center; }
          .footer { flex-direction: column; gap: 10px; padding: 24px; text-align: center; }
        }
      `}</style>

      <div className="home-wrap">
        <div className="tricolor" />

        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">GST<span>Invoice</span></div>
          <button className="nav-cta" onClick={() => router.push("/invoice")}>
            Create Invoice →
          </button>
        </nav>

        {/* HERO */}
        <div className="hero">
          <div>
            <div className="hero-badge">
              <span className="dot" />
              Made for Indian Businesses
            </div>
            <h1 className="hero-title">
              GST Invoices,<br />
              <span className="accent">Done in</span>{" "}
              <span className="accent2">60 Seconds</span>
            </h1>
            <p className="hero-sub">
              Create professional GST-compliant invoices with auto-calculated CGST, SGST &amp; IGST.
              Download as PDF. Free. Private. 
            </p>
            <div className="hero-btns">
              <button className="btn-primary" onClick={() => router.push("/invoice")}>
                Create Free Invoice →
              </button>
              <button className="btn-secondary" onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}>
                See Features
              </button>
            </div>
            <div className="hero-stats">
              <div>
                <div className="stat-num">100<span>%</span></div>
                <div className="stat-lbl">Free Forever</div>
              </div>
              <div>
                <div className="stat-num">0<span>s</span></div>
                <div className="stat-lbl">Server Sent</div>
              </div>
              <div>
                <div className="stat-num">GST<span>.</span></div>
                <div className="stat-lbl">Fully Compliant</div>
              </div>
            </div>
          </div>

          {/* INVOICE MOCKUP */}
          <div className="mockup-wrap">
            <div className="mockup-glow" />
            <div className="mockup">
              <div className="mockup-badge">✓ GST Compliant</div>
              <div className="mockup-badge2">PDF Ready</div>
              <div className="mockup-header">
                <div>
                  <div className="mockup-biz">Sharma Traders</div>
                  <div className="mockup-gst">GSTIN: 23ABCDE1234F1Z5</div>
                  <div className="mockup-gst">State: Madhya Pradesh</div>
                </div>
                <div className="mockup-inv">
                  <strong>INV-2026-0001</strong>
                  Date: 23/4/2026
                </div>
              </div>
              <div className="mockup-bill">
                <strong>Bill To:</strong>
                Rahul Gupta, Maharashtra
              </div>
              <table className="mockup-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Cotton Fabric</td>
                    <td>10</td>
                    <td>₹500</td>
                    <td>₹5,000</td>
                  </tr>
                  <tr>
                    <td>Silk Thread</td>
                    <td>5</td>
                    <td>₹200</td>
                    <td>₹1,000</td>
                  </tr>
                </tbody>
              </table>
              <div className="mockup-totals">
                <div>Subtotal: ₹6,000.00</div>
                <div>IGST (18%): ₹1,080.00</div>
                <div className="mockup-total-row">Grand Total: ₹7,080.00</div>
                <div className="mockup-words">Seven Thousand Eighty Rupees Only</div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div id="features" className="section">
          <div className="section-tag">Features</div>
          <h2 className="section-title">Everything you need,<br />nothing you don&apos;t</h2>
          <p className="section-sub">Built specifically for Indian GST requirements. Simple, fast, and works right in your browser.</p>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="how-bg">
          <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
            <div className="section-tag">How It Works</div>
            <h2 className="section-title">Three steps to your invoice</h2>
            <p className="section-sub">No signup. No learning curve. Just open and go.</p>
            <div className="steps-grid">
              {steps.map((s, i) => (
                <div key={i} className="step-card">
                  <div className="step-num">{s.n}</div>
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA BANNER */}
        <div style={{ padding: "80px 0 0" }}>
          <div className="cta-banner">
            <div>
              <div className="cta-title">Ready to create your first invoice?</div>
              <div className="cta-sub">Free, instant, and GST-compliant. No account needed.</div>
            </div>
            <button className="btn-cta-white" onClick={() => router.push("/invoice")}>
              Create Invoice Now →
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-logo">GST<span>Invoice</span></div>
          <div>Built for Indian businesses 🇮🇳 · 100% free · No data stored on servers</div>
        </footer>
        <div className="tricolor" />
      </div>
    </>
  );
}