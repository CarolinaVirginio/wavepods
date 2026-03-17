import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";
import emailRoutes from "./routes/emailRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import { fail } from "./utils/httpResponses.js";

dotenv.config();

const { STRIPE_SECRET_KEY, STRIPE_PRICE_ID, FRONTEND_URL, PORT } = process.env;

const app = express();
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

const allowedOrigins = [
  FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:8080",
  "http://localhost:4173",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const isLocalhost =
        origin.startsWith("http://localhost") ||
        origin.startsWith("http://127.0.0.1");

      if (allowedOrigins.includes(origin) || isLocalhost) {
        return callback(null, true);
      }

      return callback(new Error("CORS bloqueado para esta origem."));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api", emailRoutes);
app.use("/api", newsletterRoutes);

app.post("/api/create-checkout-session", async (req, res) => {
  if (!stripe || !STRIPE_PRICE_ID) {
    return fail(res, 500, "Stripe não configurado.", {
      code: "STRIPE_NOT_CONFIGURED",
    });
  }

  try {
    const requestOrigin =
      req.headers.origin || FRONTEND_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        { price: STRIPE_PRICE_ID, quantity: req.body.quantity || 1 },
      ],
      success_url: `${requestOrigin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${requestOrigin}/canceled`,
    });

    return res.json({ ok: true, data: { url: session.url } });
  } catch (error) {
    return fail(res, 500, error.message, { code: "CHECKOUT_SESSION_ERROR" });
  }
});

app.get("/api/checkout-session", async (req, res) => {
  if (!stripe) {
    return fail(res, 500, "Stripe não configurado.", {
      code: "STRIPE_NOT_CONFIGURED",
    });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id,
    );

    return res.json({ ok: true, data: session });
  } catch {
    return fail(res, 404, "Sessão não encontrada.", {
      code: "CHECKOUT_SESSION_NOT_FOUND",
    });
  }
});

app.use((req, res) => {
  return fail(res, 404, "Rota não encontrada.", { code: "ROUTE_NOT_FOUND" });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  return fail(res, 500, "Erro interno do servidor.", {
    code: "INTERNAL_SERVER_ERROR",
  });
});

const port = PORT || 4242;
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}

export { app };
