require("dotenv").config();
const bcrypt = require("bcrypt");
const Database = require("better-sqlite3");
const db = new Database(process.env.DB_FILE || "database.db");

// USERS
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'viewer' CHECK(role IN ('admin', 'editor', 'viewer'))
  )
`
).run();

// PAGES
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL
  )
`
).run();
// Page content
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    identifier TEXT NOT NULL,
    title TEXT NOT NULL,
    description_md TEXT,
    risk_level TEXT,
    damage_type TEXT,
    damage TEXT,
    Qliphoth TEXT,
    Image TEXT,
    page_id INTEGER NOT NULL,
    FOREIGN KEY (page_id) REFERENCES pages(id)
  )
`
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS changes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    identifier TEXT NOT NULL,
    title TEXT NOT NULL,
    description_md TEXT,
    risk_level TEXT,
    damage_type TEXT,
    damage TEXT,
    Qliphoth TEXT,
    Image TEXT,
    user_id INTEGER NOT NULL,
    content_id INTEGER NOT NULL,
    page_id INTEGER NOT NULL,
    FOREIGN KEY (page_id) REFERENCES pages(id),
    FOREIGN KEY (content_id) REFERENCES content(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`
).run();

// Default admin
(async () => {
  const userExists = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get("admin");

  if (!userExists) {
    const adminpass = await bcrypt.hash("admin123", 10);
    db.prepare(
      "INSERT INTO users (username,email ,password, role) VALUES (?, ?, ?, ?)"
    ).run("admin", "admin@mail.com", adminpass, "admin");
  }
})();

// db.prepare("INSERT INTO pages (title, slug) VALUES(?,?)").run("test","test")
// db.prepare(`DROP TABLE IF EXISTS changes`).run();
// db.prepare("DELETE FROM pages WHERE id = 2").run()

module.exports = db;
