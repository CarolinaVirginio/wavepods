import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

const saveSubscriberMock = vi.fn();

vi.mock("../utils/newsletterStore.js", () => ({
  saveSubscriber: saveSubscriberMock,
}));

describe("POST /api/newsletter-subscriptions", () => {
  beforeEach(() => {
    saveSubscriberMock.mockReset();
    vi.resetModules();
  });

  it("Retorna 201 quando cria uma nova inscrição", async () => {
    saveSubscriberMock.mockResolvedValue({
      created: true,
      subscriber: {
        email: "contato@wavepods.com.br",
        subscribedAt: "2026-03-17T00:00:00.000Z",
      },
    });

    //O import dinâmico foi usado para garantir que o newsletterStore já estivesse mockado antes de o index.js carregar o controller que depende dele
    const { app } = await import("../index.js");
    const response = await request(app)
      .post("/api/newsletter-subscriptions")
      .send({ email: "contato@wavepods.com.br" });

    expect(response.status).toBe(201);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Inscrição realizada com sucesso.");
    expect(response.body.data.email).toBe("contato@wavepods.com.br");
  });

  it("Retorna 200 quando o e-mail já existe", async () => {
    saveSubscriberMock.mockResolvedValue({
      created: false,
      subscriber: {
        email: "contato@wavepods.com.br",
        subscribedAt: "2026-03-17T00:00:00.000Z",
      },
    });

    const { app } = await import("../index.js");
    const response = await request(app)
      .post("/api/newsletter-subscriptions")
      .send({ email: "contato@wavepods.com.br" });

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.message).toBe("Esse e-mail já está cadastrado");
  });

  it("Retorna 422 para e-mail inválido", async () => {
    const { app } = await import("../index.js");
    const response = await request(app)
      .post("/api/newsletter-subscriptions")
      .send({ email: "inválido" });

    expect(response.status).toBe(422);
    expect(response.body.ok).toBe(false);
    expect(response.body.code).toBe("INVALID_EMAIL");
  });
});
