const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require('path');
const db = require("./src/db.js");
const fs = require("fs");
const bcrypt = require('bcrypt');
app.use(express.json());
const JWT_SECRET = process.env.JWT_SECRET || JSW;

const pagesRouter = require("./src/routes/pages.js")

const corsOptions = {
  origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));
const port = process.env.PORT || 8080;


app.use("/api/pages", pagesRouter);

app.get("/api", (req, res) => {
  res.json({ message: "Linked" });
});



app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
