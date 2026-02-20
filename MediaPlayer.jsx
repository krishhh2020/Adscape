import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const THEME = { black: "#000000", accent: "#7c3aed", white: "#ffffff" };

const isVideoFile = (url) => {
  if (!url) return false;
  const ext = url.split("?")[0].split(".").pop().toLowerCase();
  return ["mp4", "webm", "ogg"].includes(ext);
};

const normalizeUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("/")) return `http://localhost:5000${url}`;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `http://localhost:5000/${url}`;
};

export default function MediaPlayer({ pollInterval = 10000 }) {
  const [liveAds, setLiveAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const mountedRef = useRef(true);

  const syncNodes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/bookings/details");
      if (!mountedRef.current) return;
      const approvedAds = (res.data || [])
        .filter(ad => ad.status === "Scheduled")
        .map(ad => ({ ...ad, src: normalizeUrl(ad.file_url) }));
      setLiveAds(approvedAds);
      setErrorMsg(null);
    } catch (err) {
      console.error("Hardware Sync Failure:", err);
      setErrorMsg("Sync failed — retrying...");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    syncNodes();
    const heartbeat = setInterval(syncNodes, pollInterval);
    return () => { mountedRef.current = false; clearInterval(heartbeat); };
  }, [pollInterval]);

  if (loading) return <div style={styles.placeholder}>Waking Hardware Node...</div>;
  if (errorMsg) return <div style={styles.placeholder}>{errorMsg}</div>;
  if (liveAds.length === 0) return <div style={styles.placeholder}>📡 Waiting for Content...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {liveAds.map(ad => (
          <div key={ad.booking_id} style={styles.card}>
            <MediaRenderer src={ad.src} alt={ad.advertiser_name} />
            <div style={styles.overlay}>
              <div style={styles.badge}>LIVE BROADCAST</div>
              <h2 style={styles.location}>{ad.billboard_location}</h2>
              <p style={styles.brand}>Client: {ad.advertiser_name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MediaRenderer({ src, alt }) {
  const [failed, setFailed] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setFailed(false);
    if (videoRef.current && src && isVideoFile(src)) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [src]);

  if (!src || failed) {
    return (
      <div style={styles.offlineFallback}>
        <div style={{ fontSize: 16, color: "#94a3b8", fontWeight: 700 }}>Offline / Missing Asset</div>
        <div style={{ marginTop: 6, color: "#64748b" }}>{alt || "No advertiser info"}</div>
      </div>
    );
  }

  if (isVideoFile(src)) {
    return <video ref={videoRef} style={styles.media} muted loop playsInline onError={() => setFailed(true)}><source src={src} /></video>;
  }

  return <img src={src} alt={alt || "Live Broadcast"} style={styles.media} onError={() => setFailed(true)} />;
}

const styles = {
  container: { background: THEME.black, minHeight: "100vh", padding: "20px" },
  placeholder: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "#64748b", fontSize: 20, fontWeight: 700 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px" },
  card: { position: "relative", borderRadius: "12px", overflow: "hidden", background: "#000", aspectRatio: "16/9" },
  media: { width: "100%", height: "100%", objectFit: "cover" },
  overlay: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px", background: "linear-gradient(transparent, rgba(0,0,0,0.8))", color: THEME.white },
  badge: { display: "inline-block", padding: "4px 10px", background: THEME.accent, borderRadius: "4px", fontSize: "10px", fontWeight: 900, marginBottom: "8px" },
  location: { margin: 0, fontSize: "18px", fontWeight: 700 },
  brand: { margin: "4px 0 0 0", color: "#a78bfa", fontWeight: 600, fontSize: "13px" },
  offlineFallback: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", background: "#071029" }
};
