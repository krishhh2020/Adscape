import React, { useEffect, useState } from "react";
import axios from "axios";

function BillboardList({ refreshFlag, setRefreshFlag }) {
  const [billboards, setBillboards] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ location: "", price: "" });

  useEffect(() => {
    axios.get("http://localhost:5000/billboards")
      .then(res => setBillboards(res.data))
      .catch(err => console.error(err));
  }, [refreshFlag]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this billboard?")) {
      await axios.delete(`http://localhost:5000/billboards/${id}`);
      setRefreshFlag(!refreshFlag);
    }
  };

  const startEdit = (b) => {
    setEditingId(b.billboard_id);
    setEditData({ location: b.location, price: b.price });
  };

  const handleUpdate = async (id) => {
    await axios.put(`http://localhost:5000/billboards/${id}`, editData);
    setEditingId(null);
    setRefreshFlag(!refreshFlag);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
      {billboards.map(b => (
        <div key={b.billboard_id} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
          {editingId === b.billboard_id ? (
            <>
              <input value={editData.location} onChange={e => setEditData({...editData, location: e.target.value})} />
              <input type="number" value={editData.price} onChange={e => setEditData({...editData, price: e.target.value})} />
              <button onClick={() => handleUpdate(b.billboard_id)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <h4> {b.location}</h4>
              <p>Price: ₹{b.price}</p>
              <button onClick={() => startEdit(b)}>Edit</button>
              <button onClick={() => handleDelete(b.billboard_id)} style={{color: "red", marginLeft: "10px"}}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default BillboardList;