import pgPromise from "pg-promise";

import { DATABASE_URL } from "../config/dbConfig";

const pgp = pgPromise();

const db = pgp(DATABASE_URL);

export default db;
