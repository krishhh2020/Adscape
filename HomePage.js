import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const featuredScreens = [
    { title: "Chennai Airport Billboard", location: "Chennai", price: "₹4000/day" },
    { title: "Coimbatore Mall Billboard", location: "Coimbatore", price: "₹2500/day" },
    { title: "Madurai Temple Billboard", location: "Madurai", price: "₹2000/day" },
    { title: "Trichy College Hub Billboard", location: "Trichy", price: "₹1800/day" },
  ];

  const primeCities = ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem"];

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f9f9f9" }}>
      {/* Hero Section */}
      <section style={{ padding: "2rem", textAlign: "center", background: "#fff" }}>
        <h1 style={{ color: "#4B0082" }}>Advertise Smarter with Adscape</h1>
        <p style={{ color: "#555", marginBottom: "1rem" }}>Explore billboard locations across Tamil Nadu</p>
        <label htmlFor="state" style={{ fontWeight: "bold", marginRight: "1rem" }}>WHERE (STATE):</label>
        <select
          id="state"
          onChange={(e) => {
            const state = e.target.value;
            if (state) navigate(`/inventory?state=${encodeURIComponent(state)}`);
          }}
          style={{ padding: "0.5rem", borderRadius: "5px" }}
        >
          <option value="">Select State</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Kerala">Kerala</option>
          <option value="Karnataka">Karnataka</option>
        </select>
        <br /><br />
        <button
          onClick={() => navigate("/inventory")}
          style={{ padding: "0.6rem 1.2rem", background: "#4B0082", color: "#fff", border: "none", borderRadius: "6px" }}
        >
          Explore Screens →
        </button>
      </section>

      {/* Featured Screens */}
      <section style={{ padding: "2rem" }}>
        <h2 style={{ color: "#4B0082" }}>Featured Screens</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {featuredScreens.map((screen, i) => (
            <div key={i} style={{ border: "2px solid #4B0082", padding: "1rem", width: "250px", borderRadius: "8px", background: "#fff" }}>
              <h3 style={{ color: "#4B0082" }}>{screen.title}</h3>
              <p>{screen.location}</p>
              <p style={{ color: "#008000" }}>{screen.price}</p>
              <button style={{ marginTop: "0.5rem", padding: "0.5rem", background: "#4B0082", color: "#fff", border: "none", borderRadius: "5px" }}>
                Book Slot
              </button>
            </div>
          ))}
        </div>
        <br />
        <button
          onClick={() => navigate("/inventory")}
          style={{ padding: "0.6rem 1.2rem", background: "#4B0082", color: "#fff", border: "none", borderRadius: "6px" }}
        >
          View All Inventory →
        </button>
      </section>

      {/* Prime Locations */}
      <section style={{ padding: "2rem" }}>
        <h2 style={{ color: "#4B0082" }}>Prime Locations</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {primeCities.map((city, i) => (
            <div key={i} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "6px", background: "#fff" }}>
              <h3 style={{ color: "#4B0082" }}>{city}</h3>
              <button
                onClick={() => navigate(`/inventory?loc=${encodeURIComponent(city)}`)}
                style={{ marginTop: "0.5rem", padding: "0.5rem", background: "#4B0082", color: "#fff", border: "none", borderRadius: "5px" }}
              >
                View Screens
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
