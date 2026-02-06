import request from "supertest";
import { app } from "../src/index";
import prisma from "../src/client";

describe("Users", () => {
  it("should create a user", async () => {
    (prisma.user.findUnique as any).mockResolvedValueOnce(null);
    (prisma.user.create as any).mockResolvedValueOnce({
      id: 1,
      email: "test@test.com",
    });

    const res = await request(app).post("/users").send({
      email: "test@test.com",
      password: "test",
    });

    expect(res.status).toBe(201);
  });

  it("should login user", async () => {
    (prisma.user.findUnique as any).mockResolvedValueOnce({
      id: 1,
      email: "login@test.com",
      password: "truePassword",
    });

    const res = await request(app).post("/users/login").send({
      email: "login@test.com",
      password: "truePassword",
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });
});
