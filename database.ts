import { open, save } from "https://deno.land/x/sqlite/mod.ts";

const db = await open("test.db");
db.query(
  `CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY UNIQUE, username TEXT UNIQUE, password TEXT, nickname TEXT, token TEXT)`,
  {},
);
await save(db);

console.log("Database connection established.");

const insertUser = async (
  { id, username, password, nickname, token }: {
    id: string;
    username: string;
    password: string;
    nickname: string;
    token: string;
  },
) => {
  db.query(
    "INSERT INTO user (id, username, password, nickname, token) VALUES (?, ?, ?, ?, ?)",
    [id, username, password, nickname, token],
  );
  await save(db);
};

const getUserFromDB = async ({ username }: { username: string }) => {
    let user: any;
    for (const u of db.query(`SELECT * FROM user WHERE username='${username}'`, [])) {
       user = u;
       break;
    }

    return user;
};

const checkIfUserExisted = async ({ username } : { username: string }) => {
    let userExisted: boolean = false;
    for (const _ of db.query(`SELECT * FROM user WHERE username='${username}'`, [])) {
        userExisted = true;
        break;
    }
    return userExisted;
}

export { insertUser, checkIfUserExisted, getUserFromDB };