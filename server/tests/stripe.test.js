import { describe, it, expect, vi } from "vitest";
import request from "supertest";

process.env.STRIPE_SECRET_KEY = "sk_test_fake";
process.env.STRIPE_PRICE_ID = "price_fake";

vi.mock("stripe", () => {
  const StripeMock = function () {
    return {
      checkout: {
        sessions: {
          create: vi
            .fn()
            .mockResolvedValue({ url: "http://stripe-mock-url.com" }),
        },
      },
    };
  };

  return {
    default: StripeMock,
    Stripe: StripeMock,
  };
});

describe("POST /api/create-checkout-session", () => {
  it("Retorna a URL do checkout", async () => {
    vi.resetModules();
    const { app } = await import("../index.js");
    const response = await request(app)
      .post("/api/create-checkout-session")
      .send({ quantity: 1 });

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(response.body.data.url).toBe("http://stripe-mock-url.com");
  });
});
