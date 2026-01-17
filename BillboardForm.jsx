import React, { useState } from "react";
import axios from "axios";

export default function BillboardForm({ onBillboardAdded }) {
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Must match backend: { location, price }
      await axios.post("http://localhost:5000/billboards", {
        location,
        price: parseFloat(price),
        availability: true
      });
      setLocation("");
      setPrice("");
      onBillboardAdded();
      alert("Billboard Added Successfully!");
    } catch (err) {
      console.error("Frontend Error:", err.message);
      alert("Check if server is running on port 5000");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px", border: "1px solid #444" }}>
      <h3>Register Billboard</h3>
      <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required /><br/><br/>
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required /><br/><br/>
      <button type="submit">Add Billboard</button>
    </form>
  );
}