import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";

/**
 * Home.jsx - "Adscape DOOH Marketplace"
 * - Fixes: process is not defined (Vite env support)
 * - Feature: Horizontal Screen Slider
 * - Feature: 6-Step Workflow (from user attachments)
 * - Card Style: Simplified as requested.
 */

const COLORS = {
  primary: "#7c3aed",
  slate900: "#050a15", 
  slate800: "#0f172a",
  slate600: "#475569",
  white: "#ffffff",
  emerald: "#10b981",
};

// VITE ENV FIX
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Home({ onNavigate }) {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);
  const scrollRef = useRef(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchScreens = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/billboards`, { signal: controller.signal });
        if (isMounted) {
          const data = Array.isArray(res.data) ? res.data : [];
          setScreens(data.filter((b) => b.availability === true));
        }
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error("Network Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchScreens();
    return () => { isMounted = false; controller.abort(); };
  }, []);

  const filteredScreens = useMemo(() => {
    return screens.filter((s) => {
      const matchLoc = (s.location || "").toLowerCase().includes(searchTerm.toLowerCase());
      const p = Number(s.price ?? s.price_per_day ?? 0);
      return matchLoc && (maxPrice === "" || p <= parseFloat(maxPrice));
    });
  }, [screens, searchTerm, maxPrice]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div style={styles.page}>
      {/* HERO & LIVE COUNTER */}
      <section style={styles.hero}>
        <div style={styles.heroCenter}>
          <div style={styles.badge}>Live Marketplace</div>
          <h1 style={styles.heroTitle}>Premium Digital Media Ready for Broadcast</h1>
          <div style={styles.liveCounter}>
             <span style={styles.dot} /> <strong>{screens.length} Screens</strong> are live and available now
          </div>
          <div style={styles.heroBtns}>
            <button onClick={() => onNavigate("advertiser")} style={styles.mainBtn}>Launch Campaign</button>
            <button onClick={() => onNavigate("owner")} style={styles.subBtn}>List Screen</button>
          </div>
        </div>
      </section>

      {/* HORIZONTAL INVENTORY */}
      <section style={styles.inventorySection}>
        <div style={styles.inventoryHeader}>
          <h2 style={styles.sectionH2}>Available Live Inventory</h2>
          <div style={styles.navBtns}>
            <button onClick={() => scroll('left')} style={styles.arrowBtn}>←</button>
            <button onClick={() => scroll('right')} style={styles.arrowBtn}>→</button>
          </div>
        </div>
        <div style={styles.horizontalScroll} ref={scrollRef}>
          {loading ? (
             <div style={{padding: 40}}>Connecting to network...</div>
          ) : (
            filteredScreens.map((screen) => (
              <ScreenCard key={screen.billboard_id || screen.id} screen={screen} onNavigate={onNavigate} />
            ))
          )}
        </div>
      </section>

      {/* 6-STEP WORKFLOW */}
      <section style={styles.workflowSection}>
        <div style={styles.workflowCenter}>
          <h2 style={{...styles.sectionH2, color: '#fff', marginBottom: 50}}>How Adscape Works</h2>
          <div style={styles.workflowGrid}>
            <WorkflowCard num="1" title="Browse & Book" desc="Explore our network of digital billboards and book instantly." tag="2-3 minutes" />
            <WorkflowCard num="2" title="Owner Approval" desc="Signage owners review your booking within 24 hours." tag="24 hours max" />
            <WorkflowCard num="3" title="Secure Payment" desc="Complete payment securely through our platform." tag="Instant" />
            <WorkflowCard num="4" title="Content Scheduling" desc="Schedule your photo content to go live exactly when planned." tag="1-2 hours" />
            <WorkflowCard num="5" title="Campaign Activation" desc="Your content reaches your target audience as scheduled." tag="Active Display" />
            <WorkflowCard num="6" title="Proof of Play" desc="Receive detailed reports including logs and performance metrics." tag="Verified Reporting" />
          </div>
          <p style={{color: '#94a3b8', marginTop: 40, fontSize: 13}}>*Only high-resolution photo formats are supported.</p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={styles.faqSection}>
        <div style={styles.faqInner}>
          <h2 style={{...styles.sectionH2, textAlign: 'center', marginBottom: 40}}>Common Questions</h2>
          {[
            { q: "How long does approval take?", a: "Typically 2-4 hours for creative review." },
            { q: "What formats are supported?", a: "Currently, we only support static JPG and PNG images." },
            { q: "Can I target peak hours?", a: "Yes, our tool supports specific rush-hour scheduling." }
          ].map((item, idx) => (
            <div key={idx} style={styles.faqItem} onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
              <div style={styles.faqQuestion}>{item.q} <span>{activeFaq === idx ? '−' : '+'}</span></div>
              {activeFaq === idx && <div style={styles.faqAnswer}>{item.a}</div>}
            </div>
          ))}
        </div>
      </section>

      <footer style={styles.darkFooter}>
        <div style={styles.footerUpper}>
          <div style={styles.newsletter}>
            <h2>Stay ahead of the curve</h2>
            <p>Get the latest OOH trends and platform updates.</p>
          </div>
          <div style={styles.subscribeBox}>
            <input type="email" placeholder="Enter work email" style={styles.emailInput} />
            <button style={styles.subscribeBtn}>Subscribe</button>
          </div>
        </div>
        <div style={styles.footerMain}>
          <div style={styles.footerColBrand}>
            <div style={styles.footerLogo}>ADScape</div>
            <p>The operating system for modern out-of-home advertising.</p>
          </div>
          <div style={styles.footerCol}>
            <h4>PRODUCT</h4>
            <span onClick={() => onNavigate("home")}>Browse Screens</span>
          </div>
          <div style={styles.footerCol}>
            <h4>DOWNLOAD APP</h4>
            <div style={styles.appBtns}>
               <button style={styles.storeBtn}>App Store</button>
               <button style={styles.storeBtn}>Play Store</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* --- SIMPLE SCREEN CARD --- */
function ScreenCard({ screen, onNavigate }) {
  const price = screen.price ?? screen.price_per_day ?? "N/A";
  return (
    <div style={styles.card}>
      <div style={styles.cardMedia}>
        <img src={screen.image_url || "https://via.placeholder.com/400x180"} alt={screen.location} style={styles.cardImg} />
        <div style={styles.liveBadge}>● LIVE NOW</div>
      </div>
      <div style={styles.cardContent}>
        <div style={styles.cardTags}>{screen.resolution || "4K"} • {screen.size || "10x20 ft"}</div>
        <h4 style={styles.locationTitle}>{screen.location || "City Center"}</h4>
        <div style={styles.priceRow}>
          <div style={styles.priceValue}>₹{price}<small>/day</small></div>
          <button onClick={() => onNavigate("advertiser")} style={styles.actionBtn}>Book</button>
        </div>
      </div>
    </div>
  );
}

function WorkflowCard({ num, title, desc, tag }) {
  return (
    <div style={styles.workflowCard}>
      <div style={styles.workflowHeader}>
        <div style={styles.stepNum}>{num}</div>
        <h3>{title}</h3>
      </div>
      <p style={styles.stepDesc}>{desc}</p>
      <div style={styles.stepTag}>● {tag}</div>
    </div>
  );
}

/* --- STYLES --- */
const styles = {
  page: { background: "#fff", fontFamily: "'Inter', sans-serif", color: COLORS.slate900 },
  hero: { padding: "80px 20px", textAlign: 'center' },
  heroCenter: { maxWidth: 800, margin: "0 auto" },
  badge: { display: 'inline-block', padding: '6px 14px', borderRadius: '30px', background: '#f5f3ff', color: COLORS.primary, fontSize: '12px', fontWeight: 800, marginBottom: '20px' },
  heroTitle: { fontSize: "3rem", fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 20 },
  liveCounter: { fontSize: 16, color: COLORS.slate600, marginBottom: 30 },
  dot: { display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: COLORS.emerald, marginRight: 8 },
  heroBtns: { display: "flex", gap: 16, justifyContent: "center" },
  mainBtn: { background: COLORS.primary, color: "#fff", padding: "16px 36px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: 700 },
  subBtn: { background: "#fff", border: `1px solid #e2e8f0`, padding: "16px 36px", borderRadius: "12px", cursor: "pointer", fontWeight: 700 },

  inventorySection: { padding: "60px 0", background: "#f8fafc" },
  inventoryHeader: { maxWidth: 1100, margin: "0 auto 30px auto", display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' },
  sectionH2: { fontSize: '30px', fontWeight: 900 },
  navBtns: { display: 'flex', gap: '10px' },
  arrowBtn: { width: '45px', height: '45px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  horizontalScroll: { display: 'flex', gap: '24px', overflowX: 'hidden', padding: '0 40px', scrollBehavior: 'smooth' },

  card: { minWidth: '320px', background: '#fff', borderRadius: '24px', overflow: 'hidden', border: '1px solid #f1f5f9' },
  cardMedia: { position: 'relative', height: '180px' },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover' },
  liveBadge: { position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 800 },
  cardContent: { padding: '24px' },
  cardTags: { fontSize: '11px', color: COLORS.primary, fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' },
  locationTitle: { fontSize: '19px', fontWeight: 800, margin: '0 0 15px 0' },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '15px' },
  priceValue: { fontSize: '22px', fontWeight: 900 },
  actionBtn: { background: COLORS.slate900, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 },

  workflowSection: { padding: "100px 20px", background: "#050a15" },
  workflowCenter: { maxWidth: 1100, margin: "0 auto", textAlign: 'center' },
  workflowGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 30, marginTop: 50 },
  workflowCard: { background: '#0f172a', padding: 40, borderRadius: 28, textAlign: 'left', border: '1px solid #1e293b' },
  workflowHeader: { display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 },
  stepNum: { fontSize: 40, fontWeight: 900, color: '#fff', opacity: 0.15 },
  stepDesc: { color: '#94a3b8', fontSize: 15, lineHeight: 1.6, marginBottom: 20 },
  stepTag: { background: 'rgba(124, 58, 237, 0.15)', color: COLORS.primary, padding: '6px 14px', borderRadius: '20px', fontSize: 12, fontWeight: 700, display: 'inline-block' },

  faqSection: { padding: "100px 20px", background: "#fff" },
  faqInner: { maxWidth: 700, margin: "0 auto" },
  faqItem: { borderBottom: '1px solid #eee', padding: '20px 0', cursor: 'pointer' },
  faqQuestion: { fontWeight: 700, display: 'flex', justifyContent: 'space-between' },
  faqAnswer: { marginTop: '15px', color: COLORS.slate600, fontSize: '14px', lineHeight: 1.5 },

  darkFooter: { background: COLORS.slate900, color: "#fff", padding: "80px 40px 40px" },
  footerUpper: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: 40, marginBottom: 40 },
  subscribeBox: { display: 'flex', gap: 10, background: '#0f172a', padding: 8, borderRadius: 16 },
  emailInput: { background: 'transparent', border: 'none', color: '#fff', padding: '10px', width: 250, outline: 'none' },
  subscribeBtn: { background: COLORS.primary, color: "#fff", border: "none", padding: "12px 28px", borderRadius: "12px", fontWeight: 700 },
  footerMain: { display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', gap: 60 },
  footerLogo: { fontSize: 26, fontWeight: 900, color: COLORS.primary, marginBottom: 20 },
  footerCol: { display: 'flex', flexDirection: 'column', gap: 15, color: '#94a3b8' },
  appBtns: { display: 'flex', gap: 12 },
  storeBtn: { background: '#1e293b', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontSize: 13 }
};