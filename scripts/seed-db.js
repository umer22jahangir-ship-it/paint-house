/* eslint-disable @typescript-eslint/no-require-imports */
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../paint_house.db');
console.log('Connecting to database at:', dbPath);

const db = new Database(dbPath);

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS Cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Colors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id INTEGER NOT NULL,
    color_name TEXT NOT NULL,
    paint_code TEXT NOT NULL,
    FOREIGN KEY (car_id) REFERENCES Cars (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS PaintAvailability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    color_id INTEGER NOT NULL,
    imported_available INTEGER DEFAULT 1, -- 1 = true, 0 = false
    china_available INTEGER DEFAULT 1,
    FOREIGN KEY (color_id) REFERENCES Colors (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS Leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT NOT NULL,
    model TEXT NOT NULL,
    year TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

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
`);

console.log('Tables created successfully.');

// Seed Sample Data
const carsSeed = [
  { company: 'Toyota', model: 'Corolla', year: 2021 },
  { company: 'Toyota', model: 'Corolla', year: 2022 },
  { company: 'Toyota', model: 'Yaris', year: 2020 },
  { company: 'Honda', model: 'Civic', year: 2021 },
  { company: 'Honda', model: 'Civic', year: 2022 },
  { company: 'Honda', model: 'City', year: 2020 },
  { company: 'Suzuki', model: 'Swift', year: 2021 },
  { company: 'Suzuki', model: 'Cultus', year: 2020 },
  { company: 'Hyundai', model: 'Elantra', year: 2021 },
  { company: 'Kia', model: 'Sportage', year: 2021 }
];

const colorsSeed = [
  // Corolla 2021
  { car_index: 0, color_name: 'Super White II', paint_code: '040', imported: 1, china: 1 },
  { car_index: 0, color_name: 'Silver Metallic', paint_code: '1D4', imported: 1, china: 0 },
  { car_index: 0, color_name: 'Attitude Black Mica', paint_code: '218', imported: 1, china: 1 },
  { car_index: 0, color_name: 'Bronze Mica Metallic', paint_code: '4R8', imported: 0, china: 1 },
  
  // Corolla 2022
  { car_index: 1, color_name: 'Super White II', paint_code: '040', imported: 1, china: 1 },
  { car_index: 1, color_name: 'Silver Metallic', paint_code: '1D4', imported: 1, china: 1 },
  { car_index: 1, color_name: 'Attitude Black Mica', paint_code: '218', imported: 1, china: 1 },
  { car_index: 1, color_name: 'Phantom Brown', paint_code: '4U3', imported: 1, china: 0 },

  // Yaris 2020
  { car_index: 2, color_name: 'Super White II', paint_code: '040', imported: 1, china: 1 },
  { car_index: 2, color_name: 'Grey Graphite', paint_code: '1G3', imported: 1, china: 0 },
  { car_index: 2, color_name: 'Red Mica Metallic', paint_code: '3R3', imported: 1, china: 1 },

  // Civic 2021
  { car_index: 3, color_name: 'Taffeta White', paint_code: 'NH-578', imported: 1, china: 1 },
  { car_index: 3, color_name: 'Lunar Silver Metallic', paint_code: 'NH-830M', imported: 1, china: 0 },
  { car_index: 3, color_name: 'Crystal Black Pearl', paint_code: 'NH-731P', imported: 1, china: 1 },
  { car_index: 3, color_name: 'Carnelian Red Pearl', paint_code: 'R-543P', imported: 0, china: 1 },

  // Civic 2022
  { car_index: 4, color_name: 'Taffeta White', paint_code: 'NH-578', imported: 1, china: 1 },
  { car_index: 4, color_name: 'Meteoroid Grey Metallic', paint_code: 'NH-904M', imported: 1, china: 0 },
  { car_index: 4, color_name: 'Crystal Black Pearl', paint_code: 'NH-731P', imported: 1, china: 1 },

  // City 2020
  { car_index: 5, color_name: 'Taffeta White', paint_code: 'NH-578', imported: 1, china: 1 },
  { car_index: 5, color_name: 'Alabaster Silver Metallic', paint_code: 'NH-700M', imported: 1, china: 1 },
  { car_index: 5, color_name: 'Modern Steel Metallic', paint_code: 'NH-797M', imported: 1, china: 0 },

  // Swift 2021
  { car_index: 6, color_name: 'Solid White', paint_code: '26U', imported: 1, china: 1 },
  { car_index: 6, color_name: 'Silky Silver Metallic', paint_code: 'Z2S', imported: 1, china: 1 },
  { car_index: 6, color_name: 'Mineral Grey Metallic', paint_code: 'ZMN', imported: 1, china: 0 },

  // Cultus 2020
  { car_index: 7, color_name: 'Solid White', paint_code: '26U', imported: 1, china: 1 },
  { car_index: 7, color_name: 'Silky Silver Metallic', paint_code: 'Z2S', imported: 1, china: 1 },
  { car_index: 7, color_name: 'Graphite Grey', paint_code: 'Z65', imported: 1, china: 0 },

  // Elantra 2021
  { car_index: 8, color_name: 'Polar White', paint_code: 'WAW', imported: 1, china: 1 },
  { car_index: 8, color_name: 'Teal Blue Metallic', paint_code: 'TG8', imported: 1, china: 0 },

  // Sportage 2021
  { car_index: 9, color_name: 'Clear White', paint_code: 'UD', imported: 1, china: 1 },
  { car_index: 9, color_name: 'Cherry Black Metallic', paint_code: '9H', imported: 1, china: 0 },
  { car_index: 9, color_name: 'Mercury Blue Pearl', paint_code: 'BU2', imported: 0, china: 1 }
];

// Clean existing data for a fresh seed
db.prepare('DELETE FROM PaintAvailability').run();
db.prepare('DELETE FROM Colors').run();
db.prepare('DELETE FROM Cars').run();

// Insert Cars and Colors
const insertCar = db.prepare('INSERT INTO Cars (company, model, year) VALUES (?, ?, ?)');
const insertColor = db.prepare('INSERT INTO Colors (car_id, color_name, paint_code) VALUES (?, ?, ?)');
const insertAvailability = db.prepare('INSERT INTO PaintAvailability (color_id, imported_available, china_available) VALUES (?, ?, ?)');

const seededCarIds = [];

// Transaction for speed and safety
const seedTransaction = db.transaction(() => {
  carsSeed.forEach(car => {
    const info = insertCar.run(car.company, car.model, car.year);
    seededCarIds.push(info.lastInsertRowid);
  });

  colorsSeed.forEach(col => {
    const carId = seededCarIds[col.car_index];
    const info = insertColor.run(carId, col.color_name, col.paint_code);
    const colorId = info.lastInsertRowid;
    insertAvailability.run(colorId, 1, 1);
  });
});

seedTransaction();

console.log('Database seeded successfully with initial automotive paints data!');
db.close();
