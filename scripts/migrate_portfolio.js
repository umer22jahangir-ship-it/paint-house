const db = require('better-sqlite3')('paint_house.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS Portfolio_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT DEFAULT '',
    description TEXT,
    media_type TEXT NOT NULL CHECK(media_type IN ('image','video')),
    media_url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'expertise',
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  INSERT INTO Portfolio_new (id, title, description, media_type, media_url, category, sort_order, created_at)
  SELECT id, title, description, media_type, media_url, category, sort_order, created_at FROM Portfolio
`);

db.exec(`DROP TABLE Portfolio`);
db.exec(`ALTER TABLE Portfolio_new RENAME TO Portfolio`);

console.log('Done! title is now optional in DB.');
db.close();
