import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const app = express();

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "Thss";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Acesso negado" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
};
