import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../utils/db";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface User {
  username: string;
  email: string;
  hashedpassword: string;
}
function findUserByUsername(username: string): Promise<User> {
  return db.one(`SELECT * FROM users WHERE username = $1`, [username]);
}

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

export async function register(req: Request, res: Response) {
  const { username, email, password } = req.body;
  if (!email || !password || !username)
    return res
      .status(400)
      .json({ message: "Username, email and password required" });
  const hashedPassword = await bcrypt.hash(password, 10);

  findUserByUsername(username)
    .then((user) => {
      return res
        .status(409)
        .json({ message: "Username already exists", username: user.username });
    })
    .catch((err) => {
      {
        createUser(username, email, hashedPassword); //return res.status(201).json({ username: user.username, email: user?.email });
        return res.status(201).json({
          message: "User registered successfully",
          username: username,
          email: email,
        });
      }
    });
}

// export async function login(req: Request, res: Response) {
//   const { email, password } = req.body;
//   if (!email || !password)
//     return res.status(400).json({ message: "Email and password required" });

//   const user = await findUserByUsername(email);
//   if (!user) return res.status(401).json({ message: "Invalid credentials" });

//   const match = await bcrypt.compare(password, user.password);
//   if (!match) return res.status(401).json({ message: "Invalid credentials" });

//   const token = jwt.sign({ useremail: user.email }, JWT_SECRET, {
//     expiresIn: "1h",
//   });
//   res.json({ token });
// }
