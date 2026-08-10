import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  RefreshCw,
  Palette,
  Search,
  MapPin,
  Hammer,
  Upload,
  Copy,
  Check,
  Globe,
  Trash2,
  ArrowLeft,
  Receipt,
  Plus,
  X,
  Send,
} from "lucide-react";

const VIBES = {
  minimal: {
    label: "Minimal",
    tone: "plainspoken, confident, no fluff",
    bg: "#FFFFFF",
    panel: "#F4F4F2",
    text: "#1A1A1A",
    sub: "#5B5B5B",
    accent: "#2E5EAA",
    swatch: ["#FFFFFF", "#2E5EAA", "#1A1A1A"],
  },
  warm: {
    label: "Warm",
    tone: "friendly, inviting, personal",
    bg: "#FBEFE7",
    panel: "#F6E1D3",
    text: "#3D2A22",
    sub: "#6B4E3D",
    accent: "#C1502E",
    swatch: ["#FBEFE7", "#C1502E", "#3D2A22"],
  },
  bold: {
    label: "Bold",
    tone: "energetic, direct, punchy",
    bg: "#0B1E33",
    panel: "#14304F",
    text: "#F4F7FA",
    sub: "#A9C0D6",
    accent: "#F5C518",
    swatch: ["#0B1E33", "#F5C518", "#F4F7FA"],
  },
  fresh: {
    label: "Fresh",
    tone: "light, modern, optimistic",
    bg: "#EAF6F0",
    panel: "#D9EEE3",
    text: "#1F3D2E",
    sub: "#3E6152",
    accent: "#FF6F59",
    swatch: ["#EAF6F0", "#FF6F59", "#1F3D2E"],
  },
};

const BUSINESS_TYPES = [
  "Café / restaurant",
  "Salon / spa",
  "Fitness studio",
  "Freelancer / consultant",
  "Local shop",
  "Event / venue",
];

const LOADING_LINES = [
  "Reading your brief…",
  "Sketching the layout…",
  "Choosing the palette…",
  "Writing the copy…",
  "Inking the details…",
];

const LEAD_LOADING_LINES = [
  "Scanning the area…",
  "Checking who's online…",
  "Checking who isn't…",
  "Flagging the gaps…",
];

