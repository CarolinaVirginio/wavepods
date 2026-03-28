import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import emailRoutes from "./routes/emailRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { fail } from "./utils/httpResponses.js";

dotenv.config();

const { FRONTEND_URL, PORT } = process.env;

const app = express();

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
app.use(cookieParser());
app.use("/api", emailRoutes);
app.use("/api", newsletterRoutes);
app.use("/api", checkoutRoutes);
app.use("/api", authRoutes);

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
