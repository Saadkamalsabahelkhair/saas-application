import "server-only"
import Database from "better-sqlite3"
import { mkdirSync } from "node:fs"
import path from "node:path"

const databasePath = process.env.SQLITE_DB_PATH ?? path.join(process.cwd(), "data", "companions.sqlite")
mkdirSync(path.dirname(databasePath), { recursive: true })

const globalForDatabase = globalThis as typeof globalThis & {
  sqliteDatabase?: Database.Database
}

export const db = globalForDatabase.sqliteDatabase ?? new Database(databasePath)

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.sqliteDatabase = db
}

db.pragma("foreign_keys = ON")
db.pragma("journal_mode = WAL")
db.exec(`
  CREATE TABLE IF NOT EXISTS companions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    duration INTEGER NOT NULL,
    voice TEXT NOT NULL,
    style TEXT NOT NULL,
    author TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS session_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    companion_id TEXT NOT NULL REFERENCES companions(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS companions_author_idx ON companions(author);
  CREATE INDEX IF NOT EXISTS session_history_user_created_idx
    ON session_history(user_id, created_at DESC);
  CREATE INDEX IF NOT EXISTS session_history_created_idx
    ON session_history(created_at DESC);
`)