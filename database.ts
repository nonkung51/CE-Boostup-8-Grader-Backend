import { open, save } from "https://deno.land/x/sqlite/mod.ts";

const db = await open("test.db");
db.query(`CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY UNIQUE, username TEXT UNIQUE, password TEXT, nickname TEXT, token TEXT)`, {}
);
await save(db);

console.log("Database connection established.")

export default db;