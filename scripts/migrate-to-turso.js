/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * One-time migration: copies data from the local paint_house.db (SQLite)
 * file into your Turso cloud database.
 *
 * Usage:
 *   1. Create a database at https://turso.tech (free tier is fine)
 *   2. Set these two env vars (in a .env.local file or your shell):
 *        TURSO_DATABASE_URL=libsql://xxxx.turso.io
 *        TURSO_AUTH_TOKEN=xxxxxxxx
 *   3. Run:  node scripts/migrate-to-turso.js
 */
const Database = require("better-sqlite3");
const { createClient } = require("@libsql/client");
const path = require("path");

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  console.error(
    "Missing TURSO_DATABASE_URL / TURSO_AUTH_TOKEN env vars. Set them first, see comment at top of this file."
  );
  process.exit(1);
}

const localDb = new Database(path.resolve(__dirname, "../paint_house.db"));
const turso = createClient({ url: TURSO_DATABASE_URL, authToken: TURSO_AUTH_TOKEN });

const TABLES = [
  { name: "Cars", cols: ["id", "company", "model", "year"] },
  { name: "Colors", cols: ["id", "car_id", "color_name", "paint_code"] },
  {
    name: "PaintAvailability",
    cols: ["id", "color_id", "imported_available", "china_available"],
  },
  { name: "Leads", cols: ["id", "name", "phone", "company", "model", "year", "created_at"] },
  {
    name: "Portfolio",
    cols: [
      "id",
      "title",
      "description",
      "media_type",
      "media_url",
      "category",
      "sort_order",
      "created_at",
    ],
  },
  {
    name: "Reviews",
    cols: ["id", "name", "car", "rating", "comment", "created_at", "approved"],
  },
];

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS Cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT, company TEXT NOT NULL, model TEXT NOT NULL, year INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS Colors (
    id INTEGER PRIMARY KEY AUTOINCREMENT, car_id INTEGER NOT NULL, color_name TEXT NOT NULL, paint_code TEXT NOT NULL,
    FOREIGN KEY (car_id) REFERENCES Cars (id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS PaintAvailability (
    id INTEGER PRIMARY KEY AUTOINCREMENT, color_id INTEGER NOT NULL,
    imported_available INTEGER DEFAULT 1, china_available INTEGER DEFAULT 1,
    FOREIGN KEY (color_id) REFERENCES Colors (id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS Leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL,
    company TEXT NOT NULL, model TEXT NOT NULL, year TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS Portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT DEFAULT '', description TEXT,
    media_type TEXT NOT NULL CHECK(media_type IN ('image','video')), media_url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'expertise', sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS Reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, car TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5), comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, approved INTEGER DEFAULT 1
  );
`;

async function main() {
  console.log("Creating tables on Turso (if not present)...");
  for (const stmt of SCHEMA.split(";").map((s) => s.trim()).filter(Boolean)) {
    await turso.execute(stmt);
  }

  for (const table of TABLES) {
    const rows = localDb.prepare(`SELECT * FROM ${table.name}`).all();
    console.log(`Migrating ${rows.length} row(s) from ${table.name}...`);
    for (const row of rows) {
      const placeholders = table.cols.map(() => "?").join(", ");
      const values = table.cols.map((c) => row[c] ?? null);
      await turso.execute({
        sql: `INSERT OR IGNORE INTO ${table.name} (${table.cols.join(", ")}) VALUES (${placeholders})`,
        args: values,
      });
    }
  }

  console.log("Migration complete!");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
