import { Request, Response } from "express";
import prisma from "../client";

function isEmpty(v: unknown) {
  return v === undefined || v === null || v === "";
}

export async function getAllPokemonCards(_req: Request, res: Response) {
  const cards = await prisma.pokemonCard.findMany({ include: { type: true } });
  return res.status(200).json(cards);
}

export async function getPokemonCardById(req: Request, res: Response) {
  const pokemonCardId = Number(req.params.pokemonCardId);

  const card = await prisma.pokemonCard.findUnique({
    where: { id: pokemonCardId },
    include: { type: true },
  });

  if (!card) {
    return res.status(404).json({ message: "pokemonCardId does not exist" });
  }

  return res.status(200).json(card);
}

export async function createPokemonCard(req: Request, res: Response) {
  const { name, pokedexId, type, lifePoints, size, weight, imageUrl } = req.body;

  if (isEmpty(name)) return res.status(400).json({ message: "name is required" });
  if (isEmpty(pokedexId)) return res.status(400).json({ message: "pokedexId is required" });
  if (isEmpty(type)) return res.status(400).json({ message: "type is required" });
  if (isEmpty(lifePoints)) return res.status(400).json({ message: "lifePoints is required" });

  const typeExists = await prisma.type.findUnique({ where: { id: Number(type) } });
  if (!typeExists) {
    return res.status(400).json({ message: "type id does not exist" });
  }

  const duplicate = await prisma.pokemonCard.findFirst({
    where: {
      OR: [{ name: String(name) }, { pokedexId: Number(pokedexId) }],
    },
  });

  if (duplicate) {
    return res.status(400).json({ message: "duplicate name or pokedexId" });
  }

  const created = await prisma.pokemonCard.create({
    data: {
      name: String(name),
      pokedexId: Number(pokedexId),
      typeId: Number(type),
      lifePoints: Number(lifePoints),
      size: size === undefined ? null : Number(size),
      weight: weight === undefined ? null : Number(weight),
      imageUrl: imageUrl === undefined ? null : String(imageUrl),
    },
    include: { type: true },
  });

  return res.status(201).json(created);
}

export async function updatePokemonCard(req: Request, res: Response) {
  const pokemonCardId = Number(req.params.pokemonCardId);
  const { name, pokedexId, type, lifePoints, size, weight, imageUrl } = req.body;

  const existing = await prisma.pokemonCard.findUnique({
    where: { id: pokemonCardId },
  });

  if (!existing) {
    return res.status(404).json({ message: "pokemonCardId does not exist" });
  }

  if (isEmpty(name)) return res.status(400).json({ message: "name is required" });
  if (isEmpty(pokedexId)) return res.status(400).json({ message: "pokedexId is required" });
  if (isEmpty(type)) return res.status(400).json({ message: "type is required" });
  if (isEmpty(lifePoints)) return res.status(400).json({ message: "lifePoints is required" });

  const typeExists = await prisma.type.findUnique({ where: { id: Number(type) } });
  if (!typeExists) {
    return res.status(400).json({ message: "type id does not exist" });
  }

  const duplicate = await prisma.pokemonCard.findFirst({
    where: {
      id: { not: pokemonCardId },
      OR: [{ name: String(name) }, { pokedexId: Number(pokedexId) }],
    },
  });

  if (duplicate) {
    return res.status(400).json({ message: "duplicate name or pokedexId" });
  }

  const updated = await prisma.pokemonCard.update({
    where: { id: pokemonCardId },
    data: {
      name: String(name),
      pokedexId: Number(pokedexId),
      typeId: Number(type),
      lifePoints: Number(lifePoints),
      size: size === undefined ? null : Number(size),
      weight: weight === undefined ? null : Number(weight),
      imageUrl: imageUrl === undefined ? null : String(imageUrl),
    },
    include: { type: true },
  });

  return res.status(200).json(updated);
}

export async function deletePokemonCard(req: Request, res: Response) {
  const pokemonCardId = Number(req.params.pokemonCardId);

  const existing = await prisma.pokemonCard.findUnique({
    where: { id: pokemonCardId },
  });

  if (!existing) {
    return res.status(404).json({ message: "pokemonCardId does not exist" });
  }

  await prisma.pokemonCard.delete({ where: { id: pokemonCardId } });
  return res.status(200).json({ message: "deleted" });
}
