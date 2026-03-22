import express from "express";
import {
  createCheckoutSessionController,
  getCheckoutSessionController,
} from "../controllers/checkoutController.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSessionController);
router.get("/checkout-session", getCheckoutSessionController);

export default router;
