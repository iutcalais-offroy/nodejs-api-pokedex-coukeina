import express from "express";
import pokemonCardsRoutes from "./routes/pokemonCards.routes";
import usersRoutes from "./routes/users.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

export const app = express();

app.use(express.json());

app.use(pokemonCardsRoutes);
app.use(usersRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT || 3000;

export const server =
  process.env.NODE_ENV === "test" ? undefined : app.listen(port);

  export function stopServer() {
  if (server) {
    server.close();
  }
}
