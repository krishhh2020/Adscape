// src/components/ScreenOwnerModule.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const THEME = {
  primary: "#7c3aed",
  bg: "#f8fafc",
  white: "#ffffff",
  border: "#e2e8f0",
  text: "#1e293b",
};

// Use Vite env if available, fallback to localhost
const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_URL) ? import.meta.env.VITE_API_URL : "http://localhost:5000";

export default function ScreenOwnerModule() {
  const [screens, setScreens] = useState([]);
  const [location, setLocation] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [resolution, setResolution] = useState("3840x2160 (4K UHD)");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios.get(`${API_BASE}/billboards`)
      .then(res => {
        if (!mounted) return;
        setScreens(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Hardware Sync Error:", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [refresh]);

  const addScreen = async (e) => {
    e.preventDefault();

    if (!location.trim()) return alert("Please enter a location.");
    if (pricePerDay !== "" && isNaN(Number(pricePerDay))) return alert("Price must be a number.");
    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) return alert("Invalid email.");

    try {
      await axios.post(`${API_BASE}/billboards`, {
        location: location.trim(),
        price_per_day: pricePerDay === "" ? null : Number(pricePerDay),
        availability: true,
        resolution,
        contact_phone: contactPhone.trim() || null,
        contact_email: contactEmail.trim() || null
      });
      setRefresh(r => !r);
      setLocation(""); setPricePerDay(""); setContactPhone(""); setContactEmail(""); setResolution("3840x2160 (4K UHD)");
    } catch (err) {
      console.error("Add screen error:", err);
      const msg = err?.response?.data?.detail || err?.message || "Failed to register node.";
      alert(`Failed to register node. ${msg}`);
    }
  };

  const deleteScreen = async (id) => {
    if (!window.confirm("Decommission this hardware node?")) return;
    try {
      await axios.delete(`${API_BASE}/billboards/${id}`);
      setRefresh(r => !r);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete node. Check server logs.");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px" }}>Node Command Center</h1>
          <p style={{ color: "#64748b", margin: "5px 0 0 0" }}>Orchestrating urban media hardware</p>
        </div>
        <div style={styles.statsRow}>
          {/* Change: Renamed label to TOTAL SCREENS */}
          <Stat label="TOTAL SCREENS" value={screens.length} color={THEME.primary} />
          {/* Change: Displaying Live Streams count */}
          <Stat label="LIVE STREAMS" value={screens.filter(s => s.availability === false || s.availability === "f").length} color="#f59e0b" />
        </div>
      </header>

      <div style={styles.contentGrid}>
        <aside style={styles.actionPanel}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Register New Node</h3>
            <form onSubmit={addScreen}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Installation Location</label>
                <input style={styles.input} placeholder="e.g. MG Road Plaza" value={location} onChange={e => setLocation(e.target.value)} required />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Daily Rate (₹)</label>
                <input style={styles.input} type="number" placeholder="5000" value={pricePerDay} onChange={e => setPricePerDay(e.target.value)} />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Resolution</label>
                <select style={styles.input} value={resolution} onChange={e => setResolution(e.target.value)}>
                  <option>3840x2160 (4K UHD)</option>
                  <option>1920x1080 (Full HD)</option>
                  <option>2560x1440</option>
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Owner Contact Number</label>
                <input style={styles.input} type="tel" placeholder="+91 98XXX XXXXX" value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Owner Email Address</label>
                <input style={styles.input} type="email" placeholder="owner@network.com" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
              </div>

              <button type="submit" style={styles.primaryBtn}>Initialize Deployment</button>
            </form>
          </div>
        </aside>

        <main style={styles.inventoryPanel}>
          <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 style={styles.cardTitle}>Hardware Registry</h3>
              <button onClick={() => setRefresh(r => !r)} style={styles.refreshBtn}>↻ Sync Network</button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>SL NO.</th>
                    <th style={styles.th}>LOCATION</th>
                    <th style={styles.th}>RATE</th>
                    <th style={styles.th}>IOT STATUS</th>
                    <th style={styles.th}>CONTACT</th>
                    <th style={styles.th}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" style={styles.td}>Loading…</td></tr>
                  ) : screens.length === 0 ? (
                    <tr><td colSpan="6" style={styles.td}>No nodes registered.</td></tr>
                  ) : (
                    screens.map((s, index) => (
                      <tr key={s.billboard_id}>
                        <td style={styles.td}>
                          <code style={styles.code}>{index + 1}</code>
                        </td>
                        <td style={styles.td}>{s.location}</td>
                        <td style={styles.td}>₹{s.price_per_day ?? s.price ?? "N/A"}</td>
                        <td style={styles.td}><StatusBadge active={s.availability === true || s.availability === "t"} /></td>
                        <td style={styles.td}>
                          <div style={{ fontSize: 13 }}>{s.contact_phone || "—"}</div>
                          <div style={{ fontSize: 11, color: "#64748b" }}>{s.contact_email || "—"}</div>
                        </td>
                        <td style={styles.td}>
                          <button onClick={() => deleteScreen(s.billboard_id)} style={styles.deleteBtn}>Disconnect</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const Stat = ({ label, value, color }) => (
  <div style={styles.statBox}>
    <span style={{ fontSize: "10px", fontWeight: "800", color: "#94a3b8" }}>{label}</span>
    <span style={{ fontSize: "22px", fontWeight: "900", color }}>{value}</span>
  </div>
);

// Updated: Improved "Streaming" font style for visibility
const StatusBadge = ({ active }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <div style={{ 
      width: "8px", 
      height: "8px", 
      borderRadius: "50%", 
      backgroundColor: active ? "#10b981" : "#f59e0b", 
      boxShadow: active ? "0 0 8px #10b981" : "0 0 10px #f59e0b" 
    }} />
    <span style={{ 
      fontSize: "12px", 
      fontWeight: "800", // Bolder font
      color: active ? "#10b981" : "#f59e0b",
      textTransform: "uppercase" 
    }}>
      {active ? "Ready" : "Streaming"}
    </span>
  </div>
);

const styles = {
  container: { padding: "40px", backgroundColor: THEME.bg, minHeight: "100vh", color: THEME.text, fontFamily: "sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", borderBottom: `1px solid ${THEME.border}`, paddingBottom: "20px" },
  statsRow: { display: "flex", gap: "15px" },
  statBox: { backgroundColor: THEME.white, padding: "12px 24px", borderRadius: "12px", border: `1px solid ${THEME.border}`, textAlign: "center", minWidth: "110px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" },
  contentGrid: { display: "flex", gap: "30px" },
  actionPanel: { flex: "1" },
  inventoryPanel: { flex: "2.5" },
  card: { backgroundColor: THEME.white, padding: "24px", borderRadius: "16px", border: `1px solid ${THEME.border}`, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" },
  cardTitle: { margin: "0 0 20px 0", fontSize: "16px", fontWeight: "800", color: "#64748b", textTransform: "uppercase" },
  inputGroup: { marginBottom: "20px" },
  label: { display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "8px", color: "#94a3b8" },
  input: { width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid ${THEME.border}`, backgroundColor: "#f1f5f9", boxSizing: "border-box" },
  primaryBtn: { width: "100%", padding: "14px", backgroundColor: THEME.primary, color: "#fff", border: "none", borderRadius: "10px", fontWeight: "800", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "12px", color: "#94a3b8", fontSize: "11px", fontWeight: "800", textAlign: "left", borderBottom: `2px solid ${THEME.border}` },
  td: { padding: "16px 12px", borderBottom: `1px solid ${THEME.border}`, fontSize: "14px" },
  code: { backgroundColor: "#f1f5f9", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", color: THEME.primary, fontWeight: "bold" },
  deleteBtn: { color: "#ef4444", border: "none", background: "none", cursor: "pointer", fontSize: "12px", fontWeight: "700" },
  refreshBtn: { background: "none", border: `1px solid ${THEME.border}`, padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }
};