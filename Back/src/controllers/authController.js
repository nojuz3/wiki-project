const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db.js");

const JWT_SECRET = process.env.JWT_SECRET || JSW;

const register = async (req, res) => {
  const { email, username, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields (username, email, password) are required.",
    });
  }

  try {
    const existinguser = db
      .prepare("SELECT * FROM users WHERE  username = ? OR email = ?")
      .get(username, email);
    if (existinguser) {
      return res
        .status(400)
        .json({ success: false, message: "The email exists" });
    }

    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const def = "user";
    db.prepare(
      "INSERT INTO users (username, email, password) VALUES (?, ? , ?)"
    ).run(username, email, hashPassword);

    res.json({ success: true, message: "User created!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userRow = db
      .prepare(
        "SELECT id, username, password, role FROM users WHERE username = ?"
      )
      .get(username);

    if (!userRow) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, userRow.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: userRow.id, role: userRow.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const me = async (req, res) => {
  try {
    const user = db
      .prepare("SELECT id, username, role FROM users WHERE id = ?")
      .get(req.user.id);

    if (!user) {
      return;
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { register, login, me };
