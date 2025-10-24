const express = require("express");
const db = require("../db.js");
const { slugify } = require("../utils/slugify.js");
const { register, login, me } = require("../controllers/authController.js");
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

router.get("/all",(req,res) =>{
  try {
    const pages = db.prepare("SELECT page_id, Image  FROM content").all();
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: "Internal error"})
  }
})

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, me);

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

router.post("/:slug/content", authenticateToken, (req, res) => {
  const { slug } = req.params;
  if(req.user.role !== "admin" || req.user.role !== "editor"){
    return res.status(403).json({ success: false, message: "Access denied"})
  }
  const user_id = req.user.id
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
  try {
    if (!page_data) {
      db.prepare(
        "INSERT INTO content (identifier, title, description_md, damage_type, damage, Qliphoth, Image, risk_level, page_id) VALUES(?,?,?,?,?,?,?,?,?)"
      ).run(
        identifier,
        title,
        description_md,
        damage_type,
        damage,
        Qliphoth,
        Image,
        risk_level,
        page.id
      );
    } else {
      if (identifier && identifier !== "") {
        db.prepare("UPDATE content SET identifier = ? WHERE page_id = ?").run(
          identifier,
          page.id
        );
      }
      if (title && title !== "") {
        db.prepare("UPDATE content SET title = ? WHERE page_id = ?").run(
          title,
          page.id
        );
      }
      if (description_md && description_md !== "") {
        db.prepare(
          "UPDATE content SET description_md = ? WHERE page_id = ?"
        ).run(description_md, page.id);
      }
      if (damage_type && damage_type !== "") {
        db.prepare("UPDATE content SET damage_type = ? WHERE page_id = ?").run(
          damage_type,
          page.id
        );
      }
      if (damage && damage !== "") {
        db.prepare("UPDATE content SET damage = ? WHERE page_id = ?").run(
          damage,
          page.id
        );
      }
      if (Qliphoth && Qliphoth !== "") {
        db.prepare("UPDATE content SET Qliphoth = ? WHERE page_id = ?").run(
          Qliphoth,
          page.id
        );
      }
      if (Image && Image !== "") {
        db.prepare("UPDATE content SET Image = ? WHERE page_id = ?").run(
          Image,
          page.id
        );
      }
      if (risk_level && risk_level !== "") {
        db.prepare("UPDATE content SET risk_level = ? WHERE page_id = ?").run(
          risk_level,
          page.id
        );
      }
    }
  } catch (error) {
    console.log(error);
  }

  return res.json({ message: "Page updated", slug });
});

module.exports = router;
