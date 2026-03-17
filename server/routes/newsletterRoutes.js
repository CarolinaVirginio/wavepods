import express from "express";
import { createNewsletterSubscription } from "../controllers/newsletterController.js";

const router = express.Router();

router.post("/newsletter-subscriptions", createNewsletterSubscription);

export default router;
