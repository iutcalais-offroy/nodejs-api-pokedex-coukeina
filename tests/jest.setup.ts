import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import prisma from "../src/client";
import { stopServer } from "../src/index";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

jest.mock("../src/client", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  verify: jest.fn((token: string) => {
    if (token === "mockedToken") return { userId: "mockedUserId" };
    throw new Error("Invalid token");
  }),
  sign: jest.fn(() => "mockedToken"),
}));

jest.mock("bcrypt", () => ({
  ...jest.requireActual("bcrypt"),
  compare: jest.fn((password: string) => password === "truePassword"),
}));

beforeEach(() => {
  mockReset(prismaMock);
  jest.clearAllMocks();
});

afterAll(() => {
  stopServer();
});
