import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../config/envConfig";
import jwt from "jsonwebtoken";
import { Console } from "console";

interface JwtPayload {
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const checkToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (!authHeader) {
    // || !authHeader.startsWith('Bearer ')
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader;
  // console.log(token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log(decoded);
    req.body = decoded; // attach user info to request
    next(); // pass control to next middleware or route
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", islogged: false });
  }
};
