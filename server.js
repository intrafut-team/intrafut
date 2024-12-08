const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const path = require("path");

// Initialize Express and middleware
const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const pool = new Pool({
  connectionString:
    "postgres://neondb_owner:TG0uAS6egQsz@ep-floral-rain-a2iq8paf-pooler.eu-central-1.aws.neon.tech/sport?sslmode=require",
  ssl: {
    rejectUnauthorized: false,
  },
});

async function initializeDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS emails (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE
    );
  `;
  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    client.release();
    console.log("Database initialized");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
}

initializeDatabase();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/submit-email", async (req, res) => {
  const email = req.body.email;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.json({ success: false, message: "Invalid email format" });
  }

  const insertQuery = "INSERT INTO emails (email) VALUES ($1)";
  try {
    const client = await pool.connect();
    await client.query(insertQuery, [email]);
    client.release();
    res.json({ success: true });
  } catch (err) {
    if (err.code === "23505") {
      // PostgreSQL unique constraint violation code
      res.json({ success: false, message: "Email already exists" });
    } else {
      console.error("Database error:", err);
      res.json({ success: false, message: "Database error" });
    }
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
