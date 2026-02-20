import express from "express";
import pool from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();
const UPLOAD_DIR = "Public/Uploads";
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.get("/details", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.id AS booking_id, b.start_date, b.end_date, b.status,
             a.company_name AS advertiser_name, bb.location AS billboard_location,
             asset.file_url
      FROM bookings b
      JOIN advertisers a ON b.advertiser_id = a.id
      JOIN billboards bb ON b.billboard_id = bb.billboard_id
      LEFT JOIN ad_asset asset ON b.id = asset.booking_id
      ORDER BY b.id DESC
    `);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", upload.single("adImage"), async (req, res) => {
  const { advertiser_id, billboard_id, start_date, end_date } = req.body;
  const file_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    await pool.query("BEGIN");
    const result = await pool.query(
      "INSERT INTO bookings (advertiser_id, billboard_id, start_date, end_date, status) VALUES ($1, $2, $3, $4, 'Pending') RETURNING id",
      [advertiser_id, billboard_id, start_date, end_date]
    );
    const newBookingId = result.rows[0].id;
    await pool.query("INSERT INTO ad_asset (booking_id, file_url) VALUES ($1, $2)", [newBookingId, file_url]);
    await pool.query("UPDATE billboards SET availability = false WHERE billboard_id = $1", [billboard_id]);
    await pool.query("COMMIT");
    res.status(201).json({ id: newBookingId });
  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const booking = await pool.query("SELECT billboard_id FROM bookings WHERE id = $1", [req.params.id]);
    if (booking.rows.length === 0) return res.status(404).send("Not Found");
    const bbId = booking.rows[0].billboard_id;
    await pool.query("DELETE FROM bookings WHERE id = $1", [req.params.id]);
    await pool.query("UPDATE billboards SET availability = true WHERE billboard_id = $1", [bbId]);
    res.send("Terminated");
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;