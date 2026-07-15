import { createClient, type Client, type InArgs } from "@libsql/client";
import type {
  AdminColorRow,
  PaintMatchResult,
  PortfolioItem,
  Review,
} from "./types";

/**
 * Turso / libSQL client.
 *
 * - In local development (no env vars set) this transparently uses a local
 *   SQLite file (`paint_house.db`) — exactly like better-sqlite3 did.
 * - In production (Vercel, Railway, etc.) set TURSO_DATABASE_URL and
 *   TURSO_AUTH_TOKEN and it talks to your Turso cloud database instead.
 *   Vercel's filesystem is read-only/ephemeral, so a real cloud DB is
 *   required there — a local file will NOT persist.
 */
let client: Client | null = null;
let ready: Promise<void> | null = null;

function getClient(): Client {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL || "file:paint_house.db";
    const authToken = process.env.TURSO_AUTH_TOKEN;
    client = authToken ? createClient({ url, authToken }) : createClient({ url });
  }
  return client;
}

async function ensureTables(): Promise<void> {
  const db = getClient();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS Cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL
    );
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS Colors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      car_id INTEGER NOT NULL,
      color_name TEXT NOT NULL,
      paint_code TEXT NOT NULL,
      FOREIGN KEY (car_id) REFERENCES Cars (id) ON DELETE CASCADE
    );
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS PaintAvailability (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      color_id INTEGER NOT NULL,
      imported_available INTEGER DEFAULT 1,
      china_available INTEGER DEFAULT 1,
      FOREIGN KEY (color_id) REFERENCES Colors (id) ON DELETE CASCADE
    );
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS Leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      company TEXT NOT NULL,
      model TEXT NOT NULL,
      year TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS Portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT DEFAULT '',
      description TEXT,
      media_type TEXT NOT NULL CHECK(media_type IN ('image', 'video')),
      media_url TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'expertise',
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS Reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      car TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      comment TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      approved INTEGER DEFAULT 1
    );
  `);
}

export async function getDb(): Promise<Client> {
  if (!ready) ready = ensureTables();
  await ready;
  return getClient();
}

async function query<T = Record<string, unknown>>(
  sql: string,
  args: InArgs = []
): Promise<T[]> {
  const db = await getDb();
  const result = await db.execute({ sql, args });
  return result.rows as unknown as T[];
}

async function run(sql: string, args: InArgs = []) {
  const db = await getDb();
  return db.execute({ sql, args });
}

export async function searchPaintMatches(
  company: string,
  model: string,
  year: string
): Promise<PaintMatchResult[]> {
  const rows = await query<{
    color_name: string;
    paint_code: string;
    imported_available: number;
    china_available: number;
  }>(
    `SELECT c.color_name, c.paint_code, pa.imported_available, pa.china_available
     FROM Cars car
     JOIN Colors c ON c.car_id = car.id
     JOIN PaintAvailability pa ON pa.color_id = c.id
     WHERE LOWER(car.company) = LOWER(?) AND LOWER(car.model) = LOWER(?) AND car.year = ?
     ORDER BY c.color_name ASC`,
    [company.trim(), model.trim(), parseInt(year, 10)]
  );

  return rows.map((row) => ({
    color_name: row.color_name,
    paint_code: row.paint_code,
    imported_available: Boolean(row.imported_available),
    china_available: Boolean(row.china_available),
  }));
}

export async function getCompanies(): Promise<string[]> {
  const rows = await query<{ company: string }>(
    "SELECT DISTINCT company FROM Cars ORDER BY company ASC"
  );
  return rows.map((r) => r.company);
}

export async function getModels(company: string): Promise<string[]> {
  const rows = await query<{ model: string }>(
    "SELECT DISTINCT model FROM Cars WHERE LOWER(company) = LOWER(?) ORDER BY model ASC",
    [company]
  );
  return rows.map((r) => r.model);
}

export async function getYears(company: string, model: string): Promise<number[]> {
  const rows = await query<{ year: number }>(
    `SELECT DISTINCT year FROM Cars
     WHERE LOWER(company) = LOWER(?) AND LOWER(model) = LOWER(?)
     ORDER BY year DESC`,
    [company, model]
  );
  return rows.map((r) => r.year);
}

export async function insertLead(data: {
  name: string;
  phone: string;
  company: string;
  model: string;
  year: string;
}): Promise<number> {
  const result = await run(
    `INSERT INTO Leads (name, phone, company, model, year) VALUES (?, ?, ?, ?, ?)`,
    [data.name, data.phone, data.company, data.model, data.year]
  );
  return Number(result.lastInsertRowid);
}

// ─── Admin: Colors ───────────────────────────────────────────────

export async function getAllColorsAdmin(): Promise<AdminColorRow[]> {
  const rows = await query<{
    color_id: number;
    color_name: string;
    paint_code: string;
    imported_available: number;
    china_available: number;
    car_id: number;
    company: string;
    model: string;
    year: number;
  }>(
    `SELECT c.id AS color_id, c.color_name, c.paint_code,
            pa.imported_available, pa.china_available,
            car.id AS car_id, car.company, car.model, car.year
     FROM Colors c
     JOIN Cars car ON car.id = c.car_id
     JOIN PaintAvailability pa ON pa.color_id = c.id
     ORDER BY car.company, car.model, car.year, c.color_name`
  );

  return rows.map((r) => ({
    ...r,
    imported_available: Boolean(r.imported_available),
    china_available: Boolean(r.china_available),
  }));
}

export async function addColorRecord(data: {
  company: string;
  model: string;
  year: number;
  color_name: string;
  paint_code: string;
  imported_available: boolean;
  china_available: boolean;
}): Promise<number> {
  const existing = await query<{ id: number }>(
    `SELECT id FROM Cars WHERE LOWER(company)=LOWER(?) AND LOWER(model)=LOWER(?) AND year=?`,
    [data.company, data.model, data.year]
  );

  let carId: number;
  if (existing.length > 0) {
    carId = existing[0].id;
  } else {
    const r = await run(`INSERT INTO Cars (company, model, year) VALUES (?, ?, ?)`, [
      data.company,
      data.model,
      data.year,
    ]);
    carId = Number(r.lastInsertRowid);
  }

  const colorResult = await run(
    `INSERT INTO Colors (car_id, color_name, paint_code) VALUES (?, ?, ?)`,
    [carId, data.color_name, data.paint_code]
  );
  const colorId = Number(colorResult.lastInsertRowid);

  await run(
    `INSERT INTO PaintAvailability (color_id, imported_available, china_available) VALUES (?, ?, ?)`,
    [colorId, data.imported_available ? 1 : 0, data.china_available ? 1 : 0]
  );

  return colorId;
}

export async function deleteColorRecord(colorId: number): Promise<boolean> {
  const result = await run(`DELETE FROM Colors WHERE id = ?`, [colorId]);
  return result.rowsAffected > 0;
}

// ─── Portfolio ─────────────────────────────────────────────────────

export async function getPortfolioItems(category?: string): Promise<PortfolioItem[]> {
  if (category) {
    return query<PortfolioItem>(
      `SELECT * FROM Portfolio WHERE category = ? ORDER BY sort_order ASC, created_at DESC`,
      [category]
    );
  }
  return query<PortfolioItem>(
    `SELECT * FROM Portfolio ORDER BY sort_order ASC, created_at DESC`
  );
}

export async function addPortfolioItem(data: {
  title: string;
  description?: string;
  media_type: "image" | "video";
  media_url: string;
  category: string;
  sort_order?: number;
}): Promise<number> {
  const result = await run(
    `INSERT INTO Portfolio (title, description, media_type, media_url, category, sort_order)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      data.description ?? null,
      data.media_type,
      data.media_url,
      data.category,
      data.sort_order ?? 0,
    ]
  );
  return Number(result.lastInsertRowid);
}

export async function deletePortfolioItem(id: number): Promise<boolean> {
  const result = await run(`DELETE FROM Portfolio WHERE id = ?`, [id]);
  return result.rowsAffected > 0;
}

export async function getPortfolioItem(id: number): Promise<PortfolioItem | undefined> {
  const rows = await query<PortfolioItem>(`SELECT * FROM Portfolio WHERE id = ?`, [id]);
  return rows[0];
}

export async function getApprovedReviews(): Promise<Review[]> {
  return query<Review>(`SELECT * FROM Reviews WHERE approved = 1 ORDER BY created_at DESC`);
}

export async function addReview(data: {
  name: string;
  car: string;
  rating: number;
  comment: string;
}): Promise<number> {
  const result = await run(
    `INSERT INTO Reviews (name, car, rating, comment) VALUES (?, ?, ?, ?)`,
    [data.name, data.car, data.rating, data.comment]
  );
  return Number(result.lastInsertRowid);
}
