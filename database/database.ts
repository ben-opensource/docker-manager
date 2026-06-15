import sqlite3NonVerbose from "sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { addDefaultRoles } from "./defaultRoles.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlite3 = sqlite3NonVerbose.verbose();
const dbPath = path.join(__dirname, "data/app.db");
const sqlPath = path.join(__dirname, "seed.sql");

const dbExists = fs.existsSync(dbPath);

const db = new sqlite3.Database(dbPath, async (err: any) => {
  if (err) {
    console.error("Failed to connect to database:", err);
    return;
  }

  console.log("Connected to SQLite database.");

  // Seed only if DB did not exist yet
  if (!dbExists) {
    console.log("Initializing database from SQL file...");

    const initSql = fs.readFileSync(sqlPath, "utf8");

    db.exec(initSql, (err: any) => {
      if (err) {
        console.error("Failed to initialize database:", err);
      } else {
        console.log("Database initialized successfully.");
      }
    });

    await addDefaultRoles(db);
  }
});


export default db;