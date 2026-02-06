import { Request, Response } from "express";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import prisma from "../client";

function isEmpty(v: unknown) {
  return v === undefined || v === null || v === "";
}

export async function createUser(req: Request, res: Response) {
  const { email, password } = req.body;

  if (isEmpty(email)) return res.status(400).json({ message: "email is required" });
  if (isEmpty(password)) return res.status(400).json({ message: "password is required" });

  const existing = await prisma.user.findUnique({ where: { email: String(email) } });
  if (existing) {
    return res.status(400).json({ message: "email already used" });
  }

  const hashed = await bcrypt.hash(String(password), 10);

  const created = await prisma.user.create({
    data: { email: String(email), password: hashed },
    select: { id: true, email: true },
  });

  return res.status(201).json(created);
}

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;

  if (isEmpty(email)) return res.status(400).json({ message: "email is required" });
  if (isEmpty(password)) return res.status(400).json({ message: "password is required" });

  const user = await prisma.user.findUnique({ where: { email: String(email) } });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const ok = await bcrypt.compare(String(password), user.password);
  if (!ok) {
    return res.status(400).json({ message: "invalid password" });
  }

  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRATION;

  if (!secret || !expiresIn) {
    return res.status(500).json({ message: "jwt config missing" });
  }

const token = jwt.sign(
  { id: user.id, email: user.email },
  secret,
  { expiresIn: expiresIn as any }
);

  return res.status(201).json({ token });
}
