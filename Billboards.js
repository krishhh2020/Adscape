import express from "express";
import pool from "../db.js";
const router = express.Router();

// 1. GET ALL: Fetch all billboards
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM billboards ORDER BY billboard_id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("GET Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 2. POST: Add a new billboard
router.post("/", async (req, res) => {
  const { location, price, availability, resolution } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO billboards (location, price, availability, resolution) VALUES ($1, $2, $3, $4) RETURNING *",
      [location, price, availability ?? true, resolution ?? "1920x1080"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 3. DELETE: Remove a billboard
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM billboards WHERE billboard_id = $1", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Billboard deleted" });
  } catch (err) {
    console.error("DELETE Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 4. PUT: Update an existing billboard
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { location, price, resolution, availability } = req.body;
  try {
    const result = await pool.query(
      "UPDATE billboards SET location = $1, price = $2, resolution = $3, availability = $4 WHERE billboard_id = $5 RETURNING *",
      [location, price, resolution, availability, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;