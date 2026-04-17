import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { positiveIntOrNull, stringOrNull } from "./validation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "../../data/data.db");

export const db = new Database(dbPath);

export const initializeDatabase = () => {
  const schemaPath = path.join(__dirname, "schema.sql");

  const schema = fs.readFileSync(schemaPath, "utf-8");

  db.exec(schema);

  console.log("Database initialized");
}


