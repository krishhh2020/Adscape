// server/routes/billboards.js
import express from "express";
import pool from "../db.js";
const router = express.Router();

// GET all billboards
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM billboards ORDER BY billboard_id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Select Error:", err);
    res.status(500).json({ error: "Database sync failed.", detail: err.message });
  }
});

// POST a new billboard
router.post("/", async (req, res) => {
  // Accept either price_per_day (new) or price (old) for compatibility
  const {
    location,
    price_per_day,
    price, // optional legacy
    resolution,
    availability = true,
    contact_phone = null,
    contact_email = null,
  } = req.body;

  // Choose numeric price value: prefer price_per_day, fallback to price
  const priceValue = price_per_day ?? price ?? null;

  // Basic validation
  if (!location || String(location).trim() === "") {
    return res.status(400).json({ error: "location is required" });
  }
  if (priceValue !== undefined && priceValue !== null && isNaN(Number(priceValue))) {
    return res.status(400).json({ error: "price_per_day must be a number" });
  }
  if (contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email)) {
    return res.status(400).json({ error: "invalid email format" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO billboards
       (location, price_per_day, resolution, availability, contact_phone, contact_email)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [location, priceValue, resolution, availability, contact_phone, contact_email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).json({ error: "Failed to register billboard node.", detail: err.message });
  }
});

// DELETE a billboard
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM billboards WHERE billboard_id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Billboard not found" });
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
