import request from "supertest";
import { app } from "../src/index";

describe("PokemonCards", () => {
  it("should return 200 and list pokemon cards", async () => {
    const res = await request(app).get("/pokemons-cards");
    expect(res.status).toBe(200);
  });

  it("should return 404 for missing pokemon card", async () => {
    const res = await request(app).get("/pokemons-cards/999999");
    expect(res.status).toBe(404);
  });

  it("should return 401 when creating pokemon card without token", async () => {
    const res = await request(app).post("/pokemon-cards").send({
      name: "NoTokenMon",
      pokedexId: 999001,
      type: 1,
      lifePoints: 10,
    });

    expect(res.status).toBe(401);
  });
});
