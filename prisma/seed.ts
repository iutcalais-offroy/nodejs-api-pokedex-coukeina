import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.pokemonCard.deleteMany();
  await prisma.type.deleteMany();

  await prisma.type.createMany({
    data: [
      { name: "Normal" },
      { name: "Fire" },
      { name: "Water" },
      { name: "Grass" },
      { name: "Electric" },
      { name: "Ice" },
      { name: "Fighting" },
      { name: "Poison" },
      { name: "Ground" },
      { name: "Flying" },
      { name: "Psychic" },
      { name: "Bug" },
      { name: "Rock" },
      { name: "Ghost" },
      { name: "Dragon" },
      { name: "Dark" },
      { name: "Steel" },
      { name: "Fairy" },
    ],
  });

  const grass = await prisma.type.findUnique({ where: { name: "Grass" } });
  const fire = await prisma.type.findUnique({ where: { name: "Fire" } });
  const water = await prisma.type.findUnique({ where: { name: "Water" } });

  if (!grass || !fire || !water) {
    throw new Error("Types not found");
  }

  // PokemonCards
  await prisma.pokemonCard.createMany({
    data: [
      {
        name: "Bulbizarre",
        pokedexId: 1,
        typeId: grass.id,
        lifePoints: 45,
        size: 0.7,
        weight: 6.9,
        imageUrl:
          "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
      },
      {
        name: "Salamèche",
        pokedexId: 4,
        typeId: fire.id,
        lifePoints: 39,
        size: 0.6,
        weight: 8.5,
        imageUrl:
          "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png",
      },
      {
        name: "Carapuce",
        pokedexId: 7,
        typeId: water.id,
        lifePoints: 44,
        size: 0.5,
        weight: 9.0,
        imageUrl:
          "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png",
      },
    ],
  });

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
