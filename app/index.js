const Database = require("better-sqlite3");

const dbFile = process.env.DBFILE || "./data.sql";
const db = new Database(dbFile);

const short = require("short-uuid");
const express = require("express");
const app = express();

const morgan = require("morgan");

const url = process.env.URL || "http://localhost:3000";

app.set("view engine", "ejs");
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));

const tableName = "geheim";
const fields = "(uuid text NOT NULL UNIQUE, message text NOT NULL)";
const query = `CREATE TABLE IF NOT EXISTS  ${tableName} ${fields}`;

db.prepare(query).run();

app.get("/", (req, res) => {
  res.render("index", { form: true });
});

app.post("/geheim", (req, res) => {
  const { text } = req.body;
  if (!text) return res.redirect("/");

  const uuid = short.generate().toLowerCase();
  db.prepare(`INSERT INTO ${tableName} VALUES (?,?)`).run(uuid, text);
  const add = db.prepare(`SELECT * FROM ${tableName}`).all();

  res.render("index", { form: false, message: `${url}/geheim/${uuid}` });
});

app.get("/geheim/:id", (req, res) => {
  const { id } = req.params;
  if (id) {
    const result = db.prepare("SELECT * FROM geheim WHERE uuid = ?").get(id);
    if (!result) return res.redirect("/");

    db.prepare("DELETE FROM geheim WHERE uuid = ?").run(id);
    res.render("index", { form: false, message: result.message });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