function slugify(name) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || "site"}-${suffix}`;
}

function AnvilMark({ size = 22, color = "#FFB627" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M5 12 L27 12 L23 17 L17 17 L17 22 L20 22 L20 25 L12 25 L12 22 L15 22 L15 17 L9 17 Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <rect x="14.3" y="8" width="3.4" height="4" fill={color} />
    </svg>
  );
}

function BlueprintGrid() {
  return <div className="anv-grid" aria-hidden="true" />;
}

function WireframePreview() {
  return (
    <div className="anv-wire">
      <div className="anv-wire-row">
        <div className="anv-wire-box" style={{ width: "34%" }} />
        <div className="anv-wire-box" style={{ width: "18%" }} />
      </div>
      <div className="anv-wire-box anv-wire-hero" />
      <div className="anv-wire-row anv-wire-cards">
        <div className="anv-wire-box" style={{ flex: 1 }} />
        <div className="anv-wire-box" style={{ flex: 1 }} />
        <div className="anv-wire-box" style={{ flex: 1 }} />
      </div>
      <div className="anv-wire-box" style={{ width: "60%", height: 40 }} />
      <span className="anv-wire-label">nothing drafted yet</span>
    </div>
  );
}

function LeadCard({ lead, onDraft }) {
  return (
    <div className="anv-lead">
      <div className="anv-lead-stamp">NO SITE ON FILE</div>
      <span className="anv-label" style={{ marginBottom: 4 }}>{lead.category}</span>
      <h3 className="anv-lead-name">{lead.name}</h3>
      {lead.neighborhood && <p className="anv-lead-sub">{lead.neighborhood}</p>}
      <p className="anv-lead-status">{lead.webStatus}</p>
      <div className="anv-lead-footer">
        <span className="anv-lead-contact">{lead.contact}</span>
        <button className="anv-btn anv-btn-ghost anv-btn-sm" onClick={() => onDraft(lead)}>
          <Hammer size={13} /> Draft them a site
        </button>
      </div>
    </div>
  );
}

function DirectoryCard({ entry, onOpen }) {
  const v = VIBES[entry.vibe] || VIBES.warm;
  return (
    <button className="anv-dir-card" onClick={() => onOpen(entry)}>
      <span className="anv-dir-dots">
        <span style={{ background: v.accent }} />
      </span>
      <span className="anv-dir-name">{entry.site.businessName}</span>
      <span className="anv-dir-tagline">{entry.site.tagline}</span>
      <span className="anv-dir-url">anvil.site/{entry.slug}</span>
    </button>
  );
}

function SitePreview({ site, vibe }) {
  const v = VIBES[vibe];
  return (
    <div
      className="anv-site"
      style={{ background: v.bg, color: v.text, "--accent": v.accent }}
    >
      <nav className="anv-site-nav" style={{ borderColor: v.panel }}>
        <span className="anv-site-brand">{site.businessName}</span>
        <span className="anv-site-cta-ghost" style={{ color: v.accent, borderColor: v.accent }}>
          {site.cta}
        </span>
      </nav>

      <header className="anv-site-hero">
        <h1>{site.tagline}</h1>
        <p style={{ color: v.sub }}>{site.heroText}</p>
        <button className="anv-site-cta" style={{ background: v.accent, color: v.bg }}>
          {site.cta} <ArrowRight size={14} style={{ verticalAlign: "-2px" }} />
        </button>
      </header>

      <section className="anv-site-services">
        {site.services.map((s, i) => (
          <div className="anv-site-card" key={i} style={{ background: v.panel }}>
            <span className="anv-site-num" style={{ color: v.accent }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3>{s.title}</h3>
            <p style={{ color: v.sub }}>{s.blurb}</p>
          </div>
        ))}
      </section>

      <section className="anv-site-about" style={{ background: v.panel }}>
        <p>{site.about}</p>
      </section>

      <section className="anv-site-quote">
        <p>&ldquo;{site.quote}&rdquo;</p>
        <span style={{ color: v.sub }}>— {site.quoteAuthor}</span>
      </section>

      <footer className="anv-site-footer" style={{ borderColor: v.panel }}>
        <span>{site.businessName}</span>
        <button className="anv-site-cta" style={{ background: v.accent, color: v.bg }}>
          {site.cta}
        </button>
      </footer>
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState("input"); // input | loading | result | error
  const [description, setDescription] = useState("");
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [vibe, setVibe] = useState("warm");
  const [site, setSite] = useState(null);
  const [loadingLine, setLoadingLine] = useState(LOADING_LINES[0]);
  const [errorMsg, setErrorMsg] = useState("");
  const intervalRef = useRef(null);

  const [mode, setMode] = useState("build"); // build | leads | directory
  const [leadArea, setLeadArea] = useState("");
  const [leadType, setLeadType] = useState("Any type");
  const [leadStage, setLeadStage] = useState("idle"); // idle | loading | result | error
  const [leads, setLeads] = useState([]);
  const [leadErrorMsg, setLeadErrorMsg] = useState("");
  const [leadLoadingLine, setLeadLoadingLine] = useState(LEAD_LOADING_LINES[0]);
  const leadIntervalRef = useRef(null);

  const [publishState, setPublishState] = useState("idle"); // idle | publishing | published | error
  const [publishedSlug, setPublishedSlug] = useState(null);
  const [copied, setCopied] = useState(false);

  const [directory, setDirectory] = useState([]);
  const [directoryStage, setDirectoryStage] = useState("idle"); // idle | loading | result | error
  const [viewingEntry, setViewingEntry] = useState(null);

  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceFrom, setInvoiceFrom] = useState("");
  const [invoiceClientEmail, setInvoiceClientEmail] = useState("");
  const [invoiceDueDate, setInvoiceDueDate] = useState("");
  const [invoiceNotes, setInvoiceNotes] = useState("");
  const [invoiceItems, setInvoiceItems] = useState([{ desc: "Website design & launch", amount: "500" }]);
  const [invoiceCopied, setInvoiceCopied] = useState(false);

  useEffect(() => {
    if (stage === "loading") {
      let i = 0;
      intervalRef.current = setInterval(() => {
        i = (i + 1) % LOADING_LINES.length;
        setLoadingLine(LOADING_LINES[i]);
      }, 850);
      return () => clearInterval(intervalRef.current);
    }
  }, [stage]);

  useEffect(() => {
    if (leadStage === "loading") {
      let i = 0;
      leadIntervalRef.current = setInterval(() => {
        i = (i + 1) % LEAD_LOADING_LINES.length;
        setLeadLoadingLine(LEAD_LOADING_LINES[i]);
      }, 900);
      return () => clearInterval(leadIntervalRef.current);
    }
  }, [leadStage]);

  useEffect(() => {
    if (mode === "directory" && directoryStage === "idle") {
      loadDirectory();
    }
  }, [mode]);

  async function draft() {
    if (!description.trim()) return;
    setStage("loading");
    setErrorMsg("");

    const systemPrompt = `You write concise, punchy small-business website copy. Given a business description, a business type, and a tone, output ONLY a JSON object (no markdown fences, no preamble, no commentary) with exactly these fields:
{
  "businessName": string (short, real-sounding business name, not generic placeholders),
  "tagline": string (under 8 words, punchy, no period),
  "heroText": string (1-2 sentences expanding the tagline),
  "services": [ {"title": string (2-4 words)", "blurb": string (under 16 words)}, three items total ],
  "about": string (2-3 sentences, warm and specific to the description given),
  "cta": string (2-4 words, button label, active voice),
  "quote": string (a short customer testimonial, under 25 words),
  "quoteAuthor": string (a plausible customer first name, last initial, plus a short descriptor)
}
Tone to match: ${VIBES[vibe].tone}.`;

    const userPrompt = `Business type: ${businessType}\nDescription: ${description.trim()}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });

      const data = await response.json();
      const textBlock = (data.content || []).find((b) => b.type === "text");
      if (!textBlock) throw new Error("No response content");

      const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      if (
        !parsed.businessName ||
        !parsed.tagline ||
        !Array.isArray(parsed.services) ||
        parsed.services.length === 0
      ) {
        throw new Error("Incomplete draft");
      }

      setSite(parsed);
      setStage("result");
      setPublishState("idle");
      setPublishedSlug(null);
    } catch (err) {
      setErrorMsg("The draft didn't come through cleanly. Try again?");
      setStage("error");
    }
  }

  function reset() {
    setStage("input");
    setSite(null);
    setDescription("");
    setPublishState("idle");
    setPublishedSlug(null);
    setShowInvoice(false);
    setInvoiceNumber("");
  }

  async function loadDirectory() {
    setDirectoryStage("loading");
    try {
      const listResult = await window.storage.list("site:", true);
      const keys = (listResult && listResult.keys) || [];
      const entries = await Promise.all(
        keys.map(async (key) => {
          try {
            const result = await window.storage.get(key, true);
            if (!result) return null;
            const parsed = JSON.parse(result.value);
            return { slug: key.replace(/^site:/, ""), ...parsed };
          } catch {
            return null;
          }
        })
      );
      const clean = entries.filter(Boolean).sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
      setDirectory(clean);
      setDirectoryStage("result");
    } catch (err) {
      setDirectoryStage("error");
    }
  }

  async function publishSite() {
    if (!site) return;
    setPublishState("publishing");
    const slug = publishedSlug || slugify(site.businessName);
    try {
      const payload = JSON.stringify({ site, vibe, publishedAt: Date.now() });
      const result = await window.storage.set(`site:${slug}`, payload, true);
      if (!result) throw new Error("Publish failed");
      setPublishedSlug(slug);
      setPublishState("published");
    } catch (err) {
      setPublishState("error");
    }
  }

  async function unpublishSite() {
    if (!publishedSlug) return;
    try {
      await window.storage.delete(`site:${publishedSlug}`, true);
    } catch {
      // best effort
    }
    setPublishState("idle");
    setPublishedSlug(null);
  }

  function copyLink() {
    const url = `anvil.site/${publishedSlug}`;
    try {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — the link is shown on screen either way
    }
  }

  function openInvoice() {
    if (!invoiceNumber) setInvoiceNumber(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
    setShowInvoice(true);
  }

  function updateInvoiceItem(index, field, value) {
    setInvoiceItems((items) => items.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  }

  function addInvoiceItem() {
    setInvoiceItems((items) => [...items, { desc: "", amount: "" }]);
  }

  function removeInvoiceItem(index) {
    setInvoiceItems((items) => items.filter((_, i) => i !== index));
  }

  const invoiceTotal = invoiceItems.reduce((sum, it) => sum + (parseFloat(it.amount) || 0), 0);

  function buildInvoiceText() {
    const lines = invoiceItems
      .filter((it) => it.desc.trim())
      .map((it) => `- ${it.desc}: $${(parseFloat(it.amount) || 0).toFixed(2)}`)
      .join("\n");
    return [
      `Invoice ${invoiceNumber}`,
      `From: ${invoiceFrom || "—"}`,
      `To: ${site ? site.businessName : "—"}`,
      invoiceDueDate ? `Due: ${invoiceDueDate}` : null,
      "",
      "Items:",
      lines,
      "",
      `Total: $${invoiceTotal.toFixed(2)}`,
      invoiceNotes ? `\nNotes: ${invoiceNotes}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");
  }

  function copyInvoice() {
    try {
      navigator.clipboard.writeText(buildInvoiceText());
      setInvoiceCopied(true);
      setTimeout(() => setInvoiceCopied(false), 1600);
    } catch {
      // clipboard unavailable
    }
  }

  function invoiceMailto() {
    const subject = encodeURIComponent(`Invoice ${invoiceNumber} — ${site ? site.businessName : ""}`);
    const body = encodeURIComponent(buildInvoiceText());
    return `mailto:${invoiceClientEmail}?subject=${subject}&body=${body}`;
  }

  async function findLeads() {
    if (!leadArea.trim()) return;
    setLeadStage("loading");
    setLeadErrorMsg("");

    const systemPrompt = `You help people find real local businesses that could use a website. Use web search to find actual businesses in the requested area. Prioritize ones whose only online presence is a Google Business listing, a Facebook/Instagram page, or a directory listing — i.e. no real website. Then output ONLY a JSON object (no markdown fences, no preamble, no commentary) with exactly these fields:
{
  "area": string (the area you searched, as given),
  "businesses": [
    {
      "name": string (real business name),
      "category": string (2-4 words, e.g. "Family-owned bakery"),
      "neighborhood": string (short local area/street, or "" if unknown),
      "webStatus": string (short note, e.g. "No website — Facebook page only" or "No online presence found beyond a Google listing"),
      "contact": string (phone number if you found one, otherwise "Via Google Business listing")
    }
  ]
}
Return up to 6 businesses. Only include businesses you have reasonable evidence lack a proper website. If you can't find enough, return fewer rather than guessing.`;

    const typeNote = leadType === "Any type" ? "" : ` Business type to focus on: ${leadType}.`;
    const userPrompt = `Area: ${leadArea.trim()}.${typeNote}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
          tools: [{ type: "web_search_20250305", name: "web_search" }],
        }),
      });

      const data = await response.json();
      const textBlocks = (data.content || []).filter((b) => b.type === "text");
      if (textBlocks.length === 0) throw new Error("No response content");
      const finalText = textBlocks[textBlocks.length - 1].text;

      const cleaned = finalText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      if (!Array.isArray(parsed.businesses)) throw new Error("Malformed result");

      setLeads(parsed.businesses);
      setLeadStage("result");
    } catch (err) {
      setLeadErrorMsg("Couldn't pull a clean list for that area. Try again, or narrow it down?");
      setLeadStage("error");
    }
  }

  function draftForLead(lead) {
    setBusinessType(
      BUSINESS_TYPES.find((t) => lead.category.toLowerCase().includes(t.toLowerCase().split(" ")[0])) ||
        BUSINESS_TYPES[0]
    );
    setDescription(
      `${lead.name}, a ${lead.category.toLowerCase()} in ${lead.neighborhood || leadArea}. Currently ${lead.webStatus.toLowerCase()}.`
    );
    setMode("build");
    setStage("input");
  }

  return (
    <div className="anv-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap');

        .anv-app {
          min-height: 100%;
          background: #0B1E30;
          background-image:
            linear-gradient(rgba(127,184,217,0.10) 1px, transparent 1px),
            linear-gradient(90deg, rgba(127,184,217,0.10) 1px, transparent 1px);
          background-size: 28px 28px;
          font-family: 'Inter', sans-serif;
          color: #EAF2F7;
          padding: 32px 20px 60px;
          box-sizing: border-box;
        }
        .anv-app * { box-sizing: border-box; }

        .anv-header {
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: 880px;
          margin: 0 auto 28px;
        }
        .anv-wordmark {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 20px;
          letter-spacing: 0.02em;
        }
        .anv-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7FA9C4;
          margin-left: auto;
        }

        .anv-tabs {
          max-width: 880px;
          margin: 0 auto 20px;
          display: flex;
          gap: 6px;
          border-bottom: 1px solid rgba(127,184,217,0.2);
        }
        .anv-tab {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12.5px;
          letter-spacing: 0.03em;
          background: transparent;
          border: none;
          color: #7FA9C4;
          padding: 10px 4px;
          margin-right: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          border-bottom: 2px solid transparent;
        }
        .anv-tab.active { color: #FFB627; border-color: #FFB627; }

        .anv-btn-sm { padding: 7px 12px; font-size: 12.5px; }

        .anv-lead-grid {
          max-width: 880px;
          margin: 20px auto 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        .anv-lead {
          position: relative;
          background: #12293F;
          border: 1px solid rgba(127,184,217,0.25);
          border-radius: 10px;
          padding: 18px;
          overflow: hidden;
        }
        .anv-lead-stamp {
          position: absolute;
          top: 14px;
          right: -30px;
          background: transparent;
          color: #E8873A;
          border: 2px solid #E8873A;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9.5px;
          font-weight: 500;
          letter-spacing: 0.06em;
          padding: 3px 34px;
          transform: rotate(28deg);
          opacity: 0.85;
        }
        .anv-lead-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 17px;
          margin: 2px 0 2px;
          max-width: 80%;
        }
        .anv-lead-sub {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          color: #7FA9C4;
          margin: 0 0 10px;
        }
        .anv-lead-status {
          font-size: 13px;
          color: #C7DAE8;
          margin: 0 0 16px;
          max-width: 82%;
        }
        .anv-lead-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }
        .anv-lead-contact {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          color: #547189;
        }

        .anv-publish-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          color: #4ADE80;
        }
        .anv-live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #4ADE80;
          box-shadow: 0 0 6px 1px rgba(74,222,128,0.7);
        }
        .anv-share-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .anv-share-url {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: #C7DAE8;
          background: #0B1E30;
          border: 1px solid rgba(127,184,217,0.3);
          border-radius: 6px;
          padding: 6px 10px;
        }

        .anv-dir-grid {
          max-width: 880px;
          margin: 20px auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .anv-dir-card {
          text-align: left;
          background: #12293F;
          border: 1px solid rgba(127,184,217,0.25);
          border-radius: 10px;
          padding: 16px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 6px;
          color: inherit;
        }
        .anv-dir-card:hover { border-color: #FFB627; }
        .anv-dir-dots span {
          display: inline-block;
          width: 10px; height: 10px; border-radius: 50%;
        }
        .anv-dir-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
        }
        .anv-dir-tagline {
          font-size: 12.5px;
          color: #A9C0D6;
        }
        .anv-dir-url {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10.5px;
          color: #547189;
          margin-top: 4px;
        }

        @media (max-width: 640px) {
          .anv-lead-grid { grid-template-columns: 1fr; }
          .anv-dir-grid { grid-template-columns: 1fr; }
        }

        .anv-item-row {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-bottom: 8px;
        }
        .anv-item-input {
          background: #0B1E30;
          border: 1px solid rgba(127,184,217,0.3);
          border-radius: 6px;
          color: #EAF2F7;
          font-family: 'Inter', sans-serif;
          font-size: 13.5px;
          padding: 8px 10px;
          outline: none;
        }
        .anv-item-input:focus { border-color: #FFB627; }
        .anv-item-desc { flex: 1; }
        .anv-item-amount { width: 90px; }
        .anv-item-remove {
          background: transparent;
          border: none;
          color: #547189;
          cursor: pointer;
          display: flex;
        }
        .anv-item-remove:hover { color: #FF6259; }

        .anv-two-col {
          max-width: 880px;
          margin: 20px auto 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          align-items: start;
        }

        .anv-paper {
          background: #F0F4F7;
          color: #16334F;
          border-radius: 10px;
          padding: 26px;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }
        .anv-paper-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6E8CA0;
        }
        .anv-paper-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 18px;
        }
        .anv-paper-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: #6E8CA0;
        }
        .anv-paper-parties {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 18px;
          gap: 12px;
        }
        .anv-paper-parties div { max-width: 48%; }
        .anv-paper-parties strong { display: block; font-size: 13.5px; margin-bottom: 2px; }
        .anv-paper-line {
          border-top: 1px dashed rgba(22,51,79,0.25);
          margin: 14px 0;
        }
        .anv-paper-item {
          display: flex;
          justify-content: space-between;
          font-size: 13.5px;
          padding: 5px 0;
        }
        .anv-paper-total {
          display: flex;
          justify-content: space-between;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 18px;
          margin-top: 12px;
        }
        .anv-paper-notes {
          font-size: 12.5px;
          color: #45607A;
          margin-top: 16px;
        }
        .anv-paper-stamp {
          position: absolute;
          bottom: 20px;
          right: -22px;
          border: 2px solid #E8873A;
          color: #E8873A;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          padding: 4px 30px;
          transform: rotate(-14deg);
          opacity: 0.75;
        }

        @media (max-width: 720px) {
          .anv-two-col { grid-template-columns: 1fr; }
        }

        .anv-card {
          max-width: 880px;
          margin: 0 auto;
          background: #12293F;
          border: 1px solid rgba(127,184,217,0.25);
          border-radius: 10px;
          padding: 28px;
        }

        .anv-h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 26px;
          margin: 0 0 6px;
        }
        .anv-p {
          color: #A9C0D6;
          font-size: 14px;
          margin: 0 0 22px;
        }

        .anv-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #7FA9C4;
          display: block;
          margin-bottom: 8px;
        }

        .anv-textarea {
          width: 100%;
          min-height: 110px;
          background: #0B1E30;
          border: 1px solid rgba(127,184,217,0.3);
          border-radius: 8px;
          color: #EAF2F7;
          font-family: 'Inter', sans-serif;
          font-size: 14.5px;
          line-height: 1.5;
          padding: 14px;
          resize: vertical;
          outline: none;
        }
        .anv-textarea:focus { border-color: #FFB627; }
        .anv-textarea::placeholder { color: #547189; }

        .anv-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 22px;
        }
        .anv-chip {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          padding: 7px 12px;
          border-radius: 20px;
          border: 1px solid rgba(127,184,217,0.3);
          background: transparent;
          color: #C7DAE8;
          cursor: pointer;
        }
        .anv-chip.active {
          background: rgba(255,182,39,0.12);
          border-color: #FFB627;
          color: #FFB627;
        }

        .anv-swatches {
          display: flex;
          gap: 10px;
          margin-bottom: 26px;
          flex-wrap: wrap;
        }
        .anv-swatch {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
        }
        .anv-swatch.active { background: rgba(255,182,39,0.1); outline: 1px solid #FFB627; }
        .anv-swatch-dots { display: flex; }
        .anv-swatch-dots span {
          width: 16px; height: 16px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.25);
          margin-left: -5px;
        }
        .anv-swatch-dots span:first-child { margin-left: 0; }
        .anv-swatch-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10.5px;
          color: #A9C0D6;
        }
        .anv-swatch.active .anv-swatch-label { color: #FFB627; }

        .anv-btn {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 14.5px;
          background: #FFB627;
          color: #0B1E30;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .anv-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .anv-btn-ghost {
          background: transparent;
          color: #C7DAE8;
          border: 1px solid rgba(127,184,217,0.35);
        }

        .anv-grid { display: none; }

        /* wireframe placeholder */
        .anv-wire {
          border: 1px dashed rgba(127,184,217,0.35);
          border-radius: 8px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          margin-top: 24px;
        }
        .anv-wire-row { display: flex; gap: 10px; }
        .anv-wire-box {
          background: rgba(127,184,217,0.08);
          border: 1px dashed rgba(127,184,217,0.3);
          border-radius: 4px;
          height: 16px;
        }
        .anv-wire-hero { height: 70px; }
        .anv-wire-cards .anv-wire-box { height: 60px; }
        .anv-wire-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10.5px;
          color: #547189;
          text-align: center;
          margin-top: 4px;
        }

        /* loading */
        .anv-loading {
          max-width: 880px;
          margin: 0 auto;
          padding: 60px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(127,184,217,0.25);
          border-radius: 10px;
          background: #12293F;
        }
        .anv-scanline {
          position: absolute;
          left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #FFB627, transparent);
          box-shadow: 0 0 12px 2px rgba(255,182,39,0.6);
          animation: anv-scan 1.8s ease-in-out infinite;
        }
        @keyframes anv-scan {
          0% { top: 0%; }
          50% { top: 96%; }
          100% { top: 0%; }
        }
        .anv-loading-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          color: #FFB627;
          letter-spacing: 0.04em;
        }

        /* browser frame */
        .anv-frame {
          max-width: 980px;
          margin: 0 auto;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(127,184,217,0.3);
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
        }
        .anv-frame-bar {
          background: #12293F;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .anv-dot { width: 9px; height: 9px; border-radius: 50%; }
        .anv-frame-url {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11.5px;
          color: #A9C0D6;
          background: #0B1E30;
          border-radius: 5px;
          padding: 5px 12px;
          margin-left: 6px;
          flex: 1;
        }

        .anv-controls {
          max-width: 980px;
          margin: 0 auto 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* generated site */
        .anv-site { font-family: 'Inter', sans-serif; }
        .anv-site-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 32px;
          border-bottom: 1px solid;
        }
        .anv-site-brand { font-weight: 700; font-size: 16px; }
        .anv-site-cta-ghost {
          font-size: 12.5px;
          font-weight: 600;
          border: 1px solid;
          border-radius: 20px;
          padding: 6px 14px;
        }
        .anv-site-hero {
          padding: 64px 32px 48px;
          max-width: 620px;
        }
        .anv-site-hero h1 {
          font-size: 34px;
          line-height: 1.15;
          margin: 0 0 14px;
          font-weight: 700;
        }
        .anv-site-hero p { font-size: 15px; line-height: 1.6; margin: 0 0 24px; }
        .anv-site-cta {
          border: none;
          font-weight: 600;
          font-size: 14px;
          padding: 12px 22px;
          border-radius: 6px;
          cursor: pointer;
        }
        .anv-site-services {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding: 0 32px 48px;
        }
        .anv-site-card { border-radius: 10px; padding: 20px; }
        .anv-site-num { font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; }
        .anv-site-card h3 { font-size: 15.5px; margin: 8px 0 6px; }
        .anv-site-card p { font-size: 13px; line-height: 1.5; margin: 0; }
        .anv-site-about { padding: 36px 32px; }
        .anv-site-about p { max-width: 640px; font-size: 15px; line-height: 1.7; margin: 0; }
        .anv-site-quote { padding: 40px 32px; text-align: center; }
        .anv-site-quote p { font-size: 18px; font-style: italic; max-width: 520px; margin: 0 auto 10px; }
        .anv-site-quote span { font-size: 13px; }
        .anv-site-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 22px 32px;
          border-top: 1px solid;
          font-weight: 600;
          font-size: 14px;
        }

        @media (max-width: 640px) {
          .anv-site-services { grid-template-columns: 1fr; }
          .anv-site-hero h1 { font-size: 27px; }
          .anv-site-nav, .anv-site-footer { padding: 16px 20px; }
          .anv-site-hero, .anv-site-services, .anv-site-about, .anv-site-quote { padding-left: 20px; padding-right: 20px; }
        }
      `}</style>

      <div className="anv-header">
        <AnvilMark />
        <span className="anv-wordmark">Anvil</span>
        <span className="anv-eyebrow">describe it → it's live</span>
      </div>

      <div className="anv-tabs">
        <button className={`anv-tab ${mode === "build" ? "active" : ""}`} onClick={() => setMode("build")}>
          <Hammer size={13} /> Draft a site
        </button>
        <button className={`anv-tab ${mode === "leads" ? "active" : ""}`} onClick={() => setMode("leads")}>
          <Search size={13} /> Find local leads
        </button>
        <button
          className={`anv-tab ${mode === "directory" ? "active" : ""}`}
          onClick={() => {
            setViewingEntry(null);
            setMode("directory");
          }}
        >
          <Globe size={13} /> Published sites
        </button>
      </div>

      {mode === "directory" && !viewingEntry && (
        <>
          <div className="anv-card">
            <h1 className="anv-h1">Live on Anvil</h1>
            <p className="anv-p">
              Sites published from this app, visible to anyone using it. Tap one to preview it.
            </p>
            <button className="anv-btn anv-btn-ghost" onClick={loadDirectory}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {directoryStage === "loading" && (
            <div className="anv-loading" style={{ marginTop: 20 }}>
              <div className="anv-scanline" />
              <Globe size={28} color="#FFB627" />
              <div style={{ height: 14 }} />
              <div className="anv-loading-text">Pulling up published sites…</div>
            </div>
          )}

          {directoryStage === "error" && (
            <div className="anv-card" style={{ textAlign: "center", marginTop: 20 }}>
              <p className="anv-p" style={{ marginBottom: 18 }}>Couldn't load the directory.</p>
              <button className="anv-btn" onClick={loadDirectory}>
                <RefreshCw size={16} /> Try again
              </button>
            </div>
          )}

          {directoryStage === "result" &&
            (directory.length === 0 ? (
              <div className="anv-card" style={{ textAlign: "center", marginTop: 20 }}>
                <p className="anv-p" style={{ margin: 0 }}>
                  Nothing published yet — draft a site and hit Publish.
                </p>
              </div>
            ) : (
              <div className="anv-dir-grid">
                {directory.map((entry) => (
                  <DirectoryCard key={entry.slug} entry={entry} onOpen={setViewingEntry} />
                ))}
              </div>
            ))}
        </>
      )}

      {mode === "directory" && viewingEntry && (
        <>
          <div className="anv-controls">
            <button className="anv-btn anv-btn-ghost" onClick={() => setViewingEntry(null)}>
              <ArrowLeft size={14} /> Back to directory
            </button>
          </div>
          <div className="anv-frame">
            <div className="anv-frame-bar">
              <span className="anv-dot" style={{ background: "#FF6259" }} />
              <span className="anv-dot" style={{ background: "#FFBD2E" }} />
              <span className="anv-dot" style={{ background: "#28C93F" }} />
              <span className="anv-frame-url">anvil.site/{viewingEntry.slug}</span>
            </div>
            <SitePreview site={viewingEntry.site} vibe={viewingEntry.vibe} />
          </div>
        </>
      )}

      {mode === "leads" && (
        <>
          <div className="anv-card">
            <h1 className="anv-h1">Who needs a site around here?</h1>
            <p className="anv-p">
              Give us an area and Anvil scans for real local businesses that don't have a proper
              website yet — just a Google listing or a Facebook page standing in for one.
            </p>

            <span className="anv-label">Area</span>
            <input
              className="anv-textarea"
              style={{ minHeight: "unset", height: 44 }}
              placeholder="e.g. Margate, England or a specific neighborhood"
              value={leadArea}
              onChange={(e) => setLeadArea(e.target.value)}
            />

            <div style={{ height: 18 }} />

            <span className="anv-label">Business type (optional)</span>
            <div className="anv-chips">
              {["Any type", ...BUSINESS_TYPES].map((t) => (
                <button
                  key={t}
                  className={`anv-chip ${leadType === t ? "active" : ""}`}
                  onClick={() => setLeadType(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <button className="anv-btn" onClick={findLeads} disabled={!leadArea.trim()}>
              <MapPin size={16} /> Search the area
            </button>
          </div>

          {leadStage === "loading" && (
            <div className="anv-loading" style={{ marginTop: 20 }}>
              <div className="anv-scanline" />
              <MapPin size={28} color="#FFB627" />
              <div style={{ height: 14 }} />
              <div className="anv-loading-text">{leadLoadingLine}</div>
            </div>
          )}

          {leadStage === "error" && (
            <div className="anv-card" style={{ textAlign: "center", marginTop: 20 }}>
              <p className="anv-p" style={{ marginBottom: 18 }}>{leadErrorMsg}</p>
              <button className="anv-btn" onClick={findLeads}>
                <RefreshCw size={16} /> Try again
              </button>
            </div>
          )}

          {leadStage === "result" && (
            <>
              {leads.length === 0 ? (
                <div className="anv-card" style={{ textAlign: "center", marginTop: 20 }}>
                  <p className="anv-p" style={{ margin: 0 }}>
                    Everyone in that area already has a site. Try a different area or type.
                  </p>
                </div>
              ) : (
                <div className="anv-lead-grid">
                  {leads.map((lead, i) => (
                    <LeadCard key={i} lead={lead} onDraft={draftForLead} />
                  ))}
                </div>
              )}
              <p className="anv-p" style={{ maxWidth: 880, margin: "16px auto 0", textAlign: "center", fontSize: 12.5 }}>
                Found via live web search — worth a quick double-check before reaching out.
              </p>
            </>
          )}
        </>
      )}

      {mode === "build" && stage === "input" && (
        <div className="anv-card">
          <h1 className="anv-h1">What are we building?</h1>
          <p className="anv-p">
            Describe the business in a sentence or two. Anvil drafts the copy and lays out a real
            page you can see instantly.
          </p>

          <span className="anv-label">Business type</span>
          <div className="anv-chips">
            {BUSINESS_TYPES.map((t) => (
              <button
                key={t}
                className={`anv-chip ${businessType === t ? "active" : ""}`}
                onClick={() => setBusinessType(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <span className="anv-label">Describe it</span>
          <textarea
            className="anv-textarea"
            placeholder="e.g. A small neighborhood coffee shop that roasts its own beans and hosts weekend latte-art classes"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div style={{ height: 22 }} />

          <span className="anv-label">Pick a vibe</span>
          <div className="anv-swatches">
            {Object.entries(VIBES).map(([key, v]) => (
              <button
                key={key}
                className={`anv-swatch ${vibe === key ? "active" : ""}`}
                onClick={() => setVibe(key)}
              >
                <div className="anv-swatch-dots">
                  {v.swatch.map((c, i) => (
                    <span key={i} style={{ background: c }} />
                  ))}
                </div>
                <span className="anv-swatch-label">{v.label}</span>
              </button>
            ))}
          </div>

          <button className="anv-btn" onClick={draft} disabled={!description.trim()}>
            <Sparkles size={16} /> Draft the site
          </button>

          {description.trim() === "" && <WireframePreview />}
        </div>
      )}

      {mode === "build" && stage === "loading" && (
        <div className="anv-loading">
          <div className="anv-scanline" />
          <AnvilMark size={30} />
          <div style={{ height: 14 }} />
          <div className="anv-loading-text">{loadingLine}</div>
        </div>
      )}

      {mode === "build" && stage === "error" && (
        <div className="anv-card" style={{ textAlign: "center" }}>
          <p className="anv-p" style={{ marginBottom: 18 }}>{errorMsg}</p>
          <button className="anv-btn" onClick={draft}>
            <RefreshCw size={16} /> Try again
          </button>
          <button className="anv-btn anv-btn-ghost" style={{ marginLeft: 10 }} onClick={reset}>
            Start over
          </button>
        </div>
      )}

      {mode === "build" && stage === "result" && site && (
        <>
          <div className="anv-controls">
            <button className="anv-btn anv-btn-ghost" onClick={reset}>
              <RotateCcw size={14} /> Start over
            </button>
            <button className="anv-btn anv-btn-ghost" onClick={draft}>
              <RefreshCw size={14} /> Rewrite copy
            </button>

            {publishState === "published" ? (
              <div className="anv-share-row">
                <span className="anv-publish-badge">
                  <span className="anv-live-dot" /> LIVE
                </span>
                <span className="anv-share-url">anvil.site/{publishedSlug}</span>
                <button className="anv-btn anv-btn-ghost anv-btn-sm" onClick={copyLink}>
                  {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy link"}
                </button>
                <button className="anv-btn anv-btn-ghost anv-btn-sm" onClick={unpublishSite}>
                  <Trash2 size={13} /> Take down
                </button>
              </div>
            ) : (
              <button className="anv-btn" onClick={publishSite} disabled={publishState === "publishing"}>
                <Upload size={14} /> {publishState === "publishing" ? "Publishing…" : "Publish"}
              </button>
            )}

            <button
              className={`anv-btn ${showInvoice ? "" : "anv-btn-ghost"}`}
              onClick={() => (showInvoice ? setShowInvoice(false) : openInvoice())}
            >
              <Receipt size={14} /> {showInvoice ? "Hide invoice" : "Send invoice"}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
              <Palette size={14} color="#7FA9C4" />
              {Object.entries(VIBES).map(([key, v]) => (
                <button
                  key={key}
                  onClick={() => {
                    setVibe(key);
                    if (publishState === "published") setPublishState("idle");
                  }}
                  title={v.label}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: v.accent,
                    border: vibe === key ? "2px solid #EAF2F7" : "2px solid transparent",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>

          {publishState === "error" && (
            <p className="anv-p" style={{ maxWidth: 880, margin: "0 auto 14px", color: "#F5C518" }}>
              Publishing didn't go through — give it another try.
            </p>
          )}

          {showInvoice && (
            <div className="anv-two-col">
              <div className="anv-card" style={{ margin: 0 }}>
                <span className="anv-label">From (you / your business)</span>
                <input
                  className="anv-textarea"
                  style={{ minHeight: "unset", height: 40, marginBottom: 16 }}
                  placeholder="e.g. Jordan Reyes, Reyes Web Studio"
                  value={invoiceFrom}
                  onChange={(e) => setInvoiceFrom(e.target.value)}
                />

                <span className="anv-label">Client email</span>
                <input
                  className="anv-textarea"
                  type="email"
                  style={{ minHeight: "unset", height: 40, marginBottom: 16 }}
                  placeholder="owner@theirbusiness.com"
                  value={invoiceClientEmail}
                  onChange={(e) => setInvoiceClientEmail(e.target.value)}
                />

                <span className="anv-label">Due date (optional)</span>
                <input
                  className="anv-textarea"
                  style={{ minHeight: "unset", height: 40, marginBottom: 16 }}
                  placeholder="e.g. 14 days from send"
                  value={invoiceDueDate}
                  onChange={(e) => setInvoiceDueDate(e.target.value)}
                />

                <span className="anv-label">Line items</span>
                {invoiceItems.map((item, i) => (
                  <div className="anv-item-row" key={i}>
                    <input
                      className="anv-item-input anv-item-desc"
                      placeholder="Description"
                      value={item.desc}
                      onChange={(e) => updateInvoiceItem(i, "desc", e.target.value)}
                    />
                    <input
                      className="anv-item-input anv-item-amount"
                      placeholder="0.00"
                      value={item.amount}
                      onChange={(e) => updateInvoiceItem(i, "amount", e.target.value.replace(/[^0-9.]/g, ""))}
                    />
                    <button className="anv-item-remove" onClick={() => removeInvoiceItem(i)} title="Remove">
                      <X size={15} />
                    </button>
                  </div>
                ))}
                <button className="anv-btn anv-btn-ghost anv-btn-sm" onClick={addInvoiceItem}>
                  <Plus size={13} /> Add line
                </button>

                <div style={{ height: 16 }} />
                <span className="anv-label">Notes (optional)</span>
                <textarea
                  className="anv-textarea"
                  style={{ minHeight: 60 }}
                  placeholder="Payment details, thank-you note, anything else"
                  value={invoiceNotes}
                  onChange={(e) => setInvoiceNotes(e.target.value)}
                />

                <div style={{ height: 20 }} />
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <a
                    className="anv-btn"
                    href={invoiceMailto()}
                    style={
                      !invoiceClientEmail.trim()
                        ? { pointerEvents: "none", opacity: 0.5 }
                        : undefined
                    }
                  >
                    <Send size={14} /> Send invoice
                  </a>
                  <button className="anv-btn anv-btn-ghost" onClick={copyInvoice}>
                    {invoiceCopied ? <Check size={14} /> : <Copy size={14} />}{" "}
                    {invoiceCopied ? "Copied" : "Copy text"}
                  </button>
                </div>
                <p className="anv-p" style={{ marginTop: 14, marginBottom: 0, fontSize: 12 }}>
                  "Send invoice" opens it in your own email app, addressed to the client, ready to
                  review and send.
                </p>
              </div>

              <div className="anv-paper">
                <div className="anv-paper-head">
                  <div>
                    <span className="anv-paper-eyebrow">Invoice</span>
                  </div>
                  <span className="anv-paper-num">{invoiceNumber}</span>
                </div>
                <div className="anv-paper-parties">
                  <div>
                    <strong>{invoiceFrom || "Your name / business"}</strong>
                    <span>From</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <strong>{site.businessName}</strong>
                    <span>{invoiceDueDate ? `Due ${invoiceDueDate}` : "Due on receipt"}</span>
                  </div>
                </div>
                <div className="anv-paper-line" />
                {invoiceItems
                  .filter((it) => it.desc.trim())
                  .map((it, i) => (
                    <div className="anv-paper-item" key={i}>
                      <span>{it.desc}</span>
                      <span>${(parseFloat(it.amount) || 0).toFixed(2)}</span>
                    </div>
                  ))}
                <div className="anv-paper-line" />
                <div className="anv-paper-total">
                  <span>Total</span>
                  <span>${invoiceTotal.toFixed(2)}</span>
                </div>
                {invoiceNotes && <p className="anv-paper-notes">{invoiceNotes}</p>}
                <span className="anv-paper-stamp">UNPAID</span>
              </div>
            </div>
          )}

          <div className="anv-frame">
            <div className="anv-frame-bar">
              <span className="anv-dot" style={{ background: "#FF6259" }} />
              <span className="anv-dot" style={{ background: "#FFBD2E" }} />
              <span className="anv-dot" style={{ background: "#28C93F" }} />
              <span className="anv-frame-url">
                {publishState === "published"
                  ? `anvil.site/${publishedSlug}`
                  : `${site.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "") || "yoursite"}.anvil.site (draft)`}
              </span>
            </div>
            <SitePreview site={site} vibe={vibe} />
          </div>

          {publishState !== "published" && (
            <p className="anv-p" style={{ maxWidth: 880, margin: "12px auto 0", textAlign: "center", fontSize: 12.5 }}>
              Publishing saves this site so anyone using this app can find it under Published sites.
            </p>
          )}
        </>
      )}
    </div>
  );
}
