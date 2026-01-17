import React, { useState } from "react";
import axios from "axios";

export default function BillboardCard({ billboard, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    location: billboard.location, 
    price: billboard.price 
  });

  const handleDelete = async () => {
    if (window.confirm(`Delete billboard in ₹{billboard.location}?`)) {
      try {
        // billboard_id comes from your SQL table
        await axios.delete(`http://localhost:5000/billboards/${billboard.billboard_id}`);
        onUpdate(); // Triggers list refresh
      } catch (err) {
        alert("Delete failed. Check console.");
      }
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/billboards/${billboard.billboard_id}`, {
        ...billboard,
        location: editData.location,
        price: parseFloat(editData.price)
      });
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      alert("Update failed.");
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px", background: "#1a1a1a" }}>
      {isEditing ? (
        <>
          <input value={editData.location} onChange={(e) => setEditData({...editData, location: e.target.value})} />
          <input type="number" value={editData.price} onChange={(e) => setEditData({...editData, price: e.target.value})} />
          <button onClick={handleEdit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{billboard.location}</h4>
          <p>Price: ${billboard.price}</p>
          <p>Status: {billboard.availability ? "Available" : "Booked"}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete} style={{ color: "red", marginLeft: "10px" }}>Delete</button>
        </>
      )}
    </div>
  );
}