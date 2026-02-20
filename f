import express from "express";
import pool from "../db.js";
const router = express.Router();

// ADMIN: Fetch all pending campaigns for approval
router.get("/pending", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bookings WHERE status = 'Pending'");
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ADMIN: Approve a campaign (Updates status to 'Scheduled')
router.put("/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE bookings SET status = 'Scheduled' WHERE id = $1", [id]);
    res.send("Campaign Approved and Scheduled");
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// MEDIA PLAYER: Hardware calls this to get live content
router.get("/play/:billboard_id", async (req, res) => {
  const { billboard_id } = req.params;
  try {
    // 40. Polls server to check for latest playlist updates
    const query = `
      SELECT b.id, a.company_name, b.start_date, b.end_date 
      FROM bookings b
      JOIN advertisers a ON b.advertiser_id = a.id
      WHERE b.billboard_id = $1 
      AND b.status = 'Scheduled'
      AND CURRENT_DATE BETWEEN b.start_date AND b.end_date
      LIMIT 1
    `;
    const result = await pool.query(query, [billboard_id]);
    res.json(result.rows[0] || { status: "IDLE" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;