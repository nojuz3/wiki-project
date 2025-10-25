const express = require("express");
const db = require("../db.js");
const { slugify } = require("../utils/slugify.js");
const {
  register,
  login,
  me,
  users,
} = require("../controllers/authController.js");
const { authenticateToken } = require("../middle/middleware.js");
const router = express.Router();

router.get("/", (req, res) => {
  try {
    const pages = db.prepare("SELECT id, title, slug FROM pages").all();
    res.json(pages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pages" });
  }
});

router.get("/all", (req, res) => {
  try {
    const pages = db.prepare("SELECT page_id, Image  FROM content").all();
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: "Internal error" });
  }
});

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, me);
router.get("/users", authenticateToken, users);

router.get("/:slug", (req, res) => {
  const page = db
    .prepare("SELECT * FROM pages WHERE slug = ?")
    .get(req.params.slug);
  if (!page) return res.status(404).json({ error: "Page not found" });
  res.json(page);
});
router.get("/:slug/data", (req, res) => {
  const page = db
    .prepare("SELECT * FROM pages WHERE slug = ?")
    .get(req.params.slug);
  const data = db
    .prepare("SELECT * FROM content WHERE page_id = ?")
    .get(page.id);
  res.json(data);
});

router.post("/", (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "missing Title" });

  const slug = slugify(title);
  const exists = db.prepare("SELECT id FROM pages WHERE slug = ?").get(slug);

  if (exists) {
    db.prepare("UPDATE pages SET title = ? WHERE slug = ?").run(title, slug);
    res.json({ message: "Page updated", slug });
  } else {
    db.prepare("INSERT INTO pages (title, slug) VALUES (?, ?)").run(
      title,
      slug
    );
    res.status(201).json({ message: "Page created", slug });
  }
});
router.post("/delete", authenticateToken, (req, res) => {
  const { title } = req.body;
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  if (!title) return res.status(400).json({ error: "Missing title" });
  const check = db
    .prepare("SELECT title FROM pages WHERE title = ? ")
    .get(title);
  if (!check) {
    return res.status(404).json({ message: "Page not found." });
  }
  try {
    db.prepare("DELETE FROM pages WHERE title = ?").run(title);
    return res.json({ message: "Page was deleted" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/:slug/change", authenticateToken, (req, res) => {
  const { slug } = req.params;
  if (req.user.role !== "admin" && req.user.role !== "editor") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  const user_id = req.user.id;
  const {
    identifier,
    title,
    description_md,
    damage_type,
    damage,
    Qliphoth,
    Image,
    risk_level,
  } = req.body;

  if (risk_level && risk_level !== "") {
    const levels = ["ZAYIN", "TETH", "HE", "WAW", "ALEPH"];
    if (!levels.includes(risk_level)) {
      return res.status(400).json({ error: "incorrect risk level" });
    }
  }
  if (damage_type && damage_type !== "") {
    const dmg = ["Red", "White", "Black", "Pale"];
    if (!dmg.includes(damage_type)) {
      return res.status(400).json({ error: "incorrect Damage type" });
    }
  }

  const page = db.prepare("SELECT id FROM pages WHERE slug = ?").get(slug);
  const page_data = db
    .prepare("SELECT * FROM content WHERE page_id = ?")
    .get(page.id);
  // TEMPORARY
  if (!page_data) {
    db.prepare("INSERT INTO content (page_id) VALUES(?)").run(page.id);
  }

  // experimental
  const newData = {
    identifier,
    title,
    description_md,
    damage_type,
    damage,
    Qliphoth,
    Image,
    risk_level,
  };

  const changedFields = {};
  for (const key in newData) {
    const Value = newData[key];
    if (Value !== undefined && Value !== "" && Value !== page_data[key]) {
      changedFields[key] = Value;
    }
  }
  const insert = Object.keys(changedFields).join(", ");
  const placeholder = Object.keys(changedFields)
    .map(() => "?")
    .join(", ");

  const content_id = db
    .prepare("SELECT id FROM content WHERE page_id = ?")
    .get(page.id);
  const username = db
    .prepare("SELECT username FROM users WHERE id = ?")
    .get(user_id);
  db.prepare(
    `INSERT INTO changes (${insert}, username,user_id,content_id) VALUES(${placeholder},?,?,?)`
  ).run(
    ...Object.values(changedFields),
    username.username,
    user_id,
    content_id.id
  );

  return res.json({ message: "Page updated", slug });
});

router.get("/all/changes", (req, res) => {
  try {
    const pages = db.prepare("SELECT *  FROM changes").all();
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: "Internal error" });
  }
});

router.post("/finalize", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  const {
    id,
    identifier,
    title,
    description_md,
    damage_type,
    damage,
    Qliphoth,
    Image,
    risk_level,
    content_id,
  } = req.body;

  if (risk_level && risk_level !== "") {
    const levels = ["ZAYIN", "TETH", "HE", "WAW", "ALEPH"];
    if (!levels.includes(risk_level)) {
      return res.status(400).json({ error: "incorrect risk level" });
    }
  }
  if (damage_type && damage_type !== "") {
    const dmg = ["Red", "White", "Black", "Pale"];
    if (!dmg.includes(damage_type)) {
      return res.status(400).json({ error: "incorrect Damage type" });
    }
  }

  try {
    if (identifier && identifier !== "") {
      db.prepare("UPDATE content SET identifier = ? WHERE id = ?").run(
        identifier,
        content_id
      );
    }
    if (title && title !== "") {
      db.prepare("UPDATE content SET title = ? WHERE id = ?").run(
        title,
        content_id
      );
    }
    if (description_md && description_md !== "") {
      db.prepare("UPDATE content SET description_md = ? WHERE id = ?").run(
        description_md,
        content_id
      );
    }
    if (damage_type && damage_type !== "") {
      db.prepare("UPDATE content SET damage_type = ? WHERE id = ?").run(
        damage_type,
        content_id
      );
    }
    if (damage && damage !== "") {
      db.prepare("UPDATE content SET damage = ? WHERE id = ?").run(
        damage,
        content_id
      );
    }
    if (Qliphoth && Qliphoth !== "") {
      db.prepare("UPDATE content SET Qliphoth = ? WHERE id = ?").run(
        Qliphoth,
        content_id
      );
    }
    if (Image && Image !== "") {
      db.prepare("UPDATE content SET Image = ? WHERE id = ?").run(
        Image,
        content_id
      );
    }
    if (risk_level && risk_level !== "") {
      db.prepare("UPDATE content SET risk_level = ? WHERE id = ?").run(
        risk_level,
        content_id
      );
    }
  } catch (error) {
    console.log(error);
  }

  db.prepare(`DELETE FROM changes WHERE id = ?`).run(id);
  return res.json({ message: "Page updated" });
});
router.post("/changes/delete", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  const { id } = req.body;
  try {
    db.prepare(`DELETE FROM changes WHERE id = ?`).run(id);
    return res.json({ message: "Page updated" });
  } catch (error) {
    res.status(500).json({ error: "Internal error" });
  }
});
router.post("/updateRole", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  const { id, role } = req.body;
  if (!id || !role) {
    return;
  }
  if (role && role !== "") {
    const levels = ["admin","viewer","editor"];
    if (!levels.includes(role)) {
      return res.status(400).json({ error: "incorrect role" });
    }
  }

  try {
    db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, id);
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
