import React, { useEffect, useState } from "react";

function InventoryPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/inventory")
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Error fetching inventory:", err));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif", background: "#f9f9f9" }}>
      <h2 style={{ color: "#4B0082", marginBottom: "1rem" }}>Available Inventory</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {data.map(item => (
          <div key={item._id} style={{
            border: "2px solid #4B0082",
            padding: "1rem",
            width: "250px",
            borderRadius: "8px",
            background: "#fff",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ color: "#4B0082" }}>{item.title}</h3>
            <p>{item.location}, {item.state}</p>
            <p>{item.size} • {item.duration}</p>
            <p style={{ color: "#008000" }}>{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InventoryPage;
