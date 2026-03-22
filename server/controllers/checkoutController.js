import Stripe from "stripe";
import { fail } from "../utils/httpResponses.js";

const { STRIPE_SECRET_KEY, STRIPE_PRICE_ID, FRONTEND_URL } = process.env;
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

export const createCheckoutSessionController = async (req, res) => {
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
};

export const getCheckoutSessionController = async (req, res) => {
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
};
