import React, { useState } from "react";
import {
  ArrowRight, ArrowUpRight, Compass, FileText, Globe, Leaf, Lock, UserCircle, Users,
} from "lucide-react";
import { NewsletterSection } from "@/app/components/NewsletterSection";
import { SDGWheel } from "@/app/components/SDGWheel";
import { Label, Reveal, SectionIntro } from "@/app/components/shared";
import { useContent } from "@/app/context/ContentContext";
import { useSiteNavigation } from "@/app/lib/navigation";
import { T } from "@/app/lib/theme";

const STORY_QUOTE =
  "One shared conviction — youth deserve a permanent seat at the global policy table.";

const STORY_PARAGRAPHS = [
  "In 2025, nine young people from across the globe came together in South Korea. Over five days of intensive dialogue, they drafted a bold policy document — and laid the foundations for the Global Youth Sustainability Council.",
  "The co-founders authored the Eunpyeong Declaration — a 95-page framework addressing education, climate, inequality, and institutional reform.",
  "Registered as a Canadian NGO, GYSC now operates across 14 countries — empowering young people to participate meaningfully in global decisions.",
];

export function HomePage() {
  const { goTo } = useSiteNavigation();
  const { text, image, founders } = useContent();
  const [amount, setAmount] = useState("$25");
  const [freq, setFreq] = useState<"one-time" | "monthly">("one-time");
  const [custom, setCustom] = useState("");
  const [donating, setDonating] = useState(false);
  const [donated, setDonated] = useState(false);

  const heroBg = image("hero_background");
  const aboutImg = image("about_image");

  function handleDonate() {
    setDonating(true);
    setTimeout(() => { setDonating(false); setDonated(true); }, 1600);
  }

  const stats = [
    { n: text("stat_1_n", "9"), label: text("stat_1_label", "Founding Members") },
    { n: text("stat_2_n", "14"), label: text("stat_2_label", "Countries") },
    { n: text("stat_3_n", "95"), label: text("stat_3_label", "Pages in Declaration") },
    { n: text("stat_4_n", "1"), label: text("stat_4_label", "Official Declaration") },
  ];

  const pillars = [
    { Icon: FileText, title: text("pillar_1_title", "Policy"), body: text("pillar_1_body", ""), hue: T.blue },
    { Icon: Compass, title: text("pillar_2_title", "Leadership"), body: text("pillar_2_body", ""), hue: T.teal },
    { Icon: Leaf, title: text("pillar_3_title", "Sustainability"), body: text("pillar_3_body", ""), hue: "#34c759" },
  ];

  return (
    <div className="site-main">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="hero-overlay" />
        <div className="hero-shapes" aria-hidden>
          <div className="hero-glow" />
          <div className="float-orb float-orb-a" />
          <div className="float-orb float-orb-b" />
          <div className="float-orb float-orb-c" />
          <div className="float-dot float-dot-a" />
          <div className="float-dot float-dot-b" />
          <div className="hero-accent-bar" />
        </div>

        <div className="container hero-content">
          <div className="hero-copy">
            <div className="hero-eyebrow anim-slide-right">
              <span className="eyebrow-bar" />
              <span>{text("hero_eyebrow", "Global Youth Sustainability Council")}</span>
            </div>

            <h1 className="hero-title">
              <span className="hero-line anim-fade-up d1">{text("hero_line1", "Young people.")}</span>
              <span className="hero-line anim-fade-up d2">
                <span className="hero-highlight">
                  {text("hero_line2", "Real policy.")}
                  <span className="hero-underline anim-line-grow" />
                </span>
              </span>
              <span className="hero-line anim-fade-up d3">{text("hero_line3", "Global impact.")}</span>
            </h1>

            <p className="hero-desc anim-fade-up d4">{text("hero_description", "")}</p>

            <div className="hero-btns anim-fade-up d5">
              <button className="btn btn-white" onClick={() => goTo("/register")}>Join GYSC <ArrowRight size={16} /></button>
              <button className="btn btn-outline-white" onClick={() => goTo("/login")}>Member Login</button>
              <button className="btn btn-outline-white" onClick={() => goTo("/partner")}>Partner With Us</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="stats-band">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s) => (
              <div key={s.label} className="stat-item">
                <div className="stat-number">{s.n}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── OUR STORY ── */}
      <section id="about" className="section story-section">
        <div className="story-bg" aria-hidden />
        <div className="container">
          <div className="story-layout">
            <Reveal cls="rev-l">
              <div className="story-visual">
                <div className="story-image-frame">
                  <img src={aboutImg} alt="GYSC co-founders and delegates" className="story-image" />
                  <div className="story-image-overlay" aria-hidden />
                </div>
                <div className="story-float-card">
                  <span className="story-float-num">9</span>
                  <span className="story-float-label">Co-founders · 14 countries</span>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div className="story-content">
                <Label>Our Story</Label>
                <blockquote className="story-quote">
                  <span className="story-quote-glyph" aria-hidden>"</span>
                  {STORY_QUOTE}
                </blockquote>
                <div className="story-paragraphs">
                  {STORY_PARAGRAPHS.map((para, i) => (
                    <p key={i} className="story-para">
                      <span className="story-para-index">{String(i + 1).padStart(2, "0")}</span>
                      {para}
                    </p>
                  ))}
                </div>
                <button className="teal-link" onClick={() => goTo("/founders")}>
                  Meet the founders <ArrowUpRight size={15} />
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section id="pillars" className="section section-surface">
        <div className="container">
          <Reveal>
            <SectionIntro label="Our Work" title={text("pillars_title", "What we stand for")} description={text("pillars_desc", "")} />
          </Reveal>
          <div className="pillar-grid">
            {pillars.map(({ Icon, title, body, hue }, i) => (
              <Reveal key={title} delay={i * 90}>
                <div className="card pillar-card" style={{ "--pillar-accent": hue } as React.CSSProperties}>
                  <div className="icon-badge pillar-icon"><Icon size={24} color={T.navy} strokeWidth={1.5} /></div>
                  <h3 className="pillar-title">{title}</h3>
                  <p className="body-text">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SDG ── */}
      <section id="sdg" className="section-tight section-sdg">
        <div className="sdg-grid-bg" aria-hidden />
        <div className="container sdg-inner">
          <Reveal>
            <div className="section-header-row">
              <div>
                <Label light>UN Sustainable Development Goals</Label>
                <h2 className="sdg-title">Every goal. Every action.</h2>
                <p className="sdg-hint">Scroll to spin the wheel · hover any tile to explore</p>
              </div>
            </div>
          </Reveal>
          <SDGWheel />
          <p className="sdg-disclaimer">GYSC operates in alignment with — not on behalf of — the United Nations.</p>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section id="newsletter" className="section section-white">
        <div className="container">
          <Reveal>
            <SectionIntro label="Publications" title={text("newsletter_title", "GYSC Newsletter")} description={text("newsletter_desc", "")} />
          </Reveal>
          <NewsletterSection />
        </div>
      </section>

      {/* ── DONATE ── */}
      <section id="donate" className="section section-surface">
        <div className="container">
          <div className="donate-grid">
            <Reveal cls="rev-l">
              <Label>Support Our Work</Label>
              <h2 className="section-title">{text("donate_title", "")}</h2>
              <p className="body-text mb-lg">{text("donate_description", "")}</p>
              <div className="trust-list">
                {[{ Icon: Lock, text: "Secure payment processing" }, { Icon: Globe, text: "Registered NGO, Canada" }, { Icon: Users, text: "100% funds youth programs directly" }].map(({ Icon, text: t }) => (
                  <div key={t} className="trust-item">
                    <div className="trust-icon"><Icon size={16} color={T.teal} /></div>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal>
              <div className="donate-panel">
                <p className="donate-label">Make a Contribution</p>
                <p className="donate-heading">Choose your impact</p>
                <div className="freq-toggle">
                  {(["one-time", "monthly"] as const).map((f) => (
                    <button key={f} className={`freq-btn ${freq === f ? "on" : "off"}`} onClick={() => setFreq(f)}>{f === "one-time" ? "One-time" : "Monthly"}</button>
                  ))}
                </div>
                <div className="amount-row">
                  {["$10", "$25", "$50", "$100", "Custom"].map((a) => (
                    <button key={a} className={`amount-chip ${amount === a ? "sel" : "unsel"}`} onClick={() => setAmount(a)}>{a}</button>
                  ))}
                </div>
                {amount === "Custom" && (
                  <div className="custom-amount">
                    <span>$</span>
                    <input type="number" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Enter amount" />
                  </div>
                )}
                <button className="btn btn-teal btn-fw" onClick={handleDonate} style={{ height: 50 }}>{donating ? "Processing..." : "Donate Now"}</button>
                <p className={`donate-note${donated ? " success" : ""}`}>
                  {donated ? "Thank you — payment processing coming soon." : "You will be redirected to our secure payment processor."}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FOUNDERS STRIP ── */}
      <section id="founders" className="section section-white">
        <div className="container">
          <Reveal>
            <div className="section-header-row">
              <div>
                <Label>Our People</Label>
                <h2 className="section-title">{text("founders_strip_title", "Meet the founders")}</h2>
              </div>
              <button className="btn btn-ghost" onClick={() => goTo("/founders")}>See all founders <ArrowRight size={16} /></button>
            </div>
          </Reveal>
          <div className="founders-strip-grid">
            {founders.map((f, i) => (
              <Reveal key={f._id} delay={i * 50}>
                <div className="founder-strip-item">
                  <div className="founder-avatar ring-pulse">
                    {f.imageUrl ? <img src={f.imageUrl} alt={f.name} /> : <UserCircle size={36} color={T.border} />}
                  </div>
                  <span className="founder-name">{f.name}</span>
                  <span className="founder-country">{f.country}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
