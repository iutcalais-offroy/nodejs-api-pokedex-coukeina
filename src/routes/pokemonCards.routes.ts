import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import {
  createPokemonCard,
  deletePokemonCard,
  getAllPokemonCards,
  getPokemonCardById,
  updatePokemonCard,
} from "../controllers/pokemonCards.controller";

const router = Router();

router.get("/pokemons-cards", getAllPokemonCards);
router.get("/pokemons-cards/:pokemonCardId", getPokemonCardById);
router.post("/pokemon-cards", auth, createPokemonCard);
router.patch("/pokemon-cards/:pokemonCardId", auth, updatePokemonCard);
router.delete("/pokemon-cards/:pokemonCardId", auth, deletePokemonCard);

export default router;
