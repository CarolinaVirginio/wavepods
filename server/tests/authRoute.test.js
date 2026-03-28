import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";

const createUserMock = vi.fn();
const findUserByEmailMock = vi.fn();
const findUserByIdMock = vi.fn();

vi.mock("../utils/userStore.js", () => ({
  createUser: createUserMock,
  findUserByEmail: findUserByEmailMock,
  findUserById: findUserByIdMock,
}));

describe("Rotas de autenticação", () => {
  beforeEach(() => {
    createUserMock.mockReset();
    findUserByEmailMock.mockReset();
    findUserByIdMock.mockReset();
    vi.resetModules();
    process.env.JWT_SECRET = "jwt_test_secret";
  });

  it("Retorna 201 ao cadastrar um novo usuário", async () => {
    createUserMock.mockResolvedValue({
      created: true,
      user: {
        id: "user_1",
        name: "Carol",
        email: "carol@wavepods.com",
        passwordHash: "hash",
        createdAt: "2026-03-26T00:00:00.000Z",
      },
    });

    const { app } = await import("../index.js");
    const response = await request(app).post("/api/auth/register").send({
      name: "Carol",
      email: "carol@wavepods.com",
      password: "123456",
    });

    expect(response.status).toBe(201);
    expect(response.body.ok).toBe(true);
    expect(response.body.data.email).toBe("carol@wavepods.com");
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  it("Retorna 409 quando o e-mail já está cadastrado", async () => {
    createUserMock.mockResolvedValue({
      created: false,
      user: {
        id: "user_1",
        name: "Carol",
        email: "carol@wavepods.com",
        passwordHash: "hash",
        createdAt: "2026-03-26T00:00:00.000Z",
      },
    });

    const { app } = await import("../index.js");
    const response = await request(app).post("/api/auth/register").send({
      name: "Carol",
      email: "carol@wavepods.com",
      password: "123456",
    });

    expect(response.status).toBe(409);
    expect(response.body.ok).toBe(false);
    expect(response.body.code).toBe("EMAIL_ALREADY_REGISTERED");
  });

  it("Retorna os dados do usuário autenticado em /auth/me", async () => {
    const passwordHash = await bcrypt.hash("123456", 10);

    findUserByEmailMock.mockResolvedValue({
      id: "user_1",
      name: "Carol",
      email: "carol@wavepods.com",
      passwordHash,
      createdAt: "2026-03-26T00:00:00.000Z",
    });

    findUserByIdMock.mockResolvedValue({
      id: "user_1",
      name: "Carol",
      email: "carol@wavepods.com",
      passwordHash,
      createdAt: "2026-03-26T00:00:00.000Z",
    });

    const { app } = await import("../index.js");
    const agent = request.agent(app);

    const loginResponse = await agent.post("/api/auth/login").send({
      email: "carol@wavepods.com",
      password: "123456",
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.ok).toBe(true);

    const meResponse = await agent.get("/api/auth/me");

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.ok).toBe(true);
    expect(meResponse.body.data.name).toBe("Carol");
  });

  it("Limpa o cookie no logout", async () => {
    const { app } = await import("../index.js");
    const response = await request(app).post("/api/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.headers["set-cookie"]).toBeDefined();
  });
});
