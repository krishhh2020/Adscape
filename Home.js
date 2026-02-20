import React, { useState, useEffect } from "react";
import axios from "axios";

const COLORS = {
  primary: "#7c3aed",
  slate900: "#0f172a",
  slate600: "#475569",
  slate100: "#f1f5f9",
  white: "#ffffff",
  emerald: "#10b981",
};

export default function Home({ onNavigate }) {
  const [screens, setScreens] = useState([]);
  const [filteredScreens, setFilteredScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const res = await axios.get("http://localhost:5000/billboards");
        // Availability check ensures only active screens are displayed [cite: 26]
        const available = res.data.filter(b => b.availability === true);
        setScreens(available);
        setFilteredScreens(available);
        setLoading(false);
      } catch (err) {
        console.error("Inventory Sync Error:", err);
        setLoading(false);
      }
    };
    fetchScreens();
  }, []);

  // Handle Real-time Filtering
  useEffect(() => {
    let result = screens;

    if (searchTerm) {
      result = result.filter(s => 
        s.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (maxPrice) {
      result = result.filter(s => s.price_per_day <= parseInt(maxPrice));
    }

    setFilteredScreens(result);
  }, [searchTerm, maxPrice, screens]);

  return (
    <div style={{ background: COLORS.white, fontFamily: "'Inter', sans-serif" }}>
      
      {/* HERO SECTION [cite: 1, 2] */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          The Programmatic <br/>
          <span style={{ color: COLORS.primary }}>DOOH Marketplace.</span>
        </h1>
        <p style={styles.heroSub}>
          Bridge the gap between digital billboard owners and brands[cite: 3]. 
          Deploy campaigns in real-time across high-traffic urban nodes[cite: 4, 25].
        </p>
      </section>

      {/* SEARCH & FILTER BAR */}
      <section style={styles.filterSection}>
        <div style={styles.filterBar}>
          <input 
            type="text" 
            placeholder="Search by location (e.g. MG Road)..." 
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="Max Price / Day" 
            style={styles.priceInput}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <button style={styles.countBadge}>
            {filteredScreens.length} Units Available
          </button>
        </div>
      </section>

      {/* DYNAMIC INVENTORY GRID */}
      <section style={styles.section}>
        {loading ? (
          <div style={styles.loading}>Connecting to Adscape Nodes...</div>
        ) : (
          <div style={styles.grid}>
            {filteredScreens.map((screen) => (
              <div key={screen.billboard_id} style={styles.card}>
                <div style={styles.cardImage}>
                   <div style={styles.resBadge}>{screen.resolution}</div>
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.metaTop}>
                    <h4 style={styles.cardTitle}>{screen.location}</h4>
                    <span style={styles.statusTag}>VERIFIED</span>
                  </div>
                  <div style={styles.metaRow}>
                    <span style={styles.price}>₹{screen.price_per_day} <small>/ day</small></span>
                  </div>
                  <button 
                    onClick={() => onNavigate("ADVERTISER")} 
                    style={styles.bookBtn}
                  >
                    Start Campaign
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && filteredScreens.length === 0 && (
          <div style={styles.empty}>No screens found matching your criteria.</div>
        )}
      </section>

      {/* FOOTER  */}
      <footer style={styles.footer}>
        <p>© 2026 Adscape. Modernizing outdoor advertising with the PERN stack[cite: 5, 48].</p>
      </footer>
    </div>
  );
}

const styles = {
  hero: { padding: "80px 20px 40px 20px", textAlign: "center", maxWidth: "1000px", margin: "0 auto" },
  heroTitle: { fontSize: "48px", fontWeight: "800", color: COLORS.slate900, marginBottom: "20px" },
  heroSub: { fontSize: "18px", color: COLORS.slate600, maxWidth: "700px", margin: "0 auto", lineHeight: "1.6" },
  
  filterSection: { padding: "20px 40px", sticky: "top", background: "white", zIndex: 10 },
  filterBar: { 
    maxWidth: "1200px", 
    margin: "0 auto", 
    display: "flex", 
    gap: "15px", 
    padding: "15px", 
    background: COLORS.slate100, 
    borderRadius: "16px" 
  },
  searchInput: { flex: 2, padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none" },
  priceInput: { flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none" },
  countBadge: { background: COLORS.slate900, color: "white", padding: "0 20px", borderRadius: "8px", border: "none", fontWeight: "600", fontSize: "13px" },

  section: { padding: "40px", maxWidth: "1200px", margin: "0 auto", minHeight: "400px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" },
  card: { border: `1px solid ${COLORS.slate100}`, borderRadius: "16px", background: "#fff", transition: "box-shadow 0.3s hover" },
  cardImage: { height: "160px", background: "#f8fafc", borderRadius: "16px 16px 0 0", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" },
  resBadge: { position: "absolute", top: "12px", right: "12px", background: "white", color: COLORS.slate900, fontSize: "10px", padding: "4px 8px", borderRadius: "4px", fontWeight: "700", border: "1px solid #e2e8f0" },
  cardBody: { padding: "20px" },
  metaTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" },
  cardTitle: { fontSize: "16px", fontWeight: "700", margin: 0, color: COLORS.slate900 },
  statusTag: { fontSize: "9px", fontWeight: "800", background: "#ecfdf5", color: COLORS.emerald, padding: "2px 6px", borderRadius: "4px" },
  price: { fontSize: "18px", fontWeight: "800", color: COLORS.primary },
  bookBtn: { width: "100%", padding: "12px", borderRadius: "8px", background: COLORS.primary, color: "white", border: "none", fontWeight: "600", cursor: "pointer", marginTop: "15px" },
  
  loading: { textAlign: "center", color: COLORS.slate600, padding: "100px" },
  empty: { textAlign: "center", color: COLORS.slate600, padding: "60px", fontSize: "14px" },
  footer: { padding: "40px", textAlign: "center", borderTop: `1px solid ${COLORS.slate100}`, color: COLORS.slate600, fontSize: "12px" }
};