 import { useState, useEffect, useRef } from "react";

// ── Palette & globals ──────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=MS+Sans+Serif&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --win-gray:       #c0c0c0;
  --win-dark-gray:  #808080;
  --win-light:      #dfdfdf;
  --win-highlight:  #ffffff;
  --win-shadow:     #000000;
  --win-blue:       #000080;
  --win-blue-light: #0000ff;
  --win-title-active: linear-gradient(90deg, #0a246a 0%, #a6caf0 100%);
  --win-title-text: #ffffff;
  --win-green:      #008000;
  --win-red:        #ff0000;
  --win-yellow:     #ffff00;
  --win-desktop:    #008080;
  --r: 0px;
}

html { scroll-behavior: smooth; }

body {
  font-family: 'MS Sans Serif', 'Microsoft Sans Serif', Tahoma, sans-serif;
  background: var(--win-desktop);
  color: #000000;
  min-height: 100vh;
  font-size: 11px;
  line-height: 1.4;
  image-rendering: pixelated;
}

h1,h2,h3,h4,h5,h6 { font-family: 'MS Sans Serif', 'Microsoft Sans Serif', Tahoma, sans-serif; line-height: 1.2; font-weight: bold; }

/* ═══════════════════════════════════════
   WINDOWS 2000 UI SYSTEM
   ═══════════════════════════════════════ */

/* Win32 border mixin helpers */
/* raised: light top/left, dark bottom/right */
/* sunken: dark top/left, light bottom/right */

/* ── Layout ── */
.app { display: flex; flex-direction: column; min-height: 100vh; background: var(--win-gray); }
.main { flex: 1; padding: 8px; }

/* ── Win2k Window Container ── */
.win-window {
  background: var(--win-gray);
  border-top: 2px solid var(--win-highlight);
  border-left: 2px solid var(--win-highlight);
  border-bottom: 2px solid var(--win-shadow);
  border-right: 2px solid var(--win-shadow);
  box-shadow: 1px 1px 0 0 var(--win-dark-gray) inset, -1px -1px 0 0 var(--win-light) inset;
}

.win-window-inner {
  border-top: 1px solid var(--win-light);
  border-left: 1px solid var(--win-light);
  border-bottom: 1px solid var(--win-dark-gray);
  border-right: 1px solid var(--win-dark-gray);
}

/* ── Taskbar ── */
.nav {
  position: sticky; top: 0; z-index: 1000;
  background: var(--win-gray);
  border-top: 2px solid var(--win-highlight);
  border-bottom: 2px solid var(--win-shadow);
  padding: 2px 4px;
  height: 30px;
  display: flex; align-items: center; justify-content: space-between;
}
.nav-brand {
  display: flex; align-items: center; gap: 4px;
  font-weight: bold; font-size: 12px;
  color: #000; cursor: pointer;
  background: linear-gradient(90deg, var(--win-blue) 0%, #1084d0 100%);
  color: #fff;
  padding: 2px 8px;
  border-top: 1px solid var(--win-highlight);
  border-left: 1px solid var(--win-highlight);
  border-bottom: 1px solid var(--win-shadow);
  border-right: 1px solid var(--win-shadow);
  height: 22px;
}
.nav-brand:hover { filter: brightness(1.1); }
.nav-brand-dot { display:none; }
.nav-links { display: flex; align-items: center; gap: 1px; flex:1; padding: 0 8px; }
.nav-link {
  padding: 2px 8px; font-size: 11px; font-weight: normal;
  color: #000; cursor: pointer; border: 1px solid transparent;
  background: var(--win-gray); font-family: inherit;
  height: 22px; display: flex; align-items: center;
}
.nav-link:hover {
  border-top: 1px solid var(--win-highlight);
  border-left: 1px solid var(--win-highlight);
  border-bottom: 1px solid var(--win-shadow);
  border-right: 1px solid var(--win-shadow);
}
.nav-link.active {
  background: var(--win-light);
  border-top: 1px solid var(--win-shadow);
  border-left: 1px solid var(--win-shadow);
  border-bottom: 1px solid var(--win-highlight);
  border-right: 1px solid var(--win-highlight);
}
.nav-actions { display: flex; gap: 2px; }

/* ── Buttons (Win2k raised style) ── */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 4px;
  padding: 3px 12px;
  font-size: 11px; font-weight: normal; font-family: inherit;
  cursor: pointer;
  background: var(--win-gray);
  color: #000;
  border-top: 2px solid var(--win-highlight);
  border-left: 2px solid var(--win-highlight);
  border-bottom: 2px solid var(--win-shadow);
  border-right: 2px solid var(--win-shadow);
  box-shadow: 1px 1px 0 0 var(--win-dark-gray);
  white-space: nowrap; text-decoration: none;
  min-height: 23px;
}
.btn:hover { filter: brightness(0.97); }
.btn:active, .btn:focus {
  border-top: 2px solid var(--win-shadow);
  border-left: 2px solid var(--win-shadow);
  border-bottom: 2px solid var(--win-highlight);
  border-right: 2px solid var(--win-highlight);
  box-shadow: none;
}
.btn-primary { background: var(--win-gray); color: #000; font-weight: bold; }
.btn-primary:active { color: #000; }
.btn-secondary { background: var(--win-gray); color: #000; }
.btn-ghost { background: transparent; color: #000; border-color: transparent; box-shadow: none; }
.btn-ghost:hover { background: var(--win-gray); border-color: var(--win-dark-gray); }
.btn-dark { background: var(--win-blue); color: #fff; }
.btn-danger { background: var(--win-gray); color: var(--win-red); font-weight: bold; }
.btn-sm { padding: 2px 8px; font-size: 11px; min-height: 20px; }
.btn-lg { padding: 4px 20px; font-size: 12px; font-weight: bold; }
.btn-full { width: 100%; }
.btn:disabled { color: var(--win-dark-gray); cursor: not-allowed; }
.btn:disabled:after { content:''; position:absolute; }

/* ── Cards / Group Boxes ── */
.card {
  background: var(--win-gray);
  border-top: 1px solid var(--win-dark-gray);
  border-left: 1px solid var(--win-dark-gray);
  border-bottom: 1px solid var(--win-highlight);
  border-right: 1px solid var(--win-highlight);
  padding: 12px;
  margin-bottom: 8px;
}
.card-sm { padding: 8px; }

/* ── Section ── */
.section { padding: 16px 0; }
.section-sm { padding: 8px 0; }
.container { max-width: 1120px; margin: 0 auto; padding: 0 8px; }
.container-sm { max-width: 720px; margin: 0 auto; padding: 0 8px; }

/* ── Grid ── */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
.grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }

/* ── Badge ── */
.badge {
  display: inline-flex; align-items: center; gap: 3px;
  padding: 0 6px; font-size: 11px; font-weight: normal;
  background: var(--win-gray);
  border-top: 1px solid var(--win-dark-gray);
  border-left: 1px solid var(--win-dark-gray);
  border-bottom: 1px solid var(--win-highlight);
  border-right: 1px solid var(--win-highlight);
}
.badge-blue, .badge-blue { background: var(--win-blue); color: #fff; border-color: var(--win-blue); }
.badge-amber { background: var(--win-gray); color: #000; }
.badge-red { background: var(--win-gray); color: var(--win-red); }
.badge-green { background: var(--win-gray); color: var(--win-green); }
.badge-gray { background: var(--win-gray); color: #000; }
.badge-purple { background: var(--win-gray); color: #800080; }

/* ── Form (Win2k sunken inputs) ── */
label { font-size: 11px; font-weight: normal; color: #000; display: block; margin-bottom: 3px; }
input, textarea, select {
  width: 100%; padding: 3px 5px;
  border-top: 2px solid var(--win-shadow);
  border-left: 2px solid var(--win-shadow);
  border-bottom: 2px solid var(--win-highlight);
  border-right: 2px solid var(--win-highlight);
  box-shadow: inset 1px 1px 0 var(--win-dark-gray);
  font-family: inherit; font-size: 11px; color: #000;
  background: #fff; outline: none;
}
input:focus, textarea:focus, select:focus { outline: 2px solid var(--win-blue); outline-offset: 0; }
textarea { resize: vertical; min-height: 80px; line-height: 1.4; }
.field { margin-bottom: 10px; }

/* ── Upload Zone ── */
.upload-zone {
  border: 2px dashed var(--win-dark-gray);
  padding: 24px 16px;
  text-align: center; cursor: pointer;
  background: #fff;
}
.upload-zone:hover, .upload-zone.drag {
  background: #e0e0ff;
  border-color: var(--win-blue);
}
.upload-icon { font-size: 28px; margin-bottom: 8px; }

/* ── Score Circle ── */
.score-circle {
  width: 120px; height: 120px; border-radius: 50%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  position: relative; margin: 0 auto;
  background: var(--win-gray);
  border-top: 2px solid var(--win-shadow);
  border-left: 2px solid var(--win-shadow);
  border-bottom: 2px solid var(--win-highlight);
  border-right: 2px solid var(--win-highlight);
}
.score-ring { position: absolute; top:0; left:0; transform: rotate(-90deg); }
.score-val { font-size: 28px; font-weight: bold; }
.score-lbl { font-size: 9px; font-weight: normal; color: #000; text-transform: uppercase; }

/* ── Progress bar ── */
.pbar-wrap { margin-bottom: 8px; }
.pbar-head { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px; }
.pbar-track {
  height: 14px;
  background: #fff;
  border-top: 1px solid var(--win-shadow);
  border-left: 1px solid var(--win-shadow);
  border-bottom: 1px solid var(--win-highlight);
  border-right: 1px solid var(--win-highlight);
  overflow: hidden;
}
.pbar-fill { height: 100%; background: var(--win-blue); transition: width 1s linear; }

/* ── Tags ── */
.tag-wrap { display: flex; flex-wrap: wrap; gap: 4px; }
.tag {
  padding: 2px 8px; font-size: 11px; font-weight: normal;
  display: inline-flex; align-items: center; gap: 4px;
  background: var(--win-gray);
  border-top: 1px solid var(--win-highlight);
  border-left: 1px solid var(--win-highlight);
  border-bottom: 1px solid var(--win-shadow);
  border-right: 1px solid var(--win-shadow);
}
.tag-green { color: var(--win-green); }
.tag-red { color: var(--win-red); }
.tag-blue { color: var(--win-blue-light); }
.tag-gray { color: #000; }
.tag-amber { color: #804000; }

/* ── Tabs (Win2k tab control) ── */
.tabs { display: flex; gap: 0; border-bottom: 2px solid var(--win-shadow); margin-bottom: 12px; }
.tab {
  padding: 4px 12px; font-size: 11px; font-weight: normal; cursor: pointer;
  background: var(--win-gray);
  border-top: 2px solid var(--win-highlight);
  border-left: 2px solid var(--win-highlight);
  border-right: 2px solid var(--win-shadow);
  border-bottom: none;
  margin-bottom: -2px; margin-right: 2px;
  color: #000; font-family: inherit;
}
.tab:hover { background: var(--win-light); }
.tab.active {
  background: var(--win-gray);
  border-top: 2px solid var(--win-highlight);
  border-left: 2px solid var(--win-highlight);
  border-right: 2px solid var(--win-shadow);
  border-bottom: 2px solid var(--win-gray);
  z-index: 1; position: relative;
  padding-bottom: 6px;
}

/* ── Alert ── */
.alert {
  padding: 6px 10px; font-size: 11px;
  display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px;
  background: var(--win-gray);
  border-top: 1px solid var(--win-dark-gray);
  border-left: 1px solid var(--win-dark-gray);
  border-bottom: 1px solid var(--win-highlight);
  border-right: 1px solid var(--win-highlight);
}
.alert-info { background: #e0e8ff; color: #000050; }
.alert-warn { background: #ffffc0; color: #402000; }
.alert-success { background: #c0ffc0; color: #004000; }
.alert-danger { background: #ffc0c0; color: #400000; }

/* ── Stat card ── */
.stat-card { text-align: center; padding: 12px; }
.stat-num { font-size: 24px; font-weight: bold; color: var(--win-blue); }
.stat-desc { font-size: 11px; color: #000; margin-top: 2px; }

/* ── Timeline ── */
.timeline { position: relative; padding-left: 24px; }
.timeline::before { content:''; position:absolute; left:8px; top:0; bottom:0; width:1px; background:var(--win-dark-gray); }
.tl-item { position:relative; margin-bottom:16px; }
.tl-dot {
  position:absolute; left:-24px; top:2px; width:18px; height:18px;
  background: var(--win-gray);
  border-top: 1px solid var(--win-highlight);
  border-left: 1px solid var(--win-highlight);
  border-bottom: 1px solid var(--win-shadow);
  border-right: 1px solid var(--win-shadow);
  display:flex; align-items:center; justify-content:center;
  font-size:9px; color:#000; font-weight:bold;
}

/* ── Pricing ── */
.pricing-card {
  padding: 16px;
  background: var(--win-gray);
  border-top: 2px solid var(--win-highlight);
  border-left: 2px solid var(--win-highlight);
  border-bottom: 2px solid var(--win-shadow);
  border-right: 2px solid var(--win-shadow);
  position: relative;
}
.pricing-card.featured {
  background: #dde9ff;
  border: 2px solid var(--win-blue);
}
.pricing-badge { position:absolute; top:-10px; left:50%; transform:translateX(-50%); white-space:nowrap; }
.price-num { font-size: 36px; font-weight: bold; }
.price-per { font-size: 11px; color: #000; }

/* ── Title bar (Win2k window chrome) ── */
.win-title-bar {
  background: var(--win-title-active);
  color: var(--win-title-text);
  font-weight: bold;
  font-size: 11px;
  padding: 3px 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}
.win-title-icon { margin-right: 4px; font-size: 12px; }
.win-title-buttons { display: flex; gap: 2px; }
.win-title-btn {
  width: 16px; height: 14px;
  background: var(--win-gray);
  border-top: 1px solid var(--win-highlight);
  border-left: 1px solid var(--win-highlight);
  border-bottom: 1px solid var(--win-shadow);
  border-right: 1px solid var(--win-shadow);
  font-size: 9px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #000; font-family: 'Wingdings', 'Webdings', sans-serif;
}
.win-title-btn:hover { background: var(--win-light); }
.win-title-btn.close:hover { background: #c0392b; color: #fff; }

/* ── Footer / Statusbar ── */
.footer {
  background: var(--win-gray);
  border-top: 2px solid var(--win-highlight);
  padding: 8px 0 4px;
  color: #000;
}
.footer-brand { font-weight: bold; font-size: 12px; color: #000; margin-bottom: 4px; display: flex; align-items: center; gap: 4px; }
.footer-links { display: flex; flex-direction: column; gap: 2px; }
.footer-link { color: var(--win-blue-light); text-decoration: underline; font-size: 11px; cursor: pointer; background: none; border: none; font-family: inherit; text-align: left; padding: 0; }
.footer-link:hover { color: var(--win-red); }
.footer-bottom { border-top: 1px solid var(--win-dark-gray); margin-top: 8px; padding-top: 4px; text-align: center; font-size: 11px; }

/* ── Hero (Win2k window style) ── */
.hero {
  background: var(--win-gray);
  padding: 12px 0;
  position: relative;
}
.hero::before { display: none; }
.hero-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; align-items:start; position:relative; }
.hero-eyebrow { font-size:11px; font-weight:bold; text-transform:uppercase; color:var(--win-blue); margin-bottom:8px; }
.hero-h1 { font-size:18px; font-weight:bold; color:#000; line-height:1.3; margin-bottom:10px; }
.hero-sub { font-size:11px; color:#000; line-height:1.5; margin-bottom:12px; }
.hero-actions { display:flex; gap:6px; flex-wrap:wrap; }
.hero-visual {
  background: #fff;
  border-top: 2px solid var(--win-shadow);
  border-left: 2px solid var(--win-shadow);
  border-bottom: 2px solid var(--win-highlight);
  border-right: 2px solid var(--win-highlight);
  padding: 12px;
}
.hero-score-row { display:flex; justify-content:space-around; margin-bottom:12px; }
.hero-metric { text-align:center; }
.hero-metric-val { font-size:20px; font-weight:bold; color:var(--win-blue); }
.hero-metric-lbl { font-size:10px; color:#000; margin-top:1px; }
.hero-bar-row { margin-bottom:6px; }
.hero-bar-lbl { display:flex; justify-content:space-between; font-size:10px; color:#000; margin-bottom:2px; }
.hero-bar-track { height:12px; background:#fff; border-top:1px solid var(--win-shadow); border-left:1px solid var(--win-shadow); border-bottom:1px solid var(--win-highlight); border-right:1px solid var(--win-highlight); overflow:hidden; }
.hero-bar-fill { height:100%; background: var(--win-blue); }

/* ── Step cards ── */
.step-num { width:24px; height:24px; background:var(--win-gray); border-top:2px solid var(--win-highlight); border-left:2px solid var(--win-highlight); border-bottom:2px solid var(--win-shadow); border-right:2px solid var(--win-shadow); color:#000; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px; margin-bottom:8px; }

/* ── Feature icon ── */
.feat-icon { font-size:20px; margin-bottom:8px; width:36px; height:36px; background:var(--win-gray); border-top:1px solid var(--win-highlight); border-left:1px solid var(--win-highlight); border-bottom:1px solid var(--win-shadow); border-right:1px solid var(--win-shadow); display:flex; align-items:center; justify-content:center; }

/* ── Testimonial ── */
.testimonial { position:relative; }
.testi-quote { font-size:24px; color:var(--win-blue); line-height:1; margin-bottom:4px; }
.testi-author { display:flex; align-items:center; gap:8px; margin-top:8px; }
.testi-avatar { width:32px; height:32px; background:var(--win-gray); border-top:1px solid var(--win-shadow); border-left:1px solid var(--win-shadow); border-bottom:1px solid var(--win-highlight); border-right:1px solid var(--win-highlight); display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px; color:#000; }

/* ── Page header (Win2k title bar) ── */
.page-header {
  padding: 0 0 8px 0;
  margin-bottom: 8px;
}
.page-header h1 { font-size: 14px; font-weight: bold; }
.page-header p { color: #000; margin-top: 4px; font-size: 11px; }
.breadcrumb { display:flex; gap:4px; align-items:center; font-size:11px; color: var(--win-blue-light); margin-bottom:6px; }
.breadcrumb span { cursor:pointer; text-decoration:underline; }
.breadcrumb span:last-child { text-decoration:none; color: #000; }
.breadcrumb-sep { color: var(--win-dark-gray); text-decoration:none !important; }

/* ── Dashboard ── */
.dash-stat { display:flex; align-items:center; gap:8px; }
.dash-stat-icon { width:32px; height:32px; background:var(--win-gray); border-top:1px solid var(--win-highlight); border-left:1px solid var(--win-highlight); border-bottom:1px solid var(--win-shadow); border-right:1px solid var(--win-shadow); display:flex; align-items:center; justify-content:center; font-size:16px; }
.dash-stat-val { font-size:20px; font-weight:bold; }
.dash-stat-lbl { font-size:11px; color:#000; }

/* ── CV Preview ── */
.cv-preview {
  background:#fff; border:2px inset var(--win-gray); padding:12px;
  font-size:11px; line-height:1.4; color:#000;
}
.cv-preview h2 { font-size:12px; border-bottom:1px solid #000; padding-bottom:2px; margin:8px 0 4px; }
.cv-preview h3 { font-size:11px; font-weight:bold; }

/* ── Section title ── */
.section-title { font-size: 16px; font-weight: bold; margin-bottom: 8px; }
.section-sub { font-size: 11px; color: #000; margin-bottom: 16px; }

/* ── Anim ── */
@keyframes fadeUp { from{opacity:0} to{opacity:1} }
@keyframes spin { to{transform:rotate(360deg)} }
.fade-up { animation: fadeUp .2s ease both; }
.spinner {
  width: 200px; height: 16px;
  background: repeating-linear-gradient(90deg, var(--win-blue) 0%, var(--win-blue) 10%, #6699ff 10%, #6699ff 20%);
  background-size: 40px 100%;
  animation: marquee 1s linear infinite;
  margin: 8px auto;
  border-top:1px solid var(--win-shadow); border-left:1px solid var(--win-shadow);
  border-bottom:1px solid var(--win-highlight); border-right:1px solid var(--win-highlight);
}
@keyframes marquee { from{background-position:0 0} to{background-position:40px 0} }

/* ── Loading overlay ── */
.loading-overlay {
  position:fixed; inset:0; background:var(--win-gray);
  display:flex; flex-direction:column; align-items:center; justify-content:center; z-index:9999; gap:12px;
}
.loading-text { font-size:13px; font-weight:bold; color:#000; }
.loading-sub { font-size:11px; color:#000; }

/* ── Win2k Desktop wallpaper area ── */
.win-desktop-bg { background: var(--win-desktop); padding: 4px; }

/* ── Scrollbar win2k style ── */
::-webkit-scrollbar { width: 16px; height: 16px; }
::-webkit-scrollbar-track { background: var(--win-gray); }
::-webkit-scrollbar-thumb {
  background: var(--win-gray);
  border-top: 1px solid var(--win-highlight);
  border-left: 1px solid var(--win-highlight);
  border-bottom: 1px solid var(--win-shadow);
  border-right: 1px solid var(--win-shadow);
}
::-webkit-scrollbar-button {
  background: var(--win-gray);
  border-top: 1px solid var(--win-highlight);
  border-left: 1px solid var(--win-highlight);
  border-bottom: 1px solid var(--win-shadow);
  border-right: 1px solid var(--win-shadow);
  height: 16px; width: 16px;
}

/* ── Responsive ── */
@media(max-width:768px){
  .hero-grid,.grid-2,.grid-3,.grid-4{grid-template-columns:1fr;}
  .nav-links{display:none;}
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

// ── Mock Analysis Data ─────────��────────────────────────────────────────────
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
function ScoreCircle({ score, size = 120, color = "#000080", label = "ATS Score" }) {
  const r = size / 2 - 10;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="score-circle" style={{ width: size, height: size }}>
      <svg className="score-ring" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#808080" strokeWidth={6} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="butt"
          style={{ transition: "stroke-dasharray 0.8s linear" }} />
      </svg>
      <div className="score-val" style={{ color }}>{score}</div>
      <div className="score-lbl">{label}</div>
    </div>
  );
}

// ── Helper: Progress bar ────────────────────────────────────────────────────
function ProgressBar({ label, value, max = 100, color = "var(--win-blue)" }) {
  return (
    <div className="pbar-wrap">
      <div className="pbar-head">
        <span style={{ fontWeight: 600, fontSize: 13 }}>{label}</span>
        <span style={{ color: "#000", fontSize: 13 }}>{value}%</span>
      </div>
      <div className="pbar-track">
        <div className="pbar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

// ── Loading Screen ──────────────────────────────────────────────────────────
function LoadingScreen({ text = "Analyzing your CV…", sub = "Please wait while ATSPro processes your document" }) {
  const [step, setStep] = useState(0);
  const steps = ["Parsing document structure…", "Extracting keywords…", "Comparing with job description…", "Generating improvements…"];
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % steps.length), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="loading-overlay">
      {/* Win2K dialog box */}
      <div style={{ background: "var(--win-gray)", border: "2px solid", borderColor: "var(--win-highlight) var(--win-shadow) var(--win-shadow) var(--win-highlight)", width: 360, boxShadow: "2px 2px 4px rgba(0,0,0,.5)" }}>
        <div className="win-title-bar">
          <span><span className="win-title-icon">⏳</span> ATSPro — Processing</span>
          <div className="win-title-buttons">
            <div className="win-title-btn">_</div>
          </div>
        </div>
        <div style={{ padding: 20, textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>⏳</div>
          <div className="loading-text">{text}</div>
          <div style={{ margin: "12px 0" }}>
            <div className="spinner" />
          </div>
          <div className="loading-sub">{steps[step]}</div>
          <div style={{ marginTop: 12, fontSize: 11, color: "var(--win-dark-gray)" }}>Please do not close this window.</div>
        </div>
      </div>
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
    { quote: "My application rate went from 5% to 28% after optimizing with ATSPro. The keyword tool is incredible.", name: "Sarah Chen", role: "Software Engineer", color: "#000080" },
    { quote: "I was getting rejected by systems before humans even saw my CV. ATSPro fixed that completely.", name: "Marcus Johnson", role: "Marketing Manager", color: "#806000" },
    { quote: "The CV builder with ATS templates saved me hours and landed me 3 interviews in one week.", name: "Priya Sharma", role: "Data Analyst", color: "#008000" },
  ];
  return (
    <>
      {/* Hero — Win2k welcome window */}
      <section className="hero">
        <div className="container">
          {/* Title bar for hero */}
          <div style={{ background: "var(--win-gray)", border: "2px solid", borderColor: "var(--win-highlight) var(--win-shadow) var(--win-shadow) var(--win-highlight)", marginBottom: 8 }}>
            <div className="win-title-bar">
              <span><span className="win-title-icon">📊</span> ATSPro — AI-Powered CV Optimizer v2.0</span>
              <div className="win-title-buttons">
                <div className="win-title-btn">_</div>
                <div className="win-title-btn">□</div>
                <div className="win-title-btn close">✕</div>
              </div>
            </div>
            <div style={{ padding: 12 }}>
              <div className="hero-grid">
                <div className="fade-up">
                  <div className="hero-eyebrow">AI-Powered CV Optimization</div>
                  <h1 className="hero-h1">Optimize Your CV<br />for ATS Systems</h1>
                  <p className="hero-sub">75% of resumes are rejected before a human ever reads them. Our AI ensures yours makes it through — every time.</p>
                  <div className="hero-actions">
                    <button className="btn btn-primary btn-lg" onClick={() => nav("upload")}>Start Now {IC.arrow}</button>
                    <button className="btn btn-secondary btn-lg" onClick={() => nav("upload")}>Try Free Scan</button>
                  </div>
                </div>
                <div className="hero-visual fade-up" style={{ animationDelay: ".1s" }}>
                  {/* Inner window: Live Preview */}
                  <div style={{ border: "2px solid", borderColor: "var(--win-highlight) var(--win-shadow) var(--win-shadow) var(--win-highlight)", marginBottom: 6 }}>
                    <div className="win-title-bar" style={{ fontSize: 10 }}>
                      <span>📈 Live ATS Analysis Preview</span>
                    </div>
                    <div style={{ background: "var(--win-gray)", padding: 10 }}>
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
                      <div style={{ marginTop: 10, padding: "6px 8px", background: "#ffffc0", border: "1px solid #808000" }}>
                        <div style={{ fontSize: 10, fontWeight: "bold", marginBottom: 4 }}>⚡ Top Improvements</div>
                        {["Add Agile/Scrum keywords", "Rewrite professional summary", "Add certifications section"].map(s => (
                          <div key={s} style={{ fontSize: 10, marginBottom: 2 }}>→ {s}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats — Win2k status bar style */}
      <section style={{ background: "var(--win-gray)", borderTop: "1px solid var(--win-shadow)", borderBottom: "1px solid var(--win-highlight)", padding: "6px 0" }}>
        <div className="container">
          <div className="grid-4">
            {[["50K+", "CVs Analyzed"], ["87%", "Interview Rate"], ["3x", "More Callbacks"], ["4.9★", "User Rating"]].map(([v, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRight: "1px solid var(--win-shadow)" }}>
                <div style={{ fontSize: 16, fontWeight: "bold", color: "var(--win-blue)" }}>{v}</div>
                <div style={{ fontSize: 11, color: "#000" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — grouped list box style */}
      <section className="section" style={{ background: "var(--win-gray)" }}>
        <div className="container">
          <div style={{ border: "2px solid", borderColor: "var(--win-highlight) var(--win-shadow) var(--win-shadow) var(--win-highlight)", marginBottom: 8 }}>
            <div className="win-title-bar">
              <span>📋 How It Works — 3 Easy Steps</span>
            </div>
            <div style={{ padding: 12 }}>
              <div className="grid-3">
                {[
                  { n: "1", title: "Upload Your CV", desc: "Upload your CV in PDF or DOCX format. We support all standard formats.", icon: "📄" },
                  { n: "2", title: "Add Job Description", desc: "Paste the job description you're targeting for precise keyword matching.", icon: "💼" },
                  { n: "3", title: "Get Analysis & Improvements", desc: "Receive a detailed ATS score, missing keywords, and AI-powered rewrites.", icon: "✨" },
                ].map(s => (
                  <div className="card" key={s.n} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                    <div className="step-num" style={{ margin: "0 auto 8px" }}>{s.n}</div>
                    <h3 style={{ fontSize: 12, marginBottom: 4, fontWeight: "bold" }}>{s.title}</h3>
                    <p style={{ fontSize: 11 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features window */}
          <div style={{ border: "2px solid", borderColor: "var(--win-highlight) var(--win-shadow) var(--win-shadow) var(--win-highlight)" }}>
            <div className="win-title-bar">
              <span>⚡ Features — Everything You Need to Beat ATS</span>
            </div>
            <div style={{ padding: 12 }}>
              <div className="grid-4">
                {features.map(f => (
                  <div className="card" key={f.title}>
                    <div className="feat-icon">{f.icon}</div>
                    <h3 style={{ fontSize: 12, marginBottom: 4, fontWeight: "bold" }}>{f.title}</h3>
                    <p style={{ fontSize: 11, lineHeight: 1.5 }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ background: "var(--win-gray)" }}>
        <div className="container">
          <div style={{ border: "2px solid", borderColor: "var(--win-highlight) var(--win-shadow) var(--win-shadow) var(--win-highlight)" }}>
            <div className="win-title-bar">
              <span>💬 User Testimonials — Real Results</span>
            </div>
            <div style={{ padding: 12 }}>
              <div className="grid-3">
                {testimonials.map(t => (
                  <div className="card testimonial" key={t.name}>
                    <div className="testi-quote">"</div>
                    <p style={{ fontSize: 11, lineHeight: 1.6 }}>{t.quote}</p>
                    <div className="testi-author">
                      <div className="testi-avatar">{t.name[0]}</div>
                      <div><div style={{ fontWeight: "bold", fontSize: 11 }}>{t.name}</div><div style={{ fontSize: 10 }}>{t.role}</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: "var(--win-gray)" }}>
        <div className="container-sm">
          <div style={{ border: "2px solid", borderColor: "var(--win-highlight) var(--win-shadow) var(--win-shadow) var(--win-highlight)" }}>
            <div className="win-title-bar">
              <span>🎯 Get Started — Join 50,000+ Professionals</span>
            </div>
            <div style={{ padding: 20, textAlign: "center" }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: "bold", marginBottom: 6 }}>Ready to land more interviews?</div>
                <p style={{ fontSize: 11 }}>Join 50,000+ professionals who optimized their CVs with ATSPro.</p>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn btn-primary btn-lg" onClick={() => nav("upload")}>Start Free Today {IC.arrow}</button>
                <button className="btn btn-secondary btn-lg" onClick={() => nav("pricing")}>View Pricing</button>
              </div>
            </div>
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
                <div style={{ color: "#000", fontSize: 13 }}>{(file.size / 1024).toFixed(0)} KB · Click to change</div>
              </>
            ) : (
              <>
                <div className="upload-icon">📄</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Drop your CV here</div>
                <div style={{ color: "#000", fontSize: 14, marginBottom: 12 }}>Supports PDF, DOCX — Max 10 MB</div>
                <button className="btn btn-secondary btn-sm">Browse Files</button>
              </>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="card">
          <h3 style={{ fontSize: 18, marginBottom: 4 }}>Analysis Settings</h3>
          <p style={{ color: "#000", fontSize: 13, marginBottom: 24 }}>The more specific your role, the more accurate your keyword analysis.</p>

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
                    padding: "10px 6px", borderRadius: 10, border: `2px solid ${category === cat.id ? "var(--win-blue)" : "var(--win-dark-gray)"}`,
                    background: category === cat.id ? "rgba(0,0,128,0.07)" : "var(--win-gray)",
                    cursor: "pointer", textAlign: "center", transition: "all .15s",
                  }}
                >
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{cat.icon}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: category === cat.id ? "var(--win-blue)" : "#444", lineHeight: 1.3 }}>{cat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Specific Role — shown only after category picked */}
          {selectedCat && (
            <div className="field" style={{ animation: "fadeUp .25s ease both" }}>
              <label>Specific Role <span style={{ color: "var(--win-blue)", fontSize: 11 }}>— {selectedCat.label}</span></label>
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
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(0,0,128,0.06)", border: "1px solid rgba(0,0,128,0.2)", borderRadius: 10, marginBottom: 20, fontSize: 13 }}>
              <span style={{ fontSize: 18 }}>{selectedCat?.icon}</span>
              <span style={{ fontWeight: 600, color: "var(--win-blue)" }}>{role}</span>
              {expLevel && <><span style={{ color: "#000" }}>·</span><span style={{ color: "#000" }}>{expLevel}</span></>}
              <button onClick={() => { setRole(""); setCategory(""); setExpLevel(""); }} style={{ marginLeft: "auto", background: "none", border: "none", color: "#000", cursor: "pointer", fontSize: 16 }}>✕</button>
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
              <p style={{ color: "#000", fontSize: 13 }}>Select a role template to pre-fill the job description with specialist requirements.</p>
            </div>
            <span className="badge badge-blue">8 Tech Roles</span>
          </div>

          {/* Category filter pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setFilterCat(c.id)}
                className="btn btn-sm"
                style={{
                  background: filterCat === c.id ? "var(--win-blue)" : "var(--win-gray)",
                  color: filterCat === c.id ? "#fff" : "#444",
                  border: `1.5px solid ${filterCat === c.id ? "var(--win-blue)" : "var(--win-dark-gray)"}`,
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
                  border: `2px solid ${activeTemplate === tpl.id ? "var(--win-blue)" : "var(--win-dark-gray)"}`,
                  background: activeTemplate === tpl.id ? "rgba(0,0,128,0.06)" : "var(--win-gray)",
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 6 }}>{tpl.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: activeTemplate === tpl.id ? "var(--win-blue)" : "#000" }}>{tpl.label}</div>
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
                  {text && <span style={{ color: "#000", fontWeight: 400 }}>{text.split(/\s+/).filter(Boolean).length} words</span>}
                </label>
                <textarea
                  value={text}
                  onChange={e => { setText(e.target.value); setActiveTemplate(null); }}
                  placeholder={"Paste the full job description here, or select a template above…"}
                  style={{ minHeight: 320, marginTop: 6, fontFamily: "'MS Sans Serif', inherit" }}
                />
              </div>
            </div>

            <div style={{ textAlign: "center", color: "#000", fontSize: 13, margin: "4px 0 12px" }}>— OR upload a file —</div>
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
                      <div style={{ color: "#000", fontSize: 12 }}>Template loaded</div>
                    </div>
                    <span className="badge badge-blue" style={{ marginLeft: "auto" }}>Active</span>
                  </div>
                  <div style={{ marginBottom: 10, fontSize: 12, fontWeight: 700, color: "#000", textTransform: "uppercase", letterSpacing: ".06em" }}>Key Tech Stack</div>
                  <div className="tag-wrap" style={{ marginBottom: 14 }}>
                    {tpl.stack.map(s => <span key={s} className="tag tag-blue">{s}</span>)}
                  </div>
                  <div style={{ fontSize: 12, color: "#000", padding: "10px 12px", background: "var(--win-gray)", borderRadius: 8 }}>
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
                <div style={{ fontSize: 12, fontWeight: 700, color: "#000", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>Analysis will include</div>
                {["Role-specific keyword bank", "ATS scoring rubric for this role", "Tailored bullet point rewrites", "Stack-specific skill gap analysis"].map(f => (
                  <div key={f} style={{ display: "flex", gap: 8, fontSize: 13, marginBottom: 6 }}>
                    <span style={{ color: "var(--win-blue)", fontWeight: 700 }}>✓</span>{f}
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
            <ScoreCircle score={d.atsScore} color="#000080" label="ATS Score" />
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
                <span style={{ color: "#000" }}>{l}</span>
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
              {d.strengths.map(s => <div key={s} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 14 }}><span style={{ color: "#008000", fontWeight: 700 }}>✓</span>{s}</div>)}
            </div>
            <div className="card">
              <h3 style={{ marginBottom: 16, display: "flex", gap: 8 }}><span>⚠️</span> Weaknesses</h3>
              {d.weaknesses.map(s => <div key={s} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 14 }}><span style={{ color: "#cc0000", fontWeight: 700 }}>✗</span>{s}</div>)}
            </div>
            <div className="card" style={{ gridColumn: "1/-1" }}>
              <h3 style={{ marginBottom: 16 }}>⚡ Key Improvements</h3>
              <div className="grid-2">
                {d.improvements.map((s, i) => (
                  <div key={s} style={{ display: "flex", gap: 12, padding: "12px 14px", background: "var(--win-gray)", borderRadius: 10, fontSize: 14 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--win-blue)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
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
                <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--win-dark-gray)", fontSize: 14 }}>
                  <span style={{ color: "#008000" }}>✓</span>{i}
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
                  <div style={{ fontSize: 32, fontFamily: "inherit", fontWeight: 800, color: `var(--${c})` }}>{v}</div>
                  <div style={{ color: "#000", fontSize: 13, marginTop: 4 }}>{l} Keywords</div>
                </div>
              ))}
            </div>
            <div className="grid-3">
              <div className="card">
                <h4 style={{ marginBottom: 14, color: "#008000" }}>✓ Matched Keywords</h4>
                <div className="tag-wrap">{d.keywords.matched.map(k => <span className="tag tag-green" key={k}>{k}</span>)}</div>
              </div>
              <div className="card">
                <h4 style={{ marginBottom: 14, color: "#cc0000" }}>✗ Missing Keywords</h4>
                <div className="tag-wrap">{d.keywords.missing.map(k => <span className="tag tag-red" key={k}>{k}</span>)}</div>
              </div>
              <div className="card">
                <h4 style={{ marginBottom: 14, color: "#0000cc" }}>+ Suggested Keywords</h4>
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
                color={v >= 80 ? "#008000" : v >= 50 ? "#806000" : "#cc0000"} />
            ))}
            <div style={{ marginTop: 24, padding: 16, background: "var(--win-gray)", borderRadius: 10 }}>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>💡 Recommendation</div>
              <div style={{ fontSize: 14, color: "#000" }}>Add a Certifications section to increase your ATS score by approximately 8-12 points. Many ATS systems specifically scan for this section.</div>
            </div>
          </div>
        )}

        {/* Problems */}
        {tab === "problems" && (
          <div className="grid-2">
            {d.problems.map(p => (
              <div className="card" key={p} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(16,185,129,.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#008000", fontSize: 18 }}>✓</div>
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
      if (line.startsWith("**") && line.endsWith("**")) return <div key={i} style={{ fontWeight: 800, fontSize: 14, marginTop: 12, marginBottom: 4, color: "#000", fontFamily: "inherit" }}>{line.slice(2, -2)}</div>;
      if (line.startsWith("• ") || line.startsWith("- ")) return <div key={i} style={{ display: "flex", gap: 8, marginBottom: 3, fontSize: 14 }}><span style={{ color: "var(--win-blue)", flexShrink: 0, fontWeight: 700 }}>→</span><span>{line.slice(2)}</span></div>;
      if (line.trim() === "") return <div key={i} style={{ height: 6 }} />;
      return <div key={i} style={{ fontSize: 14, lineHeight: 1.7 }}>{line}</div>;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 540, background: "var(--win-gray)", border: "2px solid", borderColor: "var(--win-highlight) var(--win-shadow) var(--win-shadow) var(--win-highlight)", overflow: "hidden" }}>
      {/* Win2K title bar */}
      <div className="win-title-bar">
        <span><span className="win-title-icon">🤖</span> AI CV Coach — Powered by Claude</span>
        <div className="win-title-buttons">
          <span className="badge badge-blue" style={{ fontSize: 9 }}>CV</span>
          <span className="badge badge-blue" style={{ fontSize: 9 }}>JD</span>
        </div>
      </div>
      {/* Header */}
      <div style={{ padding: "4px 8px", background: "var(--win-gray)", borderBottom: "1px solid var(--win-dark-gray)", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ fontSize: 14 }}>🤖</div>
        <div>
          <div style={{ fontWeight: "bold", fontSize: 11 }}>AI CV Coach</div>
          <div style={{ color: "var(--win-blue)", fontSize: 10 }}>● Powered by Claude · Context-aware analysis active</div>
        </div>
      </div>

      {/* Quick prompts */}
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--win-dark-gray)", display: "flex", gap: 6, flexWrap: "wrap", background: "var(--win-gray)" }}>
        {quickPrompts.map(p => (
          <button key={p} onClick={() => sendFixed(p)} disabled={streaming}
            style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, border: "1px solid var(--win-dark-gray)", background: "var(--win-gray)", color: "#444", cursor: streaming ? "not-allowed" : "pointer", fontFamily: "'MS Sans Serif', inherit", fontWeight: 500, whiteSpace: "nowrap", transition: "all .15s" }}
            onMouseEnter={e => { if (!streaming) { e.target.style.borderColor = "var(--win-blue)"; e.target.style.color = "var(--win-blue)"; }}}
            onMouseLeave={e => { e.target.style.borderColor = "var(--win-dark-gray)"; e.target.style.color = "#444"; }}
          >{p}</button>
        ))}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px", display: "flex", flexDirection: "column", gap: 6, background: "#fff", borderTop: "2px solid var(--win-shadow)", borderLeft: "2px solid var(--win-shadow)", borderBottom: "2px solid var(--win-highlight)", borderRight: "2px solid var(--win-highlight)", margin: "4px 6px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 6, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: 22, height: 22, background: "var(--win-gray)", border: "1px solid var(--win-dark-gray)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, marginTop: 1 }}>🤖</div>
            )}
            <div style={{
              maxWidth: "80%", padding: "4px 8px",
              background: m.role === "user" ? "var(--win-blue)" : "var(--win-gray)",
              color: m.role === "user" ? "#fff" : "#000",
              border: "1px solid var(--win-dark-gray)",
              fontSize: 11, lineHeight: 1.5,
            }}>
              {m.role === "assistant" ? renderText(m.text) : m.text}
            </div>
            {m.role === "user" && (
              <div style={{ width: 22, height: 22, background: "var(--win-gray)", border: "1px solid var(--win-dark-gray)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, marginTop: 1 }}>👤</div>
            )}
          </div>
        ))}

        {/* Streaming message */}
        {streaming && streamText && (
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 22, height: 22, background: "var(--win-gray)", border: "1px solid var(--win-dark-gray)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>🤖</div>
            <div style={{ maxWidth: "80%", padding: "4px 8px", background: "var(--win-gray)", border: "1px solid var(--win-blue)", fontSize: 11, lineHeight: 1.5 }}>
              {renderText(streamText)}
              <span style={{ display: "inline-block", width: 6, height: 11, background: "var(--win-blue)", marginLeft: 2, animation: "blink 0.7s step-end infinite", verticalAlign: "text-bottom" }} />
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {streaming && !streamText && (
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 22, height: 22, background: "var(--win-gray)", border: "1px solid var(--win-dark-gray)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>🤖</div>
            <div style={{ padding: "4px 8px", background: "var(--win-gray)", border: "1px solid var(--win-dark-gray)", display: "flex", gap: 3, alignItems: "center" }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 5, height: 5, background: "var(--win-blue)", animation: `bounce 1s ease ${i * 0.15}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "4px 6px", borderTop: "1px solid var(--win-dark-gray)", display: "flex", gap: 4, background: "var(--win-gray)" }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendFixed(input)}
          placeholder="Ask the AI to rewrite a section, improve bullet points, add keywords…"
          disabled={streaming}
          style={{ flex: 1, padding: "10px 14px", border: "1.5px solid var(--win-dark-gray)", borderRadius: 10, fontSize: 13, fontFamily: "'MS Sans Serif', inherit", outline: "none", transition: "border-color .2s" }}
          onFocus={e => e.target.style.borderColor = "var(--win-blue)"}
          onBlur={e => e.target.style.borderColor = "var(--win-dark-gray)"}
        />
        <button onClick={() => sendFixed(input)} disabled={streaming || !input.trim()}
          style={{ width: 23, height: 23, background: input.trim() && !streaming ? "var(--win-blue)" : "var(--win-gray)", border: "2px solid", borderColor: "var(--win-highlight) var(--win-shadow) var(--win-shadow) var(--win-highlight)", cursor: input.trim() && !streaming ? "pointer" : "not-allowed", color: input.trim() && !streaming ? "#fff" : "#808080", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
      border: applied ? "2px solid var(--win-blue)" : "2px solid", 
      borderColor: applied ? "var(--win-blue)" : "var(--win-highlight) var(--win-shadow) var(--win-shadow) var(--win-highlight)",
      marginBottom: 8,
      background: applied ? "#e8f0ff" : "var(--win-gray)",
    }}>
      {/* Section header */}
      <div style={{ padding: "6px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--win-dark-gray)", background: applied ? "var(--win-blue)" : "var(--win-title-active)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `rgba(${section.color},0.12)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{section.icon}</div>
          <div>
            <div style={{ fontWeight: "bold", fontSize: 12, fontFamily: "inherit", color: "#fff" }}>{section.label}</div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>{section.desc}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {applied && <span className="badge badge-blue">✓ Applied</span>}
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
            <div style={{ fontSize: 11, fontWeight: 700, color: "#000", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: "#cc0000", display: "inline-block" }} /> Original
            </div>
            <div style={{ background: "rgba(239,68,68,.03)", border: "1px solid rgba(239,68,68,.1)", borderRadius: 10, padding: "14px 16px", fontSize: 13.5, color: "#444", lineHeight: 1.75, minHeight: 80, whiteSpace: "pre-wrap" }}>
              {original}
            </div>
          </div>

          {/* Improved */}
          {improved && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--win-blue)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--win-blue)", display: "inline-block" }} />
                AI Improved {streaming && <span style={{ width: 6, height: 6, borderRadius: 3, background: "var(--win-blue)", display: "inline-block", animation: "blink 0.7s step-end infinite" }} />}
              </div>
              {showEdit ? (
                <textarea
                  value={edited}
                  onChange={e => setEdited(e.target.value)}
                  style={{ width: "100%", background: "rgba(0,0,128,0.08)", border: "1.5px solid var(--win-blue)", borderRadius: 10, padding: "14px 16px", fontSize: 13.5, lineHeight: 1.75, minHeight: 120, fontFamily: "'MS Sans Serif', inherit", outline: "none", color: "#000" }}
                />
              ) : (
                <div style={{ background: "rgba(0,0,128,0.08)", border: "1.5px solid rgba(0,0,128,0.25)", borderRadius: 10, padding: "14px 16px", fontSize: 13.5, color: "#000", lineHeight: 1.75, minHeight: 80, whiteSpace: "pre-wrap" }}>
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
            <div style={{ fontFamily: "inherit", fontSize: 32, fontWeight: 800, color: "#000" }}>{mockAnalysis.atsScore}</div>
            <div style={{ fontSize: 12, color: "#000", marginTop: 3 }}>Current ATS Score</div>
          </div>
          <div className="card" style={{ textAlign: "center", padding: "20px 14px", border: "2px solid var(--win-blue)", background: "rgba(0,0,128,0.08)" }}>
            <div style={{ fontFamily: "inherit", fontSize: 32, fontWeight: 800, color: "var(--win-blue)" }}>{projectedScore}</div>
            <div style={{ fontSize: 12, color: "#000", marginTop: 3 }}>Projected Score</div>
            {scoreBoost > 0 && <div style={{ fontSize: 11, color: "var(--win-blue)", fontWeight: 700, marginTop: 4 }}>+{scoreBoost} pts gained</div>}
          </div>
          <div className="card" style={{ textAlign: "center", padding: "20px 14px" }}>
            <div style={{ fontFamily: "inherit", fontSize: 32, fontWeight: 800, color: "#0000cc" }}>{appliedCount} / {sections.length}</div>
            <div style={{ fontSize: 12, color: "#000", marginTop: 3 }}>Sections Improved</div>
          </div>
          <div className="card" style={{ textAlign: "center", padding: "20px 14px" }}>
            <div style={{ fontFamily: "inherit", fontSize: 32, fontWeight: 800, color: "#806000" }}>+{totalPossibleBoost}</div>
            <div style={{ fontSize: 12, color: "#000", marginTop: 3 }}>Max Score Gain</div>
          </div>
        </div>

        {/* Tab toggle — Win2k tab control style */}
        <div className="tabs" style={{ marginBottom: 12 }}>
          <button className={`tab ${view === "rewriter" ? "active" : ""}`} onClick={() => setView("rewriter")}>
            🤖 Section Rewriter
          </button>
          <button className={`tab ${view === "chat" ? "active" : ""}`} onClick={() => setView("chat")}>
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
              <div style={{ textAlign: "center", padding: "16px 12px", background: "#e8f0ff", border: "2px solid var(--win-blue)", marginTop: 4 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
                <div style={{ fontFamily: "inherit", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>All sections optimized!</div>
                <div style={{ color: "#000", marginBottom: 24 }}>Your CV is now ATS-optimized. Estimated score: {projectedScore}/100</div>
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
        <div style={{ display: "flex", gap: 0, marginBottom: 32, background: "var(--win-gray)", borderRadius: 12, border: "1px solid var(--win-dark-gray)", overflow: "hidden" }}>
          {steps.map((s, i) => (
            <div key={s} onClick={() => setStep(i)} style={{ flex: 1, padding: "12px 8px", textAlign: "center", cursor: "pointer", borderRight: i < steps.length - 1 ? "1px solid var(--win-dark-gray)" : "none", background: step === i ? "var(--win-blue)" : step > i ? "rgba(0,0,128,0.1)" : "var(--win-gray)", transition: "all .2s" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: step === i ? "#fff" : step > i ? "var(--win-blue)" : "#000", textTransform: "uppercase", letterSpacing: ".06em" }}>{i + 1}. {s}</div>
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
                    <div key={t.id} onClick={() => setTemplate(t.id)} style={{ padding: "16px 18px", border: `2px solid ${template === t.id ? "var(--win-blue)" : "var(--win-dark-gray)"}`, borderRadius: 10, cursor: "pointer", background: template === t.id ? "rgba(0,0,128,0.05)" : "var(--win-gray)" }}>
                      <div style={{ fontWeight: 700, marginBottom: 3 }}>{t.name}</div>
                      <div style={{ fontSize: 13, color: "#000" }}>{t.desc}</div>
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
            <div style={{ padding: "14px 18px", background: "#000", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>Live Preview — {templates.find(t => t.id === template)?.name}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-sm" style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "none" }}>⬇ PDF</button>
                <button className="btn btn-sm" style={{ background: "rgba(255,255,255,.1)", color: "#fff", border: "none" }}>⬇ DOCX</button>
              </div>
            </div>
            <div style={{ padding: 20, maxHeight: 580, overflowY: "auto" }}>
              <div className="cv-preview">
                <div style={{ textAlign: "center", marginBottom: 16, borderBottom: "2px solid #000", paddingBottom: 14 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "inherit" }}>{form.name || "Your Name"}</div>
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
          {[["📄", "3", "CVs Uploaded", "rgba(59,130,246,.1)"], ["📊", "8", "Analyses Run", "rgba(0,0,128,0.1)"], ["⭐", "85", "Best Score", "rgba(245,158,11,.1)"], ["🎯", "3", "Targeted Jobs", "rgba(139,92,246,.1)"]].map(([icon, val, lbl, bg]) => (
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
              <div key={cv.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid var(--win-dark-gray)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--win-gray)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📄</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{cv.name}</div>
                  <div style={{ color: "#000", fontSize: 12 }}>{cv.date}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "inherit", fontWeight: 800, fontSize: 20, color: cv.score >= 80 ? "#008000" : cv.score >= 65 ? "#806000" : "#cc0000" }}>{cv.score}</div>
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
              <div key={j.title} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid var(--win-dark-gray)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(59,130,246,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💼</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{j.title}</div>
                  <div style={{ color: "#000", fontSize: 12 }}>{j.company}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "inherit", fontWeight: 800, fontSize: 18, color: "#0000cc" }}>{j.match}%</div>
                  <div style={{ fontSize: 11, color: "#000" }}>Match</div>
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
                { n: 1, text: "CV 'software_engineer_cv.pdf' analyzed — ATS Score: 72", time: "2 hours ago", c: "var(--win-blue)" },
                { n: 2, text: "Added job: Senior Frontend Engineer at Acme Corp — 68% match", time: "2 hours ago", c: "#0000cc" },
                { n: 3, text: "CV 'product_manager_cv.docx' optimized — Score improved 61 → 85", time: "1 week ago", c: "#008000" },
                { n: 4, text: "New CV uploaded: data_analyst_cv.pdf", time: "2 weeks ago", c: "#806000" },
              ].map((a, i) => (
                <div className="tl-item" key={i}>
                  <div className="tl-dot" style={{ background: a.c }}>{a.n}</div>
                  <div style={{ fontSize: 14 }}>{a.text}</div>
                  <div style={{ color: "#000", fontSize: 12, marginTop: 3 }}>{a.time}</div>
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
      name: "Free", price: 0, per: "", color: "#444",
      features: ["1 CV analysis per month", "Basic ATS score", "Top 5 missing keywords", "Formatting check", "Limited suggestions"],
      cta: "Get Started Free", featured: false,
    },
    {
      name: "Pro", price: annual ? 15 : 19, per: "/month", color: "var(--win-blue)",
      features: ["Unlimited CV analyses", "Full keyword analysis", "AI-powered rewrites", "Download improved CV", "Section-by-section score", "Job description matching", "Priority support"],
      cta: "Start Pro Trial", featured: true,
    },
    {
      name: "Premium", price: annual ? 29 : 39, per: "/month", color: "#804080",
      features: ["Everything in Pro", "ATS-friendly CV templates", "Cover letter generator", "LinkedIn profile optimizer", "Interview tips & prep", "Unlimited job targeting", "Dedicated success manager"],
      cta: "Start Premium Trial", featured: false,
    },
  ];

  return (
    <>
      <div className="page-header" style={{ textAlign: "center" }}>
        <div className="container">
          <div className="badge badge-blue" style={{ marginBottom: 12 }}>Pricing</div>
          <h1 style={{ fontSize: 44 }}>Simple, transparent pricing</h1>
          <p style={{ color: "#000", fontSize: 17, marginTop: 10 }}>Start free, upgrade when you're ready.</p>
          <div style={{ display: "flex", gap: 0, justifyContent: "center", marginTop: 24, background: "var(--win-dark-gray)", borderRadius: 10, padding: 4, width: "fit-content", margin: "24px auto 0" }}>
            <button onClick={() => setAnnual(false)} className="btn btn-sm" style={{ background: !annual ? "var(--win-gray)" : "transparent", color: !annual ? "#000" : "#000", border: "none", boxShadow: !annual ? "0 1px 4px rgba(0,0,0,.1)" : "none" }}>Monthly</button>
            <button onClick={() => setAnnual(true)} className="btn btn-sm" style={{ background: annual ? "var(--win-gray)" : "transparent", color: annual ? "#000" : "#000", border: "none", boxShadow: annual ? "0 1px 4px rgba(0,0,0,.1)" : "none" }}>Annual <span style={{ color: "var(--win-blue)", fontSize: 11, fontWeight: 700 }}>Save 20%</span></button>
          </div>
        </div>
      </div>
      <div className="container" style={{ maxWidth: 940 }}>
        <div className="grid-3">
          {plans.map(p => (
            <div className={`pricing-card ${p.featured ? "featured" : ""}`} key={p.name}>
              {p.featured && <div className="pricing-badge"><span className="badge badge-blue">Most Popular</span></div>}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "inherit", fontWeight: 800, fontSize: 20, marginBottom: 4, color: p.color }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span className="price-num">${p.price}</span>
                  <span className="price-per">{p.per}</span>
                </div>
              </div>
              <div style={{ borderTop: "1px solid var(--win-dark-gray)", paddingTop: 20, marginBottom: 24 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 14 }}>
                    <span style={{ color: p.color, fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <button className={`btn btn-full ${p.featured ? "btn-primary" : "btn-secondary"}`} onClick={() => nav("upload")} style={p.name === "Premium" ? { background: "#804080", color: "#fff", border: "none" } : {}}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 40, color: "#000", fontSize: 14 }}>
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
              ? <textarea value={sampleLetter} readOnly style={{ minHeight: 400, fontSize: 13, lineHeight: 1.8, color: "#000" }} />
              : <div style={{ minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontSize: 14, textAlign: "center", padding: 40, background: "var(--win-gray)", borderRadius: 10 }}>
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
        <div style={{ border: "1px solid var(--win-dark-gray)", padding: 12, background: "var(--win-gray)", marginBottom: 4 }}>
          <div className="grid-4">
            <div>
              <div className="footer-brand"><span>⬡</span> ATSPro</div>
              <p style={{ fontSize: 11, color: "#000", lineHeight: 1.6, marginTop: 4 }}>AI-powered CV optimization to help you land more interviews.</p>
            </div>
            {[
              { title: "Product", links: [["Upload CV", "upload"], ["CV Builder", "builder"], ["Pricing", "pricing"], ["Dashboard", "dashboard"]] },
              { title: "Tools", links: [["Cover Letter", "coverletter"], ["ATS Checker", "upload"], ["Interview Tips", "home"], ["Resources", "home"]] },
              { title: "Company", links: [["About", "home"], ["Contact", "home"], ["Privacy Policy", "home"], ["Terms of Service", "home"]] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ color: "#000", fontWeight: "bold", fontSize: 11, marginBottom: 6 }}>{col.title}</div>
                <div className="footer-links">
                  {col.links.map(([l, p]) => <button key={l} className="footer-link" onClick={() => nav(p)}>{l}</button>)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="footer-bottom" style={{ color: "#000" }}>
          <span>© 2025 ATSPro · Built with AI · All rights reserved · Microsoft Internet Explorer 6.0 recommended</span>
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
        {/* Win2K Taskbar */}
        <nav className="nav">
          <div className="nav-brand" onClick={() => nav("home")}>
            <span style={{ marginRight: 3 }}>⬡</span> ATSPro
          </div>
          <div className="nav-links">
            {navLinks.map(l => (
              <button key={l.key} className={`nav-link ${page === l.key ? "active" : ""}`} onClick={() => nav(l.key)}>{l.label}</button>
            ))}
          </div>
          <div className="nav-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => nav("dashboard")}>Sign In</button>
            <button className="btn btn-primary btn-sm" onClick={() => nav("upload")}>Start Free</button>
            {/* Clock */}
            <div style={{ padding: "2px 8px", background: "var(--win-gray)", borderTop: "1px solid var(--win-shadow)", borderLeft: "1px solid var(--win-shadow)", borderBottom: "1px solid var(--win-highlight)", borderRight: "1px solid var(--win-highlight)", fontSize: 11, display: "flex", alignItems: "center" }}>
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </nav>

        {/* Win2K Desktop area */}
        <div style={{ background: "var(--win-desktop)", flex: 1, padding: 6 }}>
          {/* Main application window */}
          <div style={{ background: "var(--win-gray)", border: "2px solid", borderColor: "var(--win-highlight) var(--win-shadow) var(--win-shadow) var(--win-highlight)", minHeight: "calc(100vh - 60px)" }}>
            <div className="win-title-bar">
              <span>
                <span className="win-title-icon">📊</span>
                ATSPro — {page === "home" ? "Welcome" : page === "upload" ? "Upload CV" : page === "jobdesc" ? "Job Description" : page === "results" ? "Analysis Results" : page === "improve" ? "AI Improve" : page === "builder" ? "CV Builder" : page === "dashboard" ? "Dashboard" : page === "pricing" ? "Pricing" : "Cover Letter Generator"}
              </span>
              <div className="win-title-buttons">
                <div className="win-title-btn">_</div>
                <div className="win-title-btn">□</div>
                <div className="win-title-btn close">✕</div>
              </div>
            </div>
            {/* Menu bar */}
            <div style={{ background: "var(--win-gray)", borderBottom: "1px solid var(--win-dark-gray)", padding: "2px 4px", display: "flex", gap: 0 }}>
              {["File", "Edit", "View", "Tools", "Help"].map(m => (
                <button key={m} style={{ background: "none", border: "none", fontFamily: "inherit", fontSize: 11, padding: "2px 8px", cursor: "pointer", color: "#000" }}
                  onMouseEnter={e => { e.target.style.background = "var(--win-blue)"; e.target.style.color = "#fff"; }}
                  onMouseLeave={e => { e.target.style.background = "none"; e.target.style.color = "#000"; }}
                >{m}</button>
              ))}
            </div>
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
          </div>
        </div>

        <Footer nav={nav} />
      </div>
    </>
  );
}
