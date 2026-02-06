import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export type AuthRequest = Request & { user?: { id: number; email: string } };

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "unauthorized" });
  }

  const token = header.slice("Bearer ".length);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ message: "jwt config missing" });
  }

  try {
    const payload = jwt.verify(token, secret) as { id: number; email: string };
    req.user = { id: payload.id, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ message: "unauthorized" });
  }
}
