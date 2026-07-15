const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'paint_house.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS Portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      media_type TEXT NOT NULL CHECK(media_type IN ('image', 'video')),
      media_url TEXT NOT NULL,
      category TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

  INSERT INTO Portfolio (title, description, media_type, media_url, category, sort_order)
  VALUES 
  ('Aftab Paint House', 'Official Business Card', 'image', '/portfolio/1.jpg', 'expertise', 1),
  ('Extensive Inventory', 'Wide range of auto paints available', 'image', '/portfolio/2.jpg', 'expertise', 2),
  ('Authorized Dealer', 'Premium Quality Paint Products', 'image', '/portfolio/3.jpg', 'expertise', 3),
  ('Color Matching Station', 'Precision paint mixing setup', 'image', '/portfolio/4.jpg', 'expertise', 4);
`);

console.log("Successfully inserted portfolio items.");
