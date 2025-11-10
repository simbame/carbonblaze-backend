import pgPromise from "pg-promise";

import { DATABASE_URL } from "../config/dbConfig";

const pgp = pgPromise();

const db = pgp(DATABASE_URL);

db.query(
  "CREATE TABLE IF NOT EXISTS users(username VARCHAR(255), email VARCHAR(255), password VARCHAR(255), no SERIAL PRIMARY KEY )",
  123
).then(() => {
  console.log("User table is created.");
});

export default db;
