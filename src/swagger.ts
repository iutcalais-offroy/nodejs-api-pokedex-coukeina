import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pokemon API",
      version: "1.0.0",
      description: "API Node.js + Express + Prisma (SQLite)",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./src/**/*.ts"],
});
