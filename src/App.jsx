 import { useState, useEffect, useRef } from "react";

// ── Palette & globals ──────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink:    #0a0f1e;
  --ink2:   #1c243a;
  --slate:  #3d4966;
  --muted:  #8892a4;
  --line:   #e4e8f0;
  --bg:     #f7f8fc;
  --white:  #ffffff;
  --teal:   #00c2a8;
  --teal2:  #00a890;
  --amber:  #f59e0b;
  --red:    #ef4444;
  --green:  #10b981;
  --blue:   #3b82f6;
  --purple: #8b5cf6;
  --r:      12px;
  --r2:     20px;
  --sh:     0 4px 24px rgba(0,0,0,.07);
  --sh2:    0 8px 40px rgba(0,0,0,.12);
}

html { scroll-behavior: smooth; }

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  color: var(--ink);
  min-height: 100vh;
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1,h2,h3,h4,h5,h6 { font-family: 'Syne', sans-serif; line-height: 1.2; }

/* ── Layout ── */
.app { display: flex; flex-direction: column; min-height: 100vh; }
.main { flex: 1; }

/* ── Nav ── */
.nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(247,248,252,.92);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--line);
  padding: 0 32px;
  height: 64px;
  display: flex; align-items: center; justify-content: space-between;
}
.nav-brand {
  display: flex; align-items: center; gap: 10px;
  font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px;
  color: var(--ink); text-decoration: none; cursor: pointer;
}
.nav-brand-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--teal); }
.nav-links { display: flex; align-items: center; gap: 4px; }
.nav-link {
  padding: 6px 14px; border-radius: 8px; font-size: 14px; font-weight: 500;
  color: var(--slate); cursor: pointer; transition: all .2s; border: none;
  background: transparent; font-family: 'DM Sans', sans-serif;
}
.nav-link:hover { background: var(--line); color: var(--ink); }
.nav-link.active { color: var(--teal); background: rgba(0,194,168,.08); }
.nav-actions { display: flex; gap: 8px; }

