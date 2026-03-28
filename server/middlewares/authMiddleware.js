import jwt from "jsonwebtoken";
import { fail } from "../utils/httpResponses.js";

export const requireAuth = (req, res, next) => {
  const token = req.cookies?.wavepods_auth;
  const jwtSecret = process.env.JWT_SECRET;

  if (!token) {
    return fail(res, 401, "Autenticação necessária.", {
      code: "AUTH_REQUIRED",
    });
  }

  if (!jwtSecret) {
    return fail(res, 500, "Não foi possível validar a autenticação.", {
      code: "JWT_NOT_CONFIGURED",
    });
  }

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return fail(res, 401, "Sessão inválida ou expirada.", {
      code: "INVALID_SESSION",
    });
  }
};
