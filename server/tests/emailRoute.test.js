import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../index.js";

describe("POST /api/validate-email", () => {
  it("Retorna 200 para e-mail válido", async () => {
    const response = await request(app)
      .post("/api/validate-email")
      .send({ email: "contato@wavepods.com.br" });

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.valid).toBe(true);
    expect(response.body.message).toBe("E-mail válido!");
  });

  it("Retorna 422 para e-mail inválido", async () => {
    const response = await request(app)
      .post("/api/validate-email")
      .send({ email: "E-mail-inválido" });

    expect(response.status).toBe(422);
    expect(response.body.ok).toBe(false);
    expect(response.body.valid).toBe(false);
    expect(response.body.code).toBe("INVALID_EMAIL");
  });

  it("Retorna 400 quando o e-mail não foi enviado", async () => {
    const response = await request(app).post("/api/validate-email").send({});

    expect(response.status).toBe(400);
    expect(response.body.ok).toBe(false);
    expect(response.body.code).toBe("EMAIL_REQUIRED");
  });
});