/* ── Buttons ── */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px 22px; border-radius: var(--r); font-weight: 600; font-size: 14px;
  cursor: pointer; transition: all .2s; border: none; font-family: 'DM Sans', sans-serif;
  white-space: nowrap; text-decoration: none;
}
.btn-primary { background: var(--teal); color: #fff; }
.btn-primary:hover { background: var(--teal2); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,194,168,.35); }
.btn-secondary { background: var(--white); color: var(--ink); border: 1.5px solid var(--line); }
.btn-secondary:hover { border-color: var(--teal); color: var(--teal); background: rgba(0,194,168,.04); }
.btn-ghost { background: transparent; color: var(--slate); }
.btn-ghost:hover { color: var(--ink); background: var(--line); }
.btn-dark { background: var(--ink); color: #fff; }
.btn-dark:hover { background: var(--ink2); transform: translateY(-1px); box-shadow: var(--sh2); }
.btn-danger { background: var(--red); color: #fff; }
.btn-sm { padding: 6px 14px; font-size: 13px; }
.btn-lg { padding: 14px 32px; font-size: 16px; border-radius: 14px; }
.btn-full { width: 100%; }

/* ── Cards ── */
.card {
  background: var(--white); border-radius: var(--r2);
  border: 1px solid var(--line); box-shadow: var(--sh); padding: 28px;
}
.card-sm { padding: 20px; border-radius: var(--r); }

/* ── Section ── */
.section { padding: 80px 0; }
.section-sm { padding: 48px 0; }
.container { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
.container-sm { max-width: 720px; margin: 0 auto; padding: 0 24px; }

/* ── Grid ── */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
.grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }

/* ── Badge ── */
.badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;
}
.badge-teal { background: rgba(0,194,168,.1); color: var(--teal2); }
.badge-amber { background: rgba(245,158,11,.1); color: #d97706; }
.badge-red { background: rgba(239,68,68,.1); color: var(--red); }
.badge-green { background: rgba(16,185,129,.1); color: var(--green); }
.badge-blue { background: rgba(59,130,246,.1); color: var(--blue); }
.badge-purple { background: rgba(139,92,246,.1); color: var(--purple); }
.badge-gray { background: var(--line); color: var(--slate); }

/* ── Form ── */
label { font-size: 13px; font-weight: 600; color: var(--ink2); display: block; margin-bottom: 6px; }
input, textarea, select {
  width: 100%; padding: 10px 14px; border: 1.5px solid var(--line); border-radius: var(--r);
  font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink);
  background: var(--white); transition: border-color .2s; outline: none;
}
input:focus, textarea:focus, select:focus { border-color: var(--teal); box-shadow: 0 0 0 3px rgba(0,194,168,.12); }
textarea { resize: vertical; min-height: 140px; line-height: 1.6; }
.field { margin-bottom: 20px; }

/* ── Upload Zone ── */
.upload-zone {
  border: 2px dashed var(--line); border-radius: var(--r2); padding: 48px 32px;
  text-align: center; cursor: pointer; transition: all .2s;
  background: var(--bg);
}
.upload-zone:hover, .upload-zone.drag { border-color: var(--teal); background: rgba(0,194,168,.04); }
.upload-icon { font-size: 40px; margin-bottom: 12px; }

/* ── Score Circle ── */
.score-circle {
  width: 140px; height: 140px; border-radius: 50%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  position: relative; margin: 0 auto;
}
.score-ring { position: absolute; top:0; left:0; transform: rotate(-90deg); }
.score-val { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; }
.score-lbl { font-size: 11px; font-weight: 600; color: var(--muted); letter-spacing: .05em; text-transform: uppercase; }

/* ── Progress bar ── */
.pbar-wrap { margin-bottom: 14px; }
.pbar-head { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
.pbar-track { height: 8px; background: var(--line); border-radius: 4px; overflow: hidden; }
.pbar-fill { height: 100%; border-radius: 4px; transition: width 1s cubic-bezier(.16,1,.3,1); }

/* ── Tags ── */
.tag-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
.tag {
  padding: 5px 12px; border-radius: 20px; font-size: 13px; font-weight: 500;
  display: inline-flex; align-items: center; gap: 6px;
}
.tag-green { background: rgba(16,185,129,.1); color: var(--green); }
.tag-red { background: rgba(239,68,68,.1); color: var(--red); }
.tag-blue { background: rgba(59,130,246,.1); color: var(--blue); }
.tag-gray { background: var(--line); color: var(--slate); }
.tag-amber { background: rgba(245,158,11,.1); color: #d97706; }

/* ── Tabs ── */
.tabs { display: flex; gap: 4px; border-bottom: 2px solid var(--line); margin-bottom: 24px; }
.tab {
  padding: 10px 18px; font-size: 14px; font-weight: 600; cursor: pointer;
  border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all .2s;
  color: var(--muted); background: none; border-left: none; border-right: none; border-top: none;
  font-family: 'DM Sans', sans-serif;
}
.tab:hover { color: var(--ink); }
.tab.active { color: var(--teal); border-bottom-color: var(--teal); }

/* ── Alert ── */
.alert {
  padding: 14px 18px; border-radius: var(--r); font-size: 14px;
  display: flex; align-items: flex-start; gap: 10px; margin-bottom: 14px;
}
.alert-info { background: rgba(59,130,246,.08); border: 1px solid rgba(59,130,246,.2); color: #1d4ed8; }
.alert-warn { background: rgba(245,158,11,.08); border: 1px solid rgba(245,158,11,.2); color: #92400e; }
.alert-success { background: rgba(16,185,129,.08); border: 1px solid rgba(16,185,129,.2); color: #065f46; }
.alert-danger { background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.2); color: #991b1b; }

/* ── Stat card ── */
.stat-card { text-align: center; padding: 24px; }
.stat-num { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; color: var(--teal); }
.stat-desc { font-size: 13px; color: var(--muted); margin-top: 4px; }

/* ── Timeline ── */
.timeline { position: relative; padding-left: 32px; }
.timeline::before { content:''; position:absolute; left:11px; top:0; bottom:0; width:2px; background:var(--line); }
.tl-item { position:relative; margin-bottom:28px; }
.tl-dot {
  position:absolute; left:-32px; top:4px; width:24px; height:24px;
  border-radius:50%; background:var(--teal); display:flex; align-items:center; justify-content:center;
  font-size:12px; color:#fff; font-weight:700;
}

/* ── Pricing ── */
.pricing-card { border-radius: var(--r2); padding: 36px; border: 2px solid var(--line); background: var(--white); position:relative; }
.pricing-card.featured { border-color: var(--teal); background: linear-gradient(135deg,rgba(0,194,168,.04),rgba(0,194,168,.01)); }
.pricing-badge { position:absolute; top:-14px; left:50%; transform:translateX(-50%); white-space:nowrap; }
.price-num { font-family:'Syne',sans-serif; font-size:48px; font-weight:800; }
.price-per { font-size:14px; color:var(--muted); }

/* ── Footer ── */
.footer { background: var(--ink); color: rgba(255,255,255,.6); padding: 48px 0 28px; }
.footer-brand { font-family:'Syne',sans-serif; font-weight:800; font-size:20px; color:#fff; margin-bottom:8px; display:flex; align-items:center; gap:8px; }
.footer-links { display:flex; flex-direction:column; gap:8px; }
.footer-link { color:rgba(255,255,255,.5); text-decoration:none; font-size:14px; cursor:pointer; transition:color .2s; background:none; border:none; font-family:'DM Sans',sans-serif; }
.footer-link:hover { color:#fff; }
.footer-bottom { border-top:1px solid rgba(255,255,255,.1); margin-top:40px; padding-top:20px; text-align:center; font-size:13px; }

/* ── Hero ── */
.hero {
  background: linear-gradient(135deg, #0a0f1e 0%, #0f1a30 50%, #0a1628 100%);
  padding: 100px 0 90px; position: relative; overflow: hidden;
}
.hero::before {
  content:''; position:absolute; inset:0;
  background: radial-gradient(ellipse 60% 50% at 70% 50%, rgba(0,194,168,.15) 0%, transparent 70%);
}
.hero-grid { display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:center; position:relative; }
.hero-eyebrow { font-size:12px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--teal); margin-bottom:16px; }
.hero-h1 { font-size:56px; font-weight:800; color:#fff; line-height:1.05; margin-bottom:20px; }
.hero-sub { font-size:17px; color:rgba(255,255,255,.6); line-height:1.7; margin-bottom:36px; max-width:480px; }
.hero-actions { display:flex; gap:12px; flex-wrap:wrap; }
.hero-visual {
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.1);
  border-radius: 24px; padding: 28px; backdrop-filter: blur(10px);
}
.hero-score-row { display:flex; justify-content:space-around; margin-bottom:20px; }
.hero-metric { text-align:center; }
.hero-metric-val { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; color:var(--teal); }
.hero-metric-lbl { font-size:11px; color:rgba(255,255,255,.4); margin-top:2px; }
.hero-bar-row { margin-bottom:10px; }
.hero-bar-lbl { display:flex; justify-content:space-between; font-size:12px; color:rgba(255,255,255,.5); margin-bottom:5px; }
.hero-bar-track { height:6px; background:rgba(255,255,255,.08); border-radius:3px; overflow:hidden; }
.hero-bar-fill { height:100%; border-radius:3px; background:linear-gradient(90deg,var(--teal),#00e5c8); }

/* ── Step cards ── */
.step-num { width:44px; height:44px; border-radius:12px; background:var(--teal); color:#fff; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:800; font-size:16px; margin-bottom:14px; }

/* ── Feature icon ── */
.feat-icon { font-size:28px; margin-bottom:14px; width:56px; height:56px; border-radius:14px; background:rgba(0,194,168,.1); display:flex; align-items:center; justify-content:center; }

/* ── Testimonial ── */
.testimonial { position:relative; }
.testi-quote { font-size:48px; color:var(--teal); line-height:1; margin-bottom:8px; }
.testi-author { display:flex; align-items:center; gap:12px; margin-top:16px; }
.testi-avatar { width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:700; font-size:15px; color:#fff; }

/* ── Page header ── */
.page-header { padding: 52px 0 40px; border-bottom: 1px solid var(--line); background: var(--white); margin-bottom: 40px; }
.page-header h1 { font-size: 36px; }
.page-header p { color: var(--muted); margin-top: 8px; font-size: 16px; }
.breadcrumb { display:flex; gap:8px; align-items:center; font-size:13px; color:var(--muted); margin-bottom:14px; }
.breadcrumb-sep { color:var(--line); }

/* ── Dashboard ── */
.dash-stat { display:flex; align-items:center; gap:16px; }
.dash-stat-icon { width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:20px; }
.dash-stat-val { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; }
.dash-stat-lbl { font-size:13px; color:var(--muted); }

/* ── CV Preview ── */
.cv-preview {
  background:#fff; border:1px solid var(--line); border-radius:8px; padding:24px;
  font-size:12px; line-height:1.5; color:#111;
}
.cv-preview h2 { font-size:16px; border-bottom:2px solid #0a0f1e; padding-bottom:4px; margin:16px 0 8px; }
.cv-preview h3 { font-size:14px; font-weight:700; }

/* ── Section title ── */
.section-title { font-size: 36px; font-weight: 800; margin-bottom: 12px; }
.section-sub { font-size: 16px; color: var(--muted); margin-bottom: 48px; max-width: 520px; }

/* ── Anim ── */
@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes spin { to{transform:rotate(360deg)} }
.fade-up { animation: fadeUp .5s ease both; }
.spinner { width:40px; height:40px; border:3px solid var(--line); border-top-color:var(--teal); border-radius:50%; animation:spin .8s linear infinite; margin:0 auto; }

/* ── Loading overlay ── */
.loading-overlay { position:fixed; inset:0; background:rgba(247,248,252,.9); backdrop-filter:blur(4px); display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:999; gap:16px; }
.loading-text { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:var(--ink); }
.loading-sub { font-size:14px; color:var(--muted); }

/* ── Responsive ── */
@media(max-width:768px){
  .hero-grid,.grid-2,.grid-3,.grid-4{grid-template-columns:1fr;}
  .hero-h1{font-size:38px;}
  .nav-links{display:none;}
  .hero{padding:64px 0;}
}
`;

// ── Icons (emoji-based for zero deps) ──────────────────────────────────────
const IC = {
  logo: "⬡", upload: "📄", analyze: "🔍", check: "✅", star: "⭐",
  arrow: "→", download: "⬇", magic: "✨", chart: "📊", target: "🎯",
  key: "🔑", warn: "⚠️", ok: "✓", x: "✗", bolt: "⚡", shield: "🛡",
  user: "👤", cv: "📋", job: "💼", dashboard: "🏠", price: "💳",
  build: "🏗", letter: "✉", linkedin: "🔗", tips: "💡", blog: "📖",
  eye: "👁", edit: "✏️", trash: "🗑", plus: "+", ai: "🤖",
};

// ── Mock Analysis Data ──────────────────────────────────────────────────────
const mockAnalysis = {
  atsScore: 72,
  matchScore: 68,
  strengths: [
    "Clear contact information at the top",
    "Quantified achievements in experience section",
    "Relevant technical skills listed",
    "Education section properly formatted",
  ],
  weaknesses: [
    "Missing keywords: Agile, Scrum, CI/CD",
    "Professional summary is too generic",
    "No certifications section",
    "Skills not grouped by category",
  ],
  improvements: [
    "Add 8 missing high-priority keywords",
    "Rewrite summary with role-specific language",
    "Add a certifications/courses section",
    "Use stronger action verbs in bullet points",
  ],
  formatting: { score: 80, issues: ["No tables or images detected ✓", "Standard fonts used ✓", "PDF format compatible ✓", "No text boxes detected ✓"] },
  keywords: {
    matched: ["JavaScript", "React", "Node.js", "REST API", "Git", "SQL", "TypeScript"],
    missing: ["Agile", "Scrum", "CI/CD", "Docker", "AWS", "GraphQL", "Jest"],
    suggested: ["TypeScript", "Next.js", "Redux", "Webpack", "Kubernetes"],
  },
  sections: {
    summary: 60, skills: 75, experience: 82, education: 90, certifications: 0,
  },
  problems: ["No images detected ✓", "No tables found ✓", "No colored text ✓", "Standard fonts ✓"],
};

// ── Helper: Score circle ────────────────────────────────────────────────────
function ScoreCircle({ score, size = 140, color = "#00c2a8", label = "ATS Score" }) {
  const r = size / 2 - 10;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="score-circle" style={{ width: size, height: size }}>
      <svg className="score-ring" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={8} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s cubic-bezier(.16,1,.3,1)" }} />
      </svg>
      <div className="score-val" style={{ color }}>{score}</div>
      <div className="score-lbl">{label}</div>
    </div>
  );
}

// ── Helper: Progress bar ────────────────────────────────────────────────────
function ProgressBar({ label, value, max = 100, color = "var(--teal)" }) {
  return (
    <div className="pbar-wrap">
      <div className="pbar-head">
        <span style={{ fontWeight: 600, fontSize: 13 }}>{label}</span>
        <span style={{ color: "var(--muted)", fontSize: 13 }}>{value}%</span>
      </div>
      <div className="pbar-track">
        <div className="pbar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

// ── Loading Screen ──────────────────────────────────────────────────────────
function LoadingScreen({ text = "Analyzing your CV…", sub = "Our AI is scanning for ATS compatibility" }) {
  const [step, setStep] = useState(0);
  const steps = ["Parsing document structure…", "Extracting keywords…", "Comparing with job description…", "Generating improvements…"];
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % steps.length), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="loading-overlay">
      <div className="spinner" />
      <div className="loading-text">{text}</div>
      <div className="loading-sub">{steps[step]}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: Home
// ══════════════════════════════════════════════════════════════════════════════
function HomePage({ nav }) {
  const features = [
    { icon: "📊", title: "ATS Score", desc: "Get an instant ATS compatibility score showing how well your CV will perform." },
    { icon: "🔑", title: "Keyword Matching", desc: "Identify missing keywords and phrases from job descriptions automatically." },
    { icon: "🛡", title: "Formatting Check", desc: "Detect ATS-unfriendly formatting: tables, images, columns, and special fonts." },
    { icon: "⚡", title: "Instant Suggestions", desc: "Receive AI-powered rewrite suggestions to immediately boost your score." },
  ];
  const testimonials = [
    { quote: "My application rate went from 5% to 28% after optimizing with ATSPro. The keyword tool is incredible.", name: "Sarah Chen", role: "Software Engineer", color: "#6366f1" },
    { quote: "I was getting rejected by systems before humans even saw my CV. ATSPro fixed that completely.", name: "Marcus Johnson", role: "Marketing Manager", color: "#f59e0b" },
    { quote: "The CV builder with ATS templates saved me hours and landed me 3 interviews in one week.", name: "Priya Sharma", role: "Data Analyst", color: "#10b981" },
  ];
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="fade-up">
              <div className="hero-eyebrow">AI-Powered CV Optimization</div>
              <h1 className="hero-h1">Optimize Your CV for ATS Systems</h1>
              <p className="hero-sub">75% of resumes are rejected before a human ever reads them. Our AI ensures yours makes it through — every time.</p>
              <div className="hero-actions">
                <button className="btn btn-primary btn-lg" onClick={() => nav("upload")}>Start Now {IC.arrow}</button>
                <button className="btn btn-secondary btn-lg" onClick={() => nav("upload")} style={{ background: "rgba(255,255,255,.08)", color: "#fff", borderColor: "rgba(255,255,255,.2)" }}>Try Free Scan</button>
              </div>
            </div>
            <div className="hero-visual fade-up" style={{ animationDelay: ".15s" }}>
              <div style={{ color: "rgba(255,255,255,.5)", fontSize: 12, marginBottom: 16, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>Live ATS Analysis Preview</div>
              <div className="hero-score-row">
                <div className="hero-metric"><div className="hero-metric-val">72</div><div className="hero-metric-lbl">ATS Score</div></div>
                <div className="hero-metric"><div className="hero-metric-val">68%</div><div className="hero-metric-lbl">Keyword Match</div></div>
                <div className="hero-metric"><div className="hero-metric-val">14</div><div className="hero-metric-lbl">Missing Keys</div></div>
              </div>
              {[["Keyword Coverage", 68], ["Formatting", 80], ["Section Structure", 74], ["Readability", 88]].map(([l, v]) => (
                <div className="hero-bar-row" key={l}>
                  <div className="hero-bar-lbl"><span>{l}</span><span>{v}%</span></div>
                  <div className="hero-bar-track"><div className="hero-bar-fill" style={{ width: `${v}%` }} /></div>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: "12px 16px", background: "rgba(0,194,168,.12)", borderRadius: 10, border: "1px solid rgba(0,194,168,.25)" }}>
                <div style={{ fontSize: 12, color: "var(--teal)", fontWeight: 700, marginBottom: 6 }}>⚡ Top Improvements</div>
                {["Add Agile/Scrum keywords", "Rewrite professional summary", "Add certifications section"].map(s => (
                  <div key={s} style={{ fontSize: 12, color: "rgba(255,255,255,.6)", marginBottom: 3 }}>→ {s}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "var(--white)", borderBottom: "1px solid var(--line)", padding: "32px 0" }}>
        <div className="container">
          <div className="grid-4">
            {[["50K+", "CVs Analyzed"], ["87%", "Interview Rate"], ["3x", "More Callbacks"], ["4.9★", "User Rating"]].map(([v, l]) => (
              <div className="stat-card card-sm" key={l} style={{ border: "none", padding: "0 20px", borderRight: "1px solid var(--line)" }}>
                <div className="stat-num">{v}</div><div className="stat-desc">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: "var(--bg)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="badge badge-teal" style={{ marginBottom: 12 }}>How It Works</div>
            <h2 className="section-title">Three steps to a better CV</h2>
          </div>
          <div className="grid-3">
            {[
              { n: "1", title: "Upload Your CV", desc: "Upload your CV in PDF or DOCX format. We support all standard formats.", icon: "📄" },
              { n: "2", title: "Add Job Description", desc: "Paste the job description you're targeting for precise keyword matching.", icon: "💼" },
              { n: "3", title: "Get Analysis & Improvements", desc: "Receive a detailed ATS score, missing keywords, and AI-powered rewrites.", icon: "✨" },
            ].map(s => (
              <div className="card" key={s.n} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{s.icon}</div>
                <div className="step-num" style={{ margin: "0 auto 14px" }}>{s.n}</div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: "var(--white)" }}>
        <div className="container">
          <div className="badge badge-teal" style={{ marginBottom: 12 }}>Features</div>
          <h2 className="section-title">Everything you need to beat ATS</h2>
          <p className="section-sub">Our comprehensive toolkit covers every aspect of ATS optimization.</p>
          <div className="grid-4">
            {features.map(f => (
              <div className="card" key={f.title}>
                <div className="feat-icon">{f.icon}</div>
                <h3 style={{ fontSize: 17, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ background: "var(--bg)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="badge badge-teal" style={{ marginBottom: 12 }}>Testimonials</div>
            <h2 className="section-title">Real results from real users</h2>
          </div>
          <div className="grid-3">
            {testimonials.map(t => (
              <div className="card testimonial" key={t.name}>
                <div className="testi-quote">"</div>
                <p style={{ color: "var(--slate)", lineHeight: 1.7, fontSize: 15 }}>{t.quote}</p>
                <div className="testi-author">
                  <div className="testi-avatar" style={{ background: t.color }}>{t.name[0]}</div>
                  <div><div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div><div style={{ color: "var(--muted)", fontSize: 13 }}>{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: "var(--ink)", textAlign: "center" }}>
        <div className="container-sm">
          <h2 style={{ fontSize: 40, color: "#fff", marginBottom: 16 }}>Ready to land more interviews?</h2>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: 16, marginBottom: 36 }}>Join 50,000+ professionals who optimized their CVs with ATSPro.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-lg" onClick={() => nav("upload")}>Start Free Today {IC.arrow}</button>
            <button className="btn btn-lg" onClick={() => nav("pricing")} style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "1px solid rgba(255,255,255,.2)" }}>View Pricing</button>
          </div>
        </div>
      </section>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: Upload
// ══════════════════════════════════════════════════════════════════════════════
// ── Tech job taxonomy ──────────────────────────────────────────────────────
const JOB_TAXONOMY = [
  {
    id: "swe", label: "Software Engineering", icon: "💻",
    roles: [
      "Frontend Engineer", "Backend Engineer", "Full Stack Engineer",
      "Mobile Engineer (iOS)", "Mobile Engineer (Android)", "React Native Developer",
      "Embedded Systems Engineer", "Game Developer", "WebAssembly Engineer",
    ],
  },
  {
    id: "data", label: "Data & AI", icon: "🧠",
    roles: [
      "Data Scientist", "ML Engineer", "AI Research Scientist",
      "Data Engineer", "Data Analyst", "Business Intelligence Analyst",
      "NLP Engineer", "Computer Vision Engineer", "MLOps Engineer",
      "Quantitative Analyst", "Prompt Engineer",
    ],
  },
  {
    id: "cloud", label: "Cloud & Infrastructure", icon: "☁️",
    roles: [
      "DevOps Engineer", "Site Reliability Engineer (SRE)",
      "Cloud Architect (AWS)", "Cloud Architect (GCP)", "Cloud Architect (Azure)",
      "Platform Engineer", "Infrastructure Engineer", "Kubernetes Engineer",
      "Terraform / IaC Specialist", "FinOps Engineer",
    ],
  },
  {
    id: "security", label: "Cybersecurity", icon: "🔒",
    roles: [
      "Security Engineer", "Penetration Tester", "Red Team Analyst",
      "SOC Analyst (L1/L2/L3)", "Cloud Security Engineer", "AppSec Engineer",
      "IAM Specialist", "Threat Intelligence Analyst", "GRC Analyst",
      "Cryptography Engineer",
    ],
  },
  {
    id: "product", label: "Product & Design", icon: "🎨",
    roles: [
      "Product Manager", "Technical Product Manager", "UX Designer",
      "UI Designer", "UX Researcher", "Product Designer",
      "Design Systems Engineer", "Interaction Designer", "Accessibility Specialist",
    ],
  },
  {
    id: "platform", label: "Platforms & APIs", icon: "🔌",
    roles: [
      "API Engineer", "Integration Engineer", "Middleware Developer",
      "Salesforce Developer", "SAP Consultant", "ServiceNow Developer",
      "Shopify Developer", "WordPress Engineer", "Blockchain Developer",
      "Web3 / Solidity Developer",
    ],
  },
  {
    id: "qa", label: "QA & Testing", icon: "🧪",
    roles: [
      "QA Engineer (Manual)", "QA Automation Engineer", "SDET",
      "Performance Engineer", "Load Testing Specialist",
      "Test Architect", "QA Lead", "Chaos Engineering Specialist",
    ],
  },
  {
    id: "data_eng", label: "Data Engineering", icon: "🗄️",
    roles: [
      "Data Pipeline Engineer", "Spark / Hadoop Engineer",
      "Kafka Streaming Engineer", "dbt Analyst", "Snowflake Architect",
      "Databricks Engineer", "ETL Developer", "Data Warehouse Architect",
    ],
  },
  {
    id: "it_ops", label: "IT & Operations", icon: "🖥️",
    roles: [
      "IT Support Engineer (L1/L2/L3)", "Network Engineer", "Systems Administrator",
      "Active Directory Specialist", "ITIL Service Manager",
      "Help Desk Technician", "VoIP / Telephony Engineer", "ERP Administrator",
    ],
  },
  {
    id: "other_tech", label: "Other Tech Roles", icon: "⚙️",
    roles: [
      "Technical Writer", "Developer Advocate", "Solutions Architect",
      "Pre-Sales Engineer", "Technical Recruiter", "Engineering Manager",
      "CTO / VP Engineering", "Scrum Master", "Agile Coach",
    ],
  },
];

function UploadPage({ nav }) {
  const [file, setFile] = useState(null);
  const [lang, setLang] = useState("en");
  const [category, setCategory] = useState("");
  const [role, setRole] = useState("");
  const [expLevel, setExpLevel] = useState("");
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => { if (f) setFile(f); };
  const selectedCat = JOB_TAXONOMY.find(c => c.id === category);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><span style={{ cursor: "pointer" }} onClick={() => nav("home")}>Home</span><span className="breadcrumb-sep">/</span><span>Upload CV</span></div>
          <h1>Upload Your CV</h1>
          <p>Upload your CV to get a comprehensive ATS analysis and optimization report.</p>
        </div>
      </div>
      <div className="container" style={{ maxWidth: 760 }}>
        {/* Upload zone */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div
            className={`upload-zone ${drag ? "drag" : ""}`}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current.click()}
          >
            <input ref={fileRef} type="file" accept=".pdf,.docx" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            {file ? (
              <>
                <div className="upload-icon">✅</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{file.name}</div>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>{(file.size / 1024).toFixed(0)} KB · Click to change</div>
              </>
            ) : (
              <>
                <div className="upload-icon">📄</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Drop your CV here</div>
                <div style={{ color: "var(--muted)", fontSize: 14, marginBottom: 12 }}>Supports PDF, DOCX — Max 10 MB</div>
                <button className="btn btn-secondary btn-sm">Browse Files</button>
              </>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="card">
          <h3 style={{ fontSize: 18, marginBottom: 4 }}>Analysis Settings</h3>
          <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 24 }}>The more specific your role, the more accurate your keyword analysis.</p>

          {/* Row 1: Language + Experience */}
          <div className="grid-2" style={{ marginBottom: 4 }}>
            <div className="field">
              <label>CV Language</label>
              <select value={lang} onChange={e => setLang(e.target.value)}>
                <option value="en">🇬🇧 English</option>
                <option value="ar">🇸🇦 Arabic</option>
                <option value="fr">🇫🇷 French</option>
                <option value="de">🇩🇪 German</option>
                <option value="es">🇪🇸 Spanish</option>
                <option value="pt">🇵🇹 Portuguese</option>
                <option value="zh">🇨🇳 Chinese</option>
              </select>
            </div>
            <div className="field">
              <label>Experience Level</label>
              <select value={expLevel} onChange={e => setExpLevel(e.target.value)}>
                <option value="">Select level…</option>
                <option value="intern">Intern / Trainee</option>
                <option value="junior">Junior (0–2 yrs)</option>
                <option value="mid">Mid-level (2–5 yrs)</option>
                <option value="senior">Senior (5–8 yrs)</option>
                <option value="staff">Staff / Principal (8+ yrs)</option>
                <option value="lead">Tech Lead / Architect</option>
                <option value="manager">Engineering Manager</option>
                <option value="director">Director / VP / CTO</option>
              </select>
            </div>
          </div>

          {/* Job Category — icon tiles */}
          <div className="field">
            <label>Job Category</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginTop: 4 }}>
              {JOB_TAXONOMY.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => { setCategory(cat.id); setRole(""); }}
                  style={{
                    padding: "10px 6px", borderRadius: 10, border: `2px solid ${category === cat.id ? "var(--teal)" : "var(--line)"}`,
                    background: category === cat.id ? "rgba(0,194,168,.07)" : "var(--bg)",
                    cursor: "pointer", textAlign: "center", transition: "all .15s",
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{cat.icon}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: category === cat.id ? "var(--teal)" : "var(--slate)", lineHeight: 1.3 }}>{cat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Specific Role — shown only after category picked */}
          {selectedCat && (
            <div className="field" style={{ animation: "fadeUp .25s ease both" }}>
              <label>Specific Role <span style={{ color: "var(--teal)", fontSize: 11 }}>— {selectedCat.label}</span></label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 4 }}>
                {selectedCat.roles.map(r => (
                  <div
                    key={r}
                    onClick={() => setRole(r)}
                    className={`tag ${role === r ? "tag-green" : "tag-gray"}`}
                    style={{ cursor: "pointer", fontWeight: role === r ? 700 : 500, transition: "all .15s", userSelect: "none" }}
                  >
                    {role === r && "✓ "}{r}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected summary pill */}
          {role && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(0,194,168,.06)", border: "1px solid rgba(0,194,168,.2)", borderRadius: 10, marginBottom: 20, fontSize: 13 }}>
              <span style={{ fontSize: 18 }}>{selectedCat?.icon}</span>
              <span style={{ fontWeight: 600, color: "var(--teal)" }}>{role}</span>
              {expLevel && <><span style={{ color: "var(--muted)" }}>·</span><span style={{ color: "var(--muted)" }}>{expLevel}</span></>}
              <button onClick={() => { setRole(""); setCategory(""); setExpLevel(""); }} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
          )}

          <div className="alert alert-info">
            <span>ℹ️</span>
            <span>Selecting a specific role unlocks <strong>role-tailored keyword banks</strong> and ATS scoring rubrics matched to that job type.</span>
          </div>
          <button className="btn btn-primary btn-full btn-lg" onClick={() => nav("jobdesc")}>
            Analyze CV {IC.arrow}
          </button>
        </div>
      </div>
    </>
  );
}

// ── JD Templates ───────────────────────────────────────────────────────────
const JD_TEMPLATES = [
  {
    id: "fe", label: "Frontend Engineer", icon: "💻", category: "swe",
    stack: ["React", "TypeScript", "Next.js", "GraphQL", "CI/CD"],
    text: `We are looking for a Senior Frontend Engineer to join our product team.

Requirements:
• 5+ years of experience building production-grade web applications
• Expert-level proficiency in React, TypeScript, and Next.js
• Experience with GraphQL, REST APIs, and state management (Redux / Zustand)
• Strong understanding of web performance, Core Web Vitals, and accessibility (WCAG 2.1)
• Hands-on experience with CI/CD pipelines (GitHub Actions, CircleCI)
• Familiarity with testing frameworks: Jest, React Testing Library, Cypress
• Experience working in Agile/Scrum environments
• Bonus: experience with Micro-frontends, Webpack module federation, or WebAssembly`,
  },
  {
    id: "be", label: "Backend Engineer", icon: "⚙️", category: "swe",
    stack: ["Node.js", "Python", "PostgreSQL", "Kafka", "Docker"],
    text: `We are hiring a Backend Engineer to design and scale our core services.

Requirements:
• 4+ years of backend engineering experience in Node.js or Python (FastAPI / Django)
• Strong SQL skills (PostgreSQL, query optimization, indexing strategies)
• Experience designing RESTful and gRPC APIs
• Proficiency with message queues: Kafka, RabbitMQ, or AWS SQS
• Docker and Kubernetes for containerized deployments
• Understanding of distributed systems, CAP theorem, and eventual consistency
• Experience with caching layers: Redis, Memcached
• Security best practices: OAuth 2.0, JWT, rate limiting`,
  },
  {
    id: "ml", label: "ML Engineer", icon: "🧠", category: "data",
    stack: ["PyTorch", "Python", "MLflow", "Kubernetes", "Feature Store"],
    text: `Join our AI team as a Machine Learning Engineer building production ML systems.

Requirements:
• 3+ years of ML engineering experience
• Strong Python proficiency; experience with PyTorch or TensorFlow
• Experience productionizing ML models (not just research/notebooks)
• Familiarity with MLOps tooling: MLflow, Weights & Biases, DVC, or Kubeflow
• Experience with feature stores (Feast, Tecton) and data pipelines
• Understanding of model evaluation, A/B testing, and monitoring (data drift, concept drift)
• Kubernetes / Docker for model serving (BentoML, Triton, TorchServe)
• Bonus: LLM fine-tuning, RAG pipelines, or experience with LangChain/LlamaIndex`,
  },
  {
    id: "devops", label: "DevOps / SRE", icon: "☁️", category: "cloud",
    stack: ["Terraform", "Kubernetes", "AWS", "Prometheus", "GitOps"],
    text: `We are looking for a Site Reliability Engineer / DevOps Engineer to own our infrastructure.

Requirements:
• 4+ years in DevOps, SRE, or Platform Engineering
• Deep expertise with Kubernetes (CKA preferred) and Helm charts
• Infrastructure-as-Code using Terraform and Pulumi
• Strong AWS or GCP cloud experience (EC2, EKS, Lambda, RDS, S3)
• Observability stack: Prometheus, Grafana, OpenTelemetry, PagerDuty
• GitOps workflows: ArgoCD, Flux
• Experience with incident management, SLOs, SLAs, and error budgets
• Security hardening: IAM policies, secrets management (Vault, AWS Secrets Manager)`,
  },
  {
    id: "sec", label: "Security Engineer", icon: "🔒", category: "security",
    stack: ["SAST/DAST", "Pentest", "AWS Security", "SIEM", "Zero Trust"],
    text: `We are seeking a Security Engineer to strengthen our application and cloud security posture.

Requirements:
• 3+ years in application security or cloud security
• Experience with SAST/DAST tooling (Semgrep, Checkmarx, Burp Suite)
• Penetration testing skills across web, API, and cloud environments
• Cloud security expertise: AWS Security Hub, GuardDuty, IAM, SCPs
• SIEM platforms: Splunk, Elastic SIEM, or Microsoft Sentinel
• Knowledge of OWASP Top 10, CWE/SANS, and MITRE ATT&CK framework
• Experience with Zero Trust architecture and network segmentation
• Certifications preferred: OSCP, CEH, CISSP, or AWS Security Specialty`,
  },
  {
    id: "data_eng", label: "Data Engineer", icon: "🗄️", category: "data_eng",
    stack: ["Spark", "dbt", "Snowflake", "Kafka", "Airflow"],
    text: `We are hiring a Data Engineer to build and maintain our modern data platform.

Requirements:
• 3+ years of data engineering experience
• Expert-level SQL and Python for data transformation
• Experience with Spark (PySpark) for large-scale batch processing
• dbt (data build tool) for transformation layer management
• Data warehousing on Snowflake, BigQuery, or Redshift
• Streaming pipelines with Kafka or AWS Kinesis
• Workflow orchestration: Apache Airflow or Prefect
• Data quality frameworks: Great Expectations, dbt tests
• Bonus: experience with Databricks, Delta Lake, or Apache Iceberg`,
  },
  {
    id: "pm", label: "Technical PM", icon: "📋", category: "product",
    stack: ["Agile", "Roadmapping", "SQL", "API Design", "OKRs"],
    text: `We are looking for a Technical Product Manager to drive our platform roadmap.

Requirements:
• 4+ years of product management experience in a technical product
• Ability to read and write basic SQL for data analysis
• Strong understanding of REST APIs, system design, and software architecture
• Experience running Agile ceremonies: sprint planning, retrospectives, backlog grooming
• Proficiency with roadmapping tools: Jira, Linear, or Productboard
• Experience defining OKRs, success metrics, and conducting A/B tests
• Excellent stakeholder communication: translating technical concepts to business outcomes
• Prior experience as a software engineer or solutions architect is a strong plus`,
  },
  {
    id: "qa", label: "QA Automation Engineer", icon: "🧪", category: "qa",
    stack: ["Selenium", "Playwright", "Python", "CI/CD", "Performance Testing"],
    text: `We are looking for a QA Automation Engineer to ensure quality at scale.

Requirements:
• 3+ years of test automation experience
• Proficiency with Playwright or Selenium WebDriver
• API testing using Postman, RestAssured, or pytest
• Performance and load testing: k6, Locust, or JMeter
• CI/CD integration of test suites (GitHub Actions, Jenkins)
• Experience with BDD frameworks: Cucumber, Behave
• Mobile testing: Appium or XCUITest / Espresso
• Shift-left testing mindset; experience writing testable code specs`,
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: Job Description
// ══════════════════════════════════════════════════════════════════════════════
function JobDescPage({ nav }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [filterCat, setFilterCat] = useState("all");

  const analyze = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); nav("results"); }, 2800);
  };

  const applyTemplate = (tpl) => {
    setActiveTemplate(tpl.id);
    setText(tpl.text);
  };

  const categories = [
    { id: "all", label: "All Roles" },
    { id: "swe", label: "💻 Engineering" },
    { id: "data", label: "🧠 AI / Data" },
    { id: "cloud", label: "☁️ Cloud / DevOps" },
    { id: "security", label: "🔒 Security" },
    { id: "data_eng", label: "🗄️ Data Eng." },
    { id: "product", label: "🎨 Product" },
    { id: "qa", label: "🧪 QA" },
  ];

  const filtered = filterCat === "all" ? JD_TEMPLATES : JD_TEMPLATES.filter(t => t.category === filterCat);

  return (
    <>
      {loading && <LoadingScreen />}
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <span style={{ cursor: "pointer" }} onClick={() => nav("home")}>Home</span>
            <span className="breadcrumb-sep">/</span>
            <span style={{ cursor: "pointer" }} onClick={() => nav("upload")}>Upload CV</span>
            <span className="breadcrumb-sep">/</span>
            <span>Job Description</span>
          </div>
          <h1>Add Job Description</h1>
          <p>Paste a JD or pick a specialist template to get precision keyword matching.</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 960 }}>
        {/* Template picker */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
            <div>
              <h3 style={{ marginBottom: 2 }}>Quick Start Templates</h3>
              <p style={{ color: "var(--muted)", fontSize: 13 }}>Select a role template to pre-fill the job description with specialist requirements.</p>
            </div>
            <span className="badge badge-teal">8 Tech Roles</span>
          </div>

          {/* Category filter pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setFilterCat(c.id)}
                className="btn btn-sm"
                style={{
                  background: filterCat === c.id ? "var(--teal)" : "var(--bg)",
                  color: filterCat === c.id ? "#fff" : "var(--slate)",
                  border: `1.5px solid ${filterCat === c.id ? "var(--teal)" : "var(--line)"}`,
                  borderRadius: 20, fontWeight: 600,
                }}
              >{c.label}</button>
            ))}
          </div>

          {/* Template cards grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 10 }}>
            {filtered.map(tpl => (
              <div
                key={tpl.id}
                onClick={() => applyTemplate(tpl)}
                style={{
                  padding: "14px 16px", borderRadius: 12, cursor: "pointer", transition: "all .15s",
                  border: `2px solid ${activeTemplate === tpl.id ? "var(--teal)" : "var(--line)"}`,
                  background: activeTemplate === tpl.id ? "rgba(0,194,168,.06)" : "var(--bg)",
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 6 }}>{tpl.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: activeTemplate === tpl.id ? "var(--teal)" : "var(--ink)" }}>{tpl.label}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {tpl.stack.slice(0, 3).map(s => (
                    <span key={s} className="badge badge-gray" style={{ fontSize: 10 }}>{s}</span>
                  ))}
                  {tpl.stack.length > 3 && <span className="badge badge-gray" style={{ fontSize: 10 }}>+{tpl.stack.length - 3}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* JD Text + sidebar */}
        <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label style={{ display: "flex", justifyContent: "space-between" }}>
                  Job Description Text
                  {text && <span style={{ color: "var(--muted)", fontWeight: 400 }}>{text.split(/\s+/).filter(Boolean).length} words</span>}
                </label>
                <textarea
                  value={text}
                  onChange={e => { setText(e.target.value); setActiveTemplate(null); }}
                  placeholder={"Paste the full job description here, or select a template above…"}
                  style={{ minHeight: 320, marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>
            </div>

            <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 13, margin: "4px 0 12px" }}>— OR upload a file —</div>
            <div className="upload-zone" style={{ padding: "20px" }} onClick={() => {}}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>📎</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Upload JD File (PDF / DOCX)</div>
            </div>
          </div>

          {/* Right: keyword preview + action */}
          <div>
            {activeTemplate && (() => {
              const tpl = JD_TEMPLATES.find(t => t.id === activeTemplate);
              return (
                <div className="card" style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
                    <span style={{ fontSize: 24 }}>{tpl.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{tpl.label}</div>
                      <div style={{ color: "var(--muted)", fontSize: 12 }}>Template loaded</div>
                    </div>
                    <span className="badge badge-teal" style={{ marginLeft: "auto" }}>Active</span>
                  </div>
                  <div style={{ marginBottom: 10, fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em" }}>Key Tech Stack</div>
                  <div className="tag-wrap" style={{ marginBottom: 14 }}>
                    {tpl.stack.map(s => <span key={s} className="tag tag-blue">{s}</span>)}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", padding: "10px 12px", background: "var(--bg)", borderRadius: 8 }}>
                    🎯 Our AI will extract additional keywords from the full description and match them against your CV.
                  </div>
                </div>
              );
            })()}

            <div className="card">
              <div className="alert alert-success" style={{ marginBottom: 14 }}>
                <span>✅</span>
                <span>CV: <strong>software_engineer_cv.pdf</strong> ready</span>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>Analysis will include</div>
                {["Role-specific keyword bank", "ATS scoring rubric for this role", "Tailored bullet point rewrites", "Stack-specific skill gap analysis"].map(f => (
                  <div key={f} style={{ display: "flex", gap: 8, fontSize: 13, marginBottom: 6 }}>
                    <span style={{ color: "var(--teal)", fontWeight: 700 }}>✓</span>{f}
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-secondary" onClick={() => nav("upload")}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={analyze} disabled={!text.trim()}>
                  Compare CV with Job {IC.arrow}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: Results
// ══════════════════════════════════════════════════════════════════════════════
function ResultsPage({ nav }) {
  const [tab, setTab] = useState("overview");
  const d = mockAnalysis;
  const tabs = ["overview", "formatting", "keywords", "sections", "problems"];

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><span style={{ cursor: "pointer" }} onClick={() => nav("home")}>Home</span><span className="breadcrumb-sep">/</span><span>Analysis Results</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
            <div><h1>Analysis Results</h1><p>software_engineer_cv.pdf · Senior Frontend Engineer at Acme Corp</p></div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => nav("improve")}>✨ Improve CV</button>
              <button className="btn btn-primary" onClick={() => nav("improve")}>Apply Improvements {IC.arrow}</button>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        {/* Scores */}
        <div className="grid-3" style={{ marginBottom: 32 }}>
          <div className="card" style={{ textAlign: "center", padding: "32px 20px" }}>
            <ScoreCircle score={d.atsScore} color="#00c2a8" label="ATS Score" />
            <div style={{ marginTop: 16 }}>
              <span className="badge badge-amber">Needs Work</span>
            </div>
          </div>
          <div className="card" style={{ textAlign: "center", padding: "32px 20px" }}>
            <ScoreCircle score={d.matchScore} color="#3b82f6" label="Match Score" />
            <div style={{ marginTop: 16 }}>
              <span className="badge badge-blue">Moderate Match</span>
            </div>
          </div>
          <div className="card" style={{ padding: "24px" }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Quick Stats</div>
            {[["Matched Keywords", "7 / 14", "#10b981"], ["Missing Keywords", "7 critical", "#ef4444"], ["Formatting Issues", "0 found", "#10b981"], ["Section Coverage", "4 / 6", "#f59e0b"]].map(([l, v, c]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 }}>
                <span style={{ color: "var(--muted)" }}>{l}</span>
                <span style={{ fontWeight: 700, color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {tabs.map(t => <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="grid-2">
            <div className="card">
              <h3 style={{ marginBottom: 16, display: "flex", gap: 8 }}><span>✅</span> Strengths</h3>
              {d.strengths.map(s => <div key={s} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 14 }}><span style={{ color: "var(--green)", fontWeight: 700 }}>✓</span>{s}</div>)}
            </div>
            <div className="card">
              <h3 style={{ marginBottom: 16, display: "flex", gap: 8 }}><span>⚠️</span> Weaknesses</h3>
              {d.weaknesses.map(s => <div key={s} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 14 }}><span style={{ color: "var(--red)", fontWeight: 700 }}>✗</span>{s}</div>)}
            </div>
            <div className="card" style={{ gridColumn: "1/-1" }}>
              <h3 style={{ marginBottom: 16 }}>⚡ Key Improvements</h3>
              <div className="grid-2">
                {d.improvements.map((s, i) => (
                  <div key={s} style={{ display: "flex", gap: 12, padding: "12px 14px", background: "var(--bg)", borderRadius: 10, fontSize: 14 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--teal)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Formatting */}
        {tab === "formatting" && (
          <div className="grid-2">
            <div className="card">
              <h3 style={{ marginBottom: 20 }}>Formatting Score</h3>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <ScoreCircle score={d.formatting.score} color="#10b981" label="Format Score" size={120} />
              </div>
              <div className="alert alert-success">All major formatting checks passed! Your CV is ATS-readable.</div>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: 16 }}>Formatting Checks</h3>
              {d.formatting.issues.map(i => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--line)", fontSize: 14 }}>
                  <span style={{ color: "var(--green)" }}>✓</span>{i}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Keywords */}
        {tab === "keywords" && (
          <div>
            <div className="grid-3" style={{ marginBottom: 24 }}>
              {[["Matched", d.keywords.matched.length, "green"], ["Missing", d.keywords.missing.length, "red"], ["Suggested", d.keywords.suggested.length, "blue"]].map(([l, v, c]) => (
                <div className="card" key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontFamily: "'Syne',sans-serif", fontWeight: 800, color: `var(--${c})` }}>{v}</div>
                  <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{l} Keywords</div>
                </div>
              ))}
            </div>
            <div className="grid-3">
              <div className="card">
                <h4 style={{ marginBottom: 14, color: "var(--green)" }}>✓ Matched Keywords</h4>
                <div className="tag-wrap">{d.keywords.matched.map(k => <span className="tag tag-green" key={k}>{k}</span>)}</div>
              </div>
              <div className="card">
                <h4 style={{ marginBottom: 14, color: "var(--red)" }}>✗ Missing Keywords</h4>
                <div className="tag-wrap">{d.keywords.missing.map(k => <span className="tag tag-red" key={k}>{k}</span>)}</div>
              </div>
              <div className="card">
                <h4 style={{ marginBottom: 14, color: "var(--blue)" }}>+ Suggested Keywords</h4>
                <div className="tag-wrap">{d.keywords.suggested.map(k => <span className="tag tag-blue" key={k}>{k}</span>)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Sections */}
        {tab === "sections" && (
          <div className="card">
            <h3 style={{ marginBottom: 24 }}>Section Analysis</h3>
            {Object.entries(d.sections).map(([s, v]) => (
              <ProgressBar key={s} label={s.charAt(0).toUpperCase() + s.slice(1)} value={v}
                color={v >= 80 ? "var(--green)" : v >= 50 ? "var(--amber)" : "var(--red)"} />
            ))}
            <div style={{ marginTop: 24, padding: 16, background: "var(--bg)", borderRadius: 10 }}>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>💡 Recommendation</div>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>Add a Certifications section to increase your ATS score by approximately 8-12 points. Many ATS systems specifically scan for this section.</div>
            </div>
          </div>
        )}

        {/* Problems */}
        {tab === "problems" && (
          <div className="grid-2">
            {d.problems.map(p => (
              <div className="card" key={p} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(16,185,129,.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", fontSize: 18 }}>✓</div>
                <span style={{ fontSize: 14 }}>{p}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 32, display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn btn-secondary" onClick={() => nav("jobdesc")}>← Re-analyze</button>
          <button className="btn btn-primary btn-lg" onClick={() => nav("improve")}>✨ Improve My CV {IC.arrow}</button>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AI CV IMPROVEMENT ENGINE
// ══════════════════════════════════════════════════════════════════════════════

const SAMPLE_CV = `Name: Alex Johnson
Title: Software Engineer
Email: alex@email.com | Phone: +1 555 0100 | Location: San Francisco, CA

PROFESSIONAL SUMMARY
Experienced software engineer with a background in web development and a passion for building great products. Good at React and Node.js. Worked on several projects.

SKILLS
JavaScript, React, CSS, Node.js, Git, SQL, HTML

EXPERIENCE
Tech Corp — Software Engineer (2021–Present)
- Worked on the frontend of the main product application.
- Helped with code reviews and mentoring junior developers.
- Fixed bugs and improved performance.
- Participated in team meetings and sprint planning.

StartupXYZ — Junior Developer (2019–2021)
- Built features for the web app.
- Worked with the backend team on APIs.
- Wrote some tests.

EDUCATION
University of California — B.Sc. Computer Science (2019)`;

const SAMPLE_JD = `Senior Frontend Engineer at Acme Corp

We are looking for a Senior Frontend Engineer with 5+ years of experience.

Requirements:
• Expert-level React, TypeScript, and Next.js
• Experience with GraphQL, REST APIs, Redux/Zustand
• Strong knowledge of web performance and Core Web Vitals
• Hands-on with CI/CD pipelines (GitHub Actions, CircleCI)
• Testing: Jest, React Testing Library, Cypress
• Agile/Scrum environments
• Bonus: Micro-frontends, Webpack, WebAssembly`;

async function callClaudeAPI(systemPrompt, userPrompt, onChunk) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 4000,
      stream: true,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
    for (const line of lines) {
      try {
        const json = JSON.parse(line.slice(6));
        if (json.type === "content_block_delta" && json.delta?.text) {
          fullText += json.delta.text;
          onChunk(fullText);
        }
      } catch {}
    }
  }
  return fullText;
}

// ── AI Chat Panel ─────────────────────────────────────────────────────────
function AIChatPanel({ cvText, jdText, analysisData }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your AI CV coach. I've analyzed your CV and the job description. Ask me anything — I can rewrite specific sections, explain why certain keywords matter, suggest better bullet points, or help you tailor your summary. What would you like to improve first?" }
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streamText]);

  const quickPrompts = [
    "Rewrite my professional summary for this role",
    "Make my bullet points more impactful with metrics",
    "Which missing keywords are most critical?",
    "Write a stronger skills section for this JD",
    "How do I explain my career gap?",
    "Give me 5 ATS-optimized bullet points for my experience",
  ];

  const send = async (text) => {
    if (!text.trim() || streaming) return;
    const userMsg = text.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    setStreaming(true);
    setStreamText("");

    const system = `You are an elite CV optimization expert and ATS specialist with 15+ years of experience in technical recruitment. 
You have access to the candidate's CV and the target job description. 
Give highly specific, actionable advice. When rewriting content, always produce complete, ready-to-paste text.
Format your responses clearly with headers when listing multiple items.
Always justify why changes improve ATS performance with specific keyword and scoring reasoning.
Be direct, expert, and extremely helpful.

CANDIDATE'S CURRENT CV:
${cvText}

TARGET JOB DESCRIPTION:
${jdText}

ATS ANALYSIS RESULTS:
- ATS Score: ${analysisData.atsScore}/100
- Match Score: ${analysisData.matchScore}/100  
- Matched Keywords: ${analysisData.keywords.matched.join(", ")}
- Missing Keywords: ${analysisData.keywords.missing.join(", ")}
- Suggested Keywords: ${analysisData.keywords.suggested.join(", ")}`;

    const history = messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }));

    try {
      await callClaudeAPI(system, [...history, { role: "user", content: userMsg }].map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n\n"), (chunk) => {
        setStreamText(chunk);
      });
      setMessages(m => [...m, { role: "assistant", text: streamText || "Done!" }]);
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", text: `Error: ${e.message}. Please check your API connection.` }]);
    }
    setStreamText("");
    setStreaming(false);
  };

  // fix: capture streamText at send time
  const sendFixed = async (text) => {
    if (!text.trim() || streaming) return;
    const userMsg = text.trim();
    setInput("");
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    setStreaming(true);

    const system = `You are an elite CV optimization expert and ATS specialist with 15+ years of experience in technical recruitment at top tech companies (FAANG, unicorn startups, consulting firms).

You have access to the candidate's CV and the target job description. Your job is to give highly specific, expert-level advice that immediately improves ATS pass rates and human reviewer appeal.

Rules:
- When rewriting content, always produce COMPLETE, ready-to-paste text — never partial examples
- Always explain WHY each change improves ATS score with keyword/scoring reasoning  
- Use quantified achievements whenever possible (%, $, time saved, team size)
- Prioritize keywords from the JD that are missing from the CV
- Format responses clearly with bold headers for sections
- Be direct, precise, and extremely helpful — no filler

CANDIDATE'S CURRENT CV:
${cvText}

TARGET JOB DESCRIPTION:
${jdText}

ATS ANALYSIS:
- ATS Score: ${analysisData.atsScore}/100 (target: 85+)
- Match Score: ${analysisData.matchScore}/100
- Matched Keywords: ${analysisData.keywords.matched.join(", ")}
- CRITICAL Missing Keywords: ${analysisData.keywords.missing.join(", ")}
- Suggested Additions: ${analysisData.keywords.suggested.join(", ")}
- Weak Sections: ${Object.entries(analysisData.sections).filter(([,v]) => v < 75).map(([k,v]) => `${k} (${v}%)`).join(", ")}`;

    const conversationHistory = [...messages, { role: "user", text: userMsg }];
    const apiMessages = conversationHistory.map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.text
    }));

    let accumulated = "";
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 2000,
          stream: true,
          system,
          messages: apiMessages,
        }),
      });

      if (!response.ok) throw new Error(`API ${response.status}`);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n").filter(l => l.startsWith("data: "))) {
          try {
            const json = JSON.parse(line.slice(6));
            if (json.type === "content_block_delta" && json.delta?.text) {
              accumulated += json.delta.text;
              setStreamText(accumulated);
            }
          } catch {}
        }
      }
      setMessages(m => [...m, { role: "assistant", text: accumulated }]);
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", text: `⚠️ API Error: ${e.message}` }]);
    }
    setStreamText("");
    setStreaming(false);
  };

  const renderText = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) return <div key={i} style={{ fontWeight: 800, fontSize: 14, marginTop: 12, marginBottom: 4, color: "var(--ink)", fontFamily: "'Syne', sans-serif" }}>{line.slice(2, -2)}</div>;
      if (line.startsWith("• ") || line.startsWith("- ")) return <div key={i} style={{ display: "flex", gap: 8, marginBottom: 3, fontSize: 14 }}><span style={{ color: "var(--teal)", flexShrink: 0, fontWeight: 700 }}>→</span><span>{line.slice(2)}</span></div>;
      if (line.trim() === "") return <div key={i} style={{ height: 6 }} />;
      return <div key={i} style={{ fontSize: 14, lineHeight: 1.7 }}>{line}</div>;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 580, background: "var(--white)", border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "14px 18px", background: "linear-gradient(135deg, #0a0f1e, #1c243a)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,194,168,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "'Syne', sans-serif" }}>AI CV Coach</div>
          <div style={{ color: "var(--teal)", fontSize: 11, fontWeight: 600 }}>● Powered by Claude · Context-aware</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <span className="badge badge-teal" style={{ fontSize: 10 }}>CV Loaded</span>
          <span className="badge badge-blue" style={{ fontSize: 10 }}>JD Loaded</span>
        </div>
      </div>

      {/* Quick prompts */}
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--line)", display: "flex", gap: 6, flexWrap: "wrap", background: "var(--bg)" }}>
        {quickPrompts.map(p => (
          <button key={p} onClick={() => sendFixed(p)} disabled={streaming}
            style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, border: "1px solid var(--line)", background: "var(--white)", color: "var(--slate)", cursor: streaming ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, whiteSpace: "nowrap", transition: "all .15s" }}
            onMouseEnter={e => { if (!streaming) { e.target.style.borderColor = "var(--teal)"; e.target.style.color = "var(--teal)"; }}}
            onMouseLeave={e => { e.target.style.borderColor = "var(--line)"; e.target.style.color = "var(--slate)"; }}
          >{p}</button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 10, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, var(--teal), #00a890)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginTop: 2 }}>🤖</div>
            )}
            <div style={{
              maxWidth: "82%", padding: "12px 16px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: m.role === "user" ? "linear-gradient(135deg, var(--teal), var(--teal2))" : "var(--bg)",
              color: m.role === "user" ? "#fff" : "var(--ink)",
              border: m.role === "assistant" ? "1px solid var(--line)" : "none",
              fontSize: 14, lineHeight: 1.6,
            }}>
              {m.role === "assistant" ? renderText(m.text) : m.text}
            </div>
            {m.role === "user" && (
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginTop: 2 }}>👤</div>
            )}
          </div>
        ))}

        {/* Streaming message */}
        {streaming && streamText && (
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, var(--teal), #00a890)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginTop: 2 }}>🤖</div>
            <div style={{ maxWidth: "82%", padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: "var(--bg)", border: "1px solid var(--teal)", fontSize: 14, lineHeight: 1.6 }}>
              {renderText(streamText)}
              <span style={{ display: "inline-block", width: 8, height: 14, background: "var(--teal)", marginLeft: 2, animation: "blink 0.7s step-end infinite", verticalAlign: "text-bottom" }} />
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {streaming && !streamText && (
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, var(--teal), #00a890)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🤖</div>
            <div style={{ padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: "var(--bg)", border: "1px solid var(--line)", display: "flex", gap: 4, alignItems: "center" }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: "var(--teal)", animation: `bounce 1s ease ${i * 0.15}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px 14px", borderTop: "1px solid var(--line)", display: "flex", gap: 10, background: "var(--white)" }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendFixed(input)}
          placeholder="Ask the AI to rewrite a section, improve bullet points, add keywords…"
          disabled={streaming}
          style={{ flex: 1, padding: "10px 14px", border: "1.5px solid var(--line)", borderRadius: 10, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color .2s" }}
          onFocus={e => e.target.style.borderColor = "var(--teal)"}
          onBlur={e => e.target.style.borderColor = "var(--line)"}
        />
        <button onClick={() => sendFixed(input)} disabled={streaming || !input.trim()}
          style={{ width: 40, height: 40, borderRadius: 10, background: input.trim() && !streaming ? "var(--teal)" : "var(--line)", border: "none", cursor: input.trim() && !streaming ? "pointer" : "not-allowed", color: input.trim() && !streaming ? "#fff" : "var(--muted)", fontSize: 18, transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {streaming ? "⏳" : "→"}
        </button>
      </div>
    </div>
  );
}

// ── AI Section Rewriter ────────────────────────────────────────────────────
function AISectionRewriter({ section, original, jdText, analysisData, onApply }) {
  const [improved, setImproved] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [applied, setApplied] = useState(false);
  const [edited, setEdited] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  const rewrite = async () => {
    setLoading(true);
    setStreaming(true);
    setImproved("");
    setApplied(false);

    const prompts = {
      summary: `Rewrite this professional summary for an ATS system targeting the role described in the job description.
Rules: 2–4 sentences max. Open with years of experience + exact job title. Include 3–5 keywords from the JD naturally. Add 1-2 quantified achievements. End with value proposition.
ONLY output the rewritten summary — no explanation, no preamble.`,
      skills: `Rewrite this skills section for maximum ATS keyword matching against the job description.
Rules: Include ALL critical keywords from the JD (especially the missing ones). Group by category (Languages, Frameworks, Cloud, Tools, Methodologies). Keep existing relevant skills. Add missing high-priority keywords.
Format: Category: skill1, skill2, skill3 (one category per line)
ONLY output the rewritten skills section — no explanation.`,
      experience: `Rewrite these experience bullet points using the STAR method and strong action verbs.
Rules: Every bullet must start with a past-tense action verb (Engineered, Architected, Delivered, Spearheaded, etc.). Add quantified metrics (%, $, time, team size) to every bullet. Weave in missing JD keywords naturally. Remove weak verbs (worked on, helped, participated). Aim for 4–6 bullets per role.
ONLY output the improved bullet points — no explanation.`,
      keywords: `Generate an optimized additional skills/tools section based on the missing keywords from the job description.
Rules: Only include keywords directly relevant to this role. Group logically. Make it ATS-scannable.
ONLY output the formatted skills addition — no explanation.`,
    };

    const system = `You are a world-class CV writer specializing in ATS optimization for technical roles. Your rewrites are direct, measurable, and keyword-rich. You ONLY output the requested content — no meta-commentary.

JOB DESCRIPTION:
${jdText}

MISSING KEYWORDS TO WEAVE IN: ${analysisData.keywords.missing.join(", ")}
KEYWORDS ALREADY PRESENT: ${analysisData.keywords.matched.join(", ")}`;

    const userPrompt = `${prompts[section.id] || prompts.experience}

ORIGINAL CONTENT:
${original}`;

    let accumulated = "";
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 800,
          stream: true,
          system,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n").filter(l => l.startsWith("data: "))) {
          try {
            const json = JSON.parse(line.slice(6));
            if (json.type === "content_block_delta" && json.delta?.text) {
              accumulated += json.delta.text;
              setImproved(accumulated);
            }
          } catch {}
        }
      }
      setEdited(accumulated);
    } catch (e) {
      setImproved(`Error: ${e.message}`);
    }
    setLoading(false);
    setStreaming(false);
  };

  const apply = () => {
    setApplied(true);
    onApply(section.id, showEdit ? edited : improved);
  };

  return (
    <div style={{
      border: `2px solid ${applied ? "var(--teal)" : "var(--line)"}`,
      borderRadius: 16, overflow: "hidden", marginBottom: 20, transition: "border-color .3s",
      background: applied ? "rgba(0,194,168,.02)" : "var(--white)",
    }}>
      {/* Section header */}
      <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", background: applied ? "rgba(0,194,168,.05)" : "var(--white)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `rgba(${section.color},0.12)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{section.icon}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, fontFamily: "'Syne', sans-serif" }}>{section.label}</div>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>{section.desc}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {applied && <span className="badge badge-teal">✓ Applied</span>}
          <span className="badge" style={{ background: `rgba(${section.color},0.1)`, color: `rgb(${section.color})`, fontSize: 11 }}>+{section.scoreBoost} pts</span>
          {!loading && !improved && (
            <button className="btn btn-primary btn-sm" onClick={rewrite} style={{ gap: 6 }}>
              <span>🤖</span> AI Rewrite
            </button>
          )}
          {(loading || improved) && !applied && (
            <button className="btn btn-ghost btn-sm" onClick={rewrite} title="Regenerate">🔄</button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "18px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: improved ? "1fr 1fr" : "1fr", gap: 16 }}>
          {/* Original */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--red)", display: "inline-block" }} /> Original
            </div>
            <div style={{ background: "rgba(239,68,68,.03)", border: "1px solid rgba(239,68,68,.1)", borderRadius: 10, padding: "14px 16px", fontSize: 13.5, color: "var(--slate)", lineHeight: 1.75, minHeight: 80, whiteSpace: "pre-wrap" }}>
              {original}
            </div>
          </div>

          {/* Improved */}
          {improved && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--teal)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--teal)", display: "inline-block" }} />
                AI Improved {streaming && <span style={{ width: 6, height: 6, borderRadius: 3, background: "var(--teal)", display: "inline-block", animation: "blink 0.7s step-end infinite" }} />}
              </div>
              {showEdit ? (
                <textarea
                  value={edited}
                  onChange={e => setEdited(e.target.value)}
                  style={{ width: "100%", background: "rgba(0,194,168,.04)", border: "1.5px solid var(--teal)", borderRadius: 10, padding: "14px 16px", fontSize: 13.5, lineHeight: 1.75, minHeight: 120, fontFamily: "'DM Sans', sans-serif", outline: "none", color: "var(--ink)" }}
                />
              ) : (
                <div style={{ background: "rgba(0,194,168,.04)", border: "1.5px solid rgba(0,194,168,.25)", borderRadius: 10, padding: "14px 16px", fontSize: 13.5, color: "var(--ink)", lineHeight: 1.75, minHeight: 80, whiteSpace: "pre-wrap" }}>
                  {improved}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions row */}
        {improved && !streaming && !applied && (
          <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button className="btn btn-ghost btn-sm" onClick={() => { setShowEdit(!showEdit); setEdited(improved); }}>
              {showEdit ? "👁 Preview" : "✏️ Edit"}</button>
            <button className="btn btn-ghost btn-sm" onClick={rewrite}>🔄 Regenerate</button>
            <button className="btn btn-primary btn-sm" onClick={apply}>✅ Apply This Version</button>
          </div>
        )}
        {applied && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => { setApplied(false); setImproved(""); }}>↩ Undo</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: Improve (AI-Powered)
// ══════════════════════════════════════════════════════════════════════════════
function ImprovePage({ nav }) {
  const [view, setView] = useState("rewriter"); // "rewriter" | "chat"
  const [appliedSections, setAppliedSections] = useState({});
  const [scoreBoost, setScoreBoost] = useState(0);

  const cvText = SAMPLE_CV;
  const jdText = SAMPLE_JD;
  const analysisData = mockAnalysis;

  const sections = [
    { id: "summary", label: "Professional Summary", icon: "📝", desc: "Rewrite with role-specific keywords & value prop", scoreBoost: 8, color: "59,130,246",
      original: "Experienced software engineer with a background in web development and a passion for building great products. Good at React and Node.js. Worked on several projects." },
    { id: "skills", label: "Skills & Technologies", icon: "⚡", desc: "Add missing keywords & organize by category", scoreBoost: 12, color: "0,194,168",
      original: "JavaScript, React, CSS, Node.js, Git, SQL, HTML" },
    { id: "experience", label: "Experience Bullet Points", icon: "💼", desc: "STAR method, strong verbs & quantified metrics", scoreBoost: 10, color: "139,92,246",
      original: "- Worked on the frontend of the main product application.\n- Helped with code reviews and mentoring junior developers.\n- Fixed bugs and improved performance.\n- Participated in team meetings and sprint planning." },
    { id: "keywords", label: "Missing Keywords Section", icon: "🔑", desc: "Generate an ATS-targeted additional skills block", scoreBoost: 6, color: "245,158,11",
      original: "(No certifications or additional tools section currently in CV)" },
  ];

  const totalPossibleBoost = sections.reduce((a, s) => a + s.scoreBoost, 0);
  const appliedCount = Object.values(appliedSections).filter(Boolean).length;
  const projectedScore = Math.min(99, mockAnalysis.atsScore + scoreBoost);

  const handleApply = (id, content) => {
    setAppliedSections(prev => ({ ...prev, [id]: content }));
    const section = sections.find(s => s.id === id);
    if (section) setScoreBoost(prev => prev + section.scoreBoost);
  };

  return (
    <>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
      `}</style>

      <div className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <span style={{ cursor: "pointer" }} onClick={() => nav("home")}>Home</span>
            <span className="breadcrumb-sep">/</span>
            <span style={{ cursor: "pointer" }} onClick={() => nav("results")}>Results</span>
            <span className="breadcrumb-sep">/</span>
            <span>AI Improve</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 14 }}>
            <div>
              <h1>AI-Powered CV Improvement</h1>
              <p>Claude analyzes your CV against the JD and rewrites each section with precision.</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => nav("results")}>← Results</button>
              <button className="btn btn-dark">⬇ Download Improved CV</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Score dashboard */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 28 }}>
          <div className="card" style={{ textAlign: "center", padding: "20px 14px" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, color: "var(--muted)" }}>{mockAnalysis.atsScore}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>Current ATS Score</div>
          </div>
          <div className="card" style={{ textAlign: "center", padding: "20px 14px", border: "2px solid var(--teal)", background: "rgba(0,194,168,.04)" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, color: "var(--teal)" }}>{projectedScore}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>Projected Score</div>
            {scoreBoost > 0 && <div style={{ fontSize: 11, color: "var(--teal)", fontWeight: 700, marginTop: 4 }}>+{scoreBoost} pts gained</div>}
          </div>
          <div className="card" style={{ textAlign: "center", padding: "20px 14px" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, color: "var(--blue)" }}>{appliedCount} / {sections.length}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>Sections Improved</div>
          </div>
          <div className="card" style={{ textAlign: "center", padding: "20px 14px" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, color: "var(--amber)" }}>+{totalPossibleBoost}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>Max Score Gain</div>
          </div>
        </div>

        {/* Tab toggle */}
        <div style={{ display: "flex", gap: 0, marginBottom: 28, background: "var(--white)", borderRadius: 12, border: "1px solid var(--line)", overflow: "hidden", width: "fit-content" }}>
          <button onClick={() => setView("rewriter")} style={{ padding: "10px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none", fontFamily: "'DM Sans',sans-serif", background: view === "rewriter" ? "var(--teal)" : "transparent", color: view === "rewriter" ? "#fff" : "var(--muted)", transition: "all .2s" }}>
            🤖 Section Rewriter
          </button>
          <button onClick={() => setView("chat")} style={{ padding: "10px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none", fontFamily: "'DM Sans',sans-serif", background: view === "chat" ? "var(--teal)" : "transparent", color: view === "chat" ? "#fff" : "var(--muted)", transition: "all .2s" }}>
            💬 AI Coach Chat
          </button>
        </div>

        {view === "rewriter" && (
          <div>
            <div className="alert alert-info" style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 16 }}>🤖</span>
              <span>Click <strong>"AI Rewrite"</strong> on any section — Claude will stream a precision-optimized version in real time, tailored to the job description. Edit before applying.</span>
            </div>

            {sections.map(section => (
              <AISectionRewriter
                key={section.id}
                section={section}
                original={section.original}
                jdText={jdText}
                analysisData={analysisData}
                onApply={handleApply}
              />
            ))}

            {appliedCount === sections.length && (
              <div style={{ textAlign: "center", padding: "32px 20px", background: "linear-gradient(135deg, rgba(0,194,168,.08), rgba(16,185,129,.08))", border: "2px solid var(--teal)", borderRadius: 20, marginTop: 8 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>All sections optimized!</div>
                <div style={{ color: "var(--muted)", marginBottom: 24 }}>Your CV is now ATS-optimized. Estimated score: {projectedScore}/100</div>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="btn btn-primary btn-lg">⬇ Download Improved CV</button>
                  <button className="btn btn-dark btn-lg" onClick={() => nav("builder")}>🏗 Open in Builder</button>
                </div>
              </div>
            )}
          </div>
        )}

        {view === "chat" && (
          <AIChatPanel cvText={cvText} jdText={jdText} analysisData={analysisData} />
        )}

        {view === "rewriter" && appliedCount < sections.length && (
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32 }}>
            <button className="btn btn-secondary btn-lg">⬇ Download Improved CV</button>
            <button className="btn btn-dark btn-lg" onClick={() => nav("builder")}>🏗 Open in CV Builder</button>
          </div>
        )}
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: CV Builder
// ══════════════════════════════════════════════════════════════════════════════
function BuilderPage({ nav }) {
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState("clean");
  const [form, setForm] = useState({
    name: "Alex Johnson", title: "Senior Frontend Engineer", email: "alex@email.com",
    phone: "+1 555 0100", location: "San Francisco, CA", linkedin: "linkedin.com/in/alex",
    summary: "Results-driven Frontend Engineer with 5+ years of React experience.",
    skills: "React, TypeScript, Node.js, AWS, Docker, GraphQL",
    company: "Tech Corp", role: "Senior Developer", period: "2021 – Present",
    school: "University of California", degree: "B.Sc. Computer Science", year: "2019",
  });
  const steps = ["Template", "Personal Info", "Summary", "Experience", "Skills", "Education"];
  const templates = [
    { id: "clean", name: "Clean Pro", desc: "Minimal, ATS-optimized" },
    { id: "modern", name: "Modern Edge", desc: "Contemporary layout" },
    { id: "classic", name: "Classic", desc: "Traditional format" },
  ];
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><span style={{ cursor: "pointer" }} onClick={() => nav("home")}>Home</span><span className="breadcrumb-sep">/</span><span>CV Builder</span></div>
          <h1>ATS-Friendly CV Builder</h1>
          <p>Build a professionally formatted, ATS-optimized CV with live preview.</p>
        </div>
      </div>
      <div className="container">
        {/* Step progress */}
        <div style={{ display: "flex", gap: 0, marginBottom: 32, background: "var(--white)", borderRadius: 12, border: "1px solid var(--line)", overflow: "hidden" }}>
          {steps.map((s, i) => (
            <div key={s} onClick={() => setStep(i)} style={{ flex: 1, padding: "12px 8px", textAlign: "center", cursor: "pointer", borderRight: i < steps.length - 1 ? "1px solid var(--line)" : "none", background: step === i ? "var(--teal)" : step > i ? "rgba(0,194,168,.1)" : "var(--white)", transition: "all .2s" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: step === i ? "#fff" : step > i ? "var(--teal)" : "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em" }}>{i + 1}. {s}</div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ gap: 32, alignItems: "start" }}>
          {/* Form */}
          <div className="card">
            {step === 0 && (
              <>
                <h3 style={{ marginBottom: 20 }}>Choose a Template</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {templates.map(t => (
                    <div key={t.id} onClick={() => setTemplate(t.id)} style={{ padding: "16px 18px", border: `2px solid ${template === t.id ? "var(--teal)" : "var(--line)"}`, borderRadius: 10, cursor: "pointer", background: template === t.id ? "rgba(0,194,168,.05)" : "var(--white)" }}>
                      <div style={{ fontWeight: 700, marginBottom: 3 }}>{t.name}</div>
                      <div style={{ fontSize: 13, color: "var(--muted)" }}>{t.desc}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {step === 1 && (
              <>
                <h3 style={{ marginBottom: 20 }}>Personal Information</h3>
                {[["Full Name", "name"], ["Professional Title", "title"], ["Email", "email"], ["Phone", "phone"], ["Location", "location"], ["LinkedIn", "linkedin"]].map(([l, k]) => (
                  <div className="field" key={k}><label>{l}</label><input value={form[k]} onChange={e => upd(k, e.target.value)} /></div>
                ))}
              </>
            )}
            {step === 2 && (
              <>
                <h3 style={{ marginBottom: 20 }}>Professional Summary</h3>
                <div className="field"><label>Summary</label><textarea value={form.summary} onChange={e => upd("summary", e.target.value)} style={{ minHeight: 120 }} /></div>
                <div className="alert alert-info"><span>🤖</span><span>Keep it 2–4 sentences with role-specific keywords.</span></div>
              </>
            )}
            {step === 3 && (
              <>
                <h3 style={{ marginBottom: 20 }}>Experience</h3>
                {[["Company", "company"], ["Role / Title", "role"], ["Period", "period"]].map(([l, k]) => (
                  <div className="field" key={k}><label>{l}</label><input value={form[k]} onChange={e => upd(k, e.target.value)} /></div>
                ))}
              </>
            )}
            {step === 4 && (
              <>
                <h3 style={{ marginBottom: 20 }}>Skills</h3>
                <div className="field"><label>Skills (comma-separated)</label><textarea value={form.skills} onChange={e => upd("skills", e.target.value)} style={{ minHeight: 100 }} /></div>
                <div className="tag-wrap">{form.skills.split(",").map(s => s.trim()).filter(Boolean).map(s => <span key={s} className="tag tag-gray">{s}</span>)}</div>
              </>
            )}
            {step === 5 && (
              <>
                <h3 style={{ marginBottom: 20 }}>Education</h3>
                {[["School / University", "school"], ["Degree", "degree"], ["Graduation Year", "year"]].map(([l, k]) => (
                  <div className="field" key={k}><label>{l}</label><input value={form[k]} onChange={e => upd(k, e.target.value)} /></div>
                ))}
              </>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              {step > 0 && <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>← Back</button>}
              {step < steps.length - 1
                ? <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(s => s + 1)}>Continue →</button>
                : <button className="btn btn-primary" style={{ flex: 1 }}>⬇ Download CV</button>}
            </div>
          </div>

          {/* Live Preview */}
          <div className="card" style={{ padding: 0, overflow: "hidden", position: "sticky", top: 80 }}>
            <div style={{ padding: "14px 18px", background: "var(--ink)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>Live Preview — {templates.find(t => t.id === template)?.name}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-sm" style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "none" }}>⬇ PDF</button>
                <button className="btn btn-sm" style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "none" }}>⬇ DOCX</button>
              </div>
            </div>
            <div style={{ padding: 20, maxHeight: 580, overflowY: "auto" }}>
              <div className="cv-preview">
                <div style={{ textAlign: "center", marginBottom: 16, borderBottom: "3px solid #0a0f1e", paddingBottom: 14 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>{form.name || "Your Name"}</div>
                  <div style={{ color: "#555", fontSize: 13, marginTop: 3 }}>{form.title}</div>
                  <div style={{ color: "#777", fontSize: 11, marginTop: 6 }}>{form.email} · {form.phone} · {form.location}</div>
                  <div style={{ color: "#777", fontSize: 11 }}>{form.linkedin}</div>
                </div>
                {form.summary && <><div className="cv-preview h2">PROFESSIONAL SUMMARY</div><p style={{ fontSize: 12 }}>{form.summary}</p></>}
                <div className="cv-preview h2">EXPERIENCE</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{form.role}</div>
                  <div style={{ fontSize: 11, color: "#777" }}>{form.period}</div>
                </div>
                <div style={{ fontSize: 12, color: "#555", marginBottom: 8 }}>{form.company}</div>
                <div className="cv-preview h2">SKILLS</div>
                <div style={{ fontSize: 12 }}>{form.skills}</div>
                <div className="cv-preview h2">EDUCATION</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{form.degree}</div>
                <div style={{ fontSize: 12, color: "#555" }}>{form.school} · {form.year}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: Dashboard
// ══════════════════════════════════════════════════════════════════════════════
function DashboardPage({ nav }) {
  const cvs = [
    { name: "software_engineer_cv.pdf", date: "Dec 28, 2024", score: 72, status: "analyzed" },
    { name: "product_manager_cv.docx", date: "Dec 15, 2024", score: 85, status: "optimized" },
    { name: "data_analyst_cv.pdf", date: "Nov 30, 2024", score: 61, status: "needs-work" },
  ];
  const jobs = [
    { title: "Senior Frontend Engineer", company: "Acme Corp", match: 68 },
    { title: "Full Stack Developer", company: "TechStart", match: 74 },
    { title: "React Developer", company: "BigCo", match: 81 },
  ];

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>Dashboard</h1>
          <p>Welcome back! Manage your CVs and track your application progress.</p>
        </div>
      </div>
      <div className="container">
        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 32 }}>
          {[["📄", "3", "CVs Uploaded", "rgba(59,130,246,.1)"], ["📊", "8", "Analyses Run", "rgba(0,194,168,.1)"], ["⭐", "85", "Best Score", "rgba(245,158,11,.1)"], ["🎯", "3", "Targeted Jobs", "rgba(139,92,246,.1)"]].map(([icon, val, lbl, bg]) => (
            <div className="card" key={lbl}>
              <div className="dash-stat">
                <div className="dash-stat-icon" style={{ background: bg, fontSize: 22 }}>{icon}</div>
                <div><div className="dash-stat-val">{val}</div><div className="dash-stat-lbl">{lbl}</div></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ gap: 28 }}>
          {/* CVs */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3>Your CVs</h3>
              <button className="btn btn-primary btn-sm" onClick={() => nav("upload")}>+ Upload New</button>
            </div>
            {cvs.map(cv => (
              <div key={cv.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📄</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{cv.name}</div>
                  <div style={{ color: "var(--muted)", fontSize: 12 }}>{cv.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: cv.score >= 80 ? "var(--green)" : cv.score >= 65 ? "var(--amber)" : "var(--red)" }}>{cv.score}</div>
                  <span className={`badge ${cv.score >= 80 ? "badge-green" : cv.score >= 65 ? "badge-amber" : "badge-red"}`} style={{ fontSize: 10 }}>{cv.status}</span>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => nav("results")}>View</button>
              </div>
            ))}
          </div>

          {/* Jobs */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3>Targeted Jobs</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => nav("jobdesc")}>+ Add Job</button>
            </div>
            {jobs.map(j => (
              <div key={j.title} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(59,130,246,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💼</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{j.title}</div>
                  <div style={{ color: "var(--muted)", fontSize: 12 }}>{j.company}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: "var(--blue)" }}>{j.match}%</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>Match</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => nav("results")}>Optimize</button>
              </div>
            ))}
            <button className="btn btn-secondary btn-full" style={{ marginTop: 16 }} onClick={() => nav("improve")}>✨ Improve Best Match</button>
          </div>

          {/* Recent activity */}
          <div className="card" style={{ gridColumn: "1/-1" }}>
            <h3 style={{ marginBottom: 20 }}>Recent Activity</h3>
            <div className="timeline">
              {[
                { n: 1, text: "CV 'software_engineer_cv.pdf' analyzed — ATS Score: 72", time: "2 hours ago", c: "var(--teal)" },
                { n: 2, text: "Added job: Senior Frontend Engineer at Acme Corp — 68% match", time: "2 hours ago", c: "var(--blue)" },
                { n: 3, text: "CV 'product_manager_cv.docx' optimized — Score improved 61 → 85", time: "1 week ago", c: "var(--green)" },
                { n: 4, text: "New CV uploaded: data_analyst_cv.pdf", time: "2 weeks ago", c: "var(--amber)" },
              ].map((a, i) => (
                <div className="tl-item" key={i}>
                  <div className="tl-dot" style={{ background: a.c }}>{a.n}</div>
                  <div style={{ fontSize: 14 }}>{a.text}</div>
                  <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 3 }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: Pricing
// ══════════════════════════════════════════════════════════════════════════════
function PricingPage({ nav }) {
  const [annual, setAnnual] = useState(false);
  const plans = [
    {
      name: "Free", price: 0, per: "", color: "var(--slate)",
      features: ["1 CV analysis per month", "Basic ATS score", "Top 5 missing keywords", "Formatting check", "Limited suggestions"],
      cta: "Get Started Free", featured: false,
    },
    {
      name: "Pro", price: annual ? 15 : 19, per: "/month", color: "var(--teal)",
      features: ["Unlimited CV analyses", "Full keyword analysis", "AI-powered rewrites", "Download improved CV", "Section-by-section score", "Job description matching", "Priority support"],
      cta: "Start Pro Trial", featured: true,
    },
    {
      name: "Premium", price: annual ? 29 : 39, per: "/month", color: "var(--purple)",
      features: ["Everything in Pro", "ATS-friendly CV templates", "Cover letter generator", "LinkedIn profile optimizer", "Interview tips & prep", "Unlimited job targeting", "Dedicated success manager"],
      cta: "Start Premium Trial", featured: false,
    },
  ];

  return (
    <>
      <div className="page-header" style={{ textAlign: "center" }}>
        <div className="container">
          <div className="badge badge-teal" style={{ marginBottom: 12 }}>Pricing</div>
          <h1 style={{ fontSize: 44 }}>Simple, transparent pricing</h1>
          <p style={{ color: "var(--muted)", fontSize: 17, marginTop: 10 }}>Start free, upgrade when you're ready.</p>
          <div style={{ display: "flex", gap: 0, justifyContent: "center", marginTop: 24, background: "var(--line)", borderRadius: 10, padding: 4, width: "fit-content", margin: "24px auto 0" }}>
            <button onClick={() => setAnnual(false)} className="btn btn-sm" style={{ background: !annual ? "var(--white)" : "transparent", color: !annual ? "var(--ink)" : "var(--muted)", border: "none", boxShadow: !annual ? "0 1px 4px rgba(0,0,0,.1)" : "none" }}>Monthly</button>
            <button onClick={() => setAnnual(true)} className="btn btn-sm" style={{ background: annual ? "var(--white)" : "transparent", color: annual ? "var(--ink)" : "var(--muted)", border: "none", boxShadow: annual ? "0 1px 4px rgba(0,0,0,.1)" : "none" }}>Annual <span style={{ color: "var(--teal)", fontSize: 11, fontWeight: 700 }}>Save 20%</span></button>
          </div>
        </div>
      </div>
      <div className="container" style={{ maxWidth: 940 }}>
        <div className="grid-3">
          {plans.map(p => (
            <div className={`pricing-card ${p.featured ? "featured" : ""}`} key={p.name}>
              {p.featured && <div className="pricing-badge"><span className="badge badge-teal">Most Popular</span></div>}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 4, color: p.color }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span className="price-num">${p.price}</span>
                  <span className="price-per">{p.per}</span>
                </div>
              </div>
              <div style={{ borderTop: "1px solid var(--line)", paddingTop: 20, marginBottom: 24 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 14 }}>
                    <span style={{ color: p.color, fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <button className={`btn btn-full ${p.featured ? "btn-primary" : "btn-secondary"}`} onClick={() => nav("upload")} style={p.name === "Premium" ? { background: "var(--purple)", color: "#fff", border: "none" } : {}}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 40, color: "var(--muted)", fontSize: 14 }}>
          All plans include a 7-day free trial. No credit card required to start.
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: Cover Letter
// ══════════════════════════════════════════════════════════════════════════════
function CoverLetterPage({ nav }) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [tone, setTone] = useState("professional");
  const sampleLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Frontend Engineer position at Acme Corp. With over 5 years of experience building high-performance web applications using React and TypeScript, I am excited about the opportunity to contribute to your team's success.

In my current role at Tech Corp, I have led the development of several mission-critical frontend features that increased user engagement by 22% and reduced page load times by 38%. My experience with Agile methodologies and CI/CD pipelines aligns perfectly with Acme Corp's engineering culture.

I am particularly drawn to Acme Corp's commitment to building scalable, user-centric products. I believe my technical expertise in React, Node.js, and GraphQL, combined with my passion for clean code and performance optimization, make me an ideal candidate for this role.

I would welcome the opportunity to discuss how my background aligns with your team's goals. Thank you for considering my application.

Sincerely,
Alex Johnson`;

  const generate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 2000);
  };

  return (
    <>
      {generating && <LoadingScreen text="Generating cover letter…" sub="Crafting a personalized, ATS-optimized letter" />}
      <div className="page-header">
        <div className="container">
          <div className="breadcrumb"><span style={{ cursor: "pointer" }} onClick={() => nav("home")}>Home</span><span className="breadcrumb-sep">/</span><span>Cover Letter Generator</span></div>
          <h1>Cover Letter Generator</h1>
          <p>AI-powered cover letters tailored to each job application.</p>
        </div>
      </div>
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="grid-2" style={{ gap: 28 }}>
          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 16 }}>Settings</h3>
              <div className="field"><label>Tone</label>
                <select value={tone} onChange={e => setTone(e.target.value)}>
                  <option value="professional">Professional</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="concise">Concise</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
              <div className="field"><label>Hiring Manager (optional)</label><input placeholder="e.g. Sarah Williams" /></div>
              <div className="alert alert-info"><span>ℹ️</span><span>We'll use your uploaded CV and job description automatically.</span></div>
              <button className="btn btn-primary btn-full" onClick={generate}>✨ Generate Cover Letter</button>
            </div>
          </div>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3>Generated Letter</h3>
              {generated && <button className="btn btn-secondary btn-sm">⬇ Download</button>}
            </div>
            {generated
              ? <textarea value={sampleLetter} readOnly style={{ minHeight: 400, fontSize: 13, lineHeight: 1.8, color: "var(--ink)" }} />
              : <div style={{ minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 14, textAlign: "center", padding: 40, background: "var(--bg)", borderRadius: 10 }}>
                Your cover letter will appear here after generation.
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FOOTER
// ══════════════════════════════════════════════════════════════════════════════
function Footer({ nav }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="grid-4">
          <div>
            <div className="footer-brand"><span style={{ color: "var(--teal)" }}>⬡</span> ATSPro</div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", lineHeight: 1.7, marginTop: 8 }}>AI-powered CV optimization to help you land more interviews.</p>
          </div>
          {[
            { title: "Product", links: [["Upload CV", "upload"], ["CV Builder", "builder"], ["Pricing", "pricing"], ["Dashboard", "dashboard"]] },
            { title: "Tools", links: [["Cover Letter", "coverletter"], ["ATS Checker", "upload"], ["Interview Tips", "home"], ["Resources", "home"]] },
            { title: "Company", links: [["About", "home"], ["Contact", "home"], ["Privacy Policy", "home"], ["Terms of Service", "home"]] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>{col.title}</div>
              <div className="footer-links">
                {col.links.map(([l, p]) => <button key={l} className="footer-link" onClick={() => nav(p)}>{l}</button>)}
              </div>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2025 ATSPro · Built with AI · All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const nav = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const navLinks = [
    { key: "home", label: "Home" },
    { key: "upload", label: "Analyze CV" },
    { key: "builder", label: "CV Builder" },
    { key: "coverletter", label: "Cover Letter" },
    { key: "dashboard", label: "Dashboard" },
    { key: "pricing", label: "Pricing" },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-brand" onClick={() => nav("home")}>
            <span style={{ color: "var(--teal)" }}>⬡</span> ATSPro
          </div>
          <div className="nav-links">
            {navLinks.map(l => (
              <button key={l.key} className={`nav-link ${page === l.key ? "active" : ""}`} onClick={() => nav(l.key)}>{l.label}</button>
            ))}
          </div>
          <div className="nav-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => nav("dashboard")}>Sign In</button>
            <button className="btn btn-primary btn-sm" onClick={() => nav("upload")}>Start Free</button>
          </div>
        </nav>

        <main className="main">
          {page === "home" && <HomePage nav={nav} />}
          {page === "upload" && <UploadPage nav={nav} />}
          {page === "jobdesc" && <JobDescPage nav={nav} />}
          {page === "results" && <ResultsPage nav={nav} />}
          {page === "improve" && <ImprovePage nav={nav} />}
          {page === "builder" && <BuilderPage nav={nav} />}
          {page === "dashboard" && <DashboardPage nav={nav} />}
          {page === "pricing" && <PricingPage nav={nav} />}
          {page === "coverletter" && <CoverLetterPage nav={nav} />}
        </main>

        <Footer nav={nav} />
      </div>
    </>
  );
}
