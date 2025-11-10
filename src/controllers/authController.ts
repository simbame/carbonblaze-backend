import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { JWT_SECRET } from "../config/envConfig";
import { emailRegexp } from "../utils/format";
import { User } from "../common/type";
import db from "../utils/db";

function createUser(
  username: string,
  email: string,
  hashedpassword: string
): Promise<User> {
  return db.one(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, hashedpassword]
  );
}

function findUserByUsername(username: string): Promise<User | null> {
  const result = db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((users) => users[0] || null);

  console.log(result);
  return result;
}

function findUserByUserEmail(email: string): Promise<User | null> {
  const result = db
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((users) => users[0] || null);

  console.log(result);
  return result;
}

export async function register(req: Request, res: Response) {
  const { username, email, password } = req.body;

  const isValidEmail = (email: string) => {
    return emailRegexp.test(email);
  };

  if (!email || !password || !username)
    return res
      .status(400)
      .json({ message: "Username, email and password required" });

  if (!isValidEmail(email))
    return res.status(400).json({ message: "Invalid email format" });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  findUserByUsername(username)
    .then((user) => {
      if (user)
        return res.status(409).json({
          message: "Username already exists",
          username: user.username,
        });
      else {
        findUserByUserEmail(email).then((userByEmail) => {
          if (userByEmail)
            return res.status(409).json({
              message: "Email already exists",
              email: userByEmail.email,
            });
          else {
            createUser(username, email, hashedPassword); //return res.status(201).json({ username: user.username, email: user?.email });
            return res.status(201).json({
              message: "User registered successfully",
              username: username,
              email: email,
            });
          }
        });
      }
    })
    .catch((err) => {
      {
        return res.status(500).json({ error: "Internal server error" });
      }
    });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  console.log("Login attempt:", req.body);
  if (!email || !password)
    return res.status(400).json({ message: "Username and password required" });

  try {
    const user = await findUserByUserEmail(email);
    console.log("Found user:", user);
    if (user != null && user != undefined) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ useremail: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.json({ token });
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(401).json({ message: "Invalid credentials" });
  }
}
