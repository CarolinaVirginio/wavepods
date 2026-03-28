import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { fail, ok } from "../utils/httpResponses.js";
import {
  findUserByEmail,
  findUserById,
  createUser,
} from "../utils/userStore.js";
import { validateEmail } from "../utils/validateEmail.js";

const AUTH_COOKIE_NAME = "wavepods_auth";
function getAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function getJwtSecret() {
  return process.env.JWT_SECRET;
}

function ensureJwtConfigured(res) {
  const jwtSecret = getJwtSecret();

  if (!jwtSecret) {
    fail(res, 500, "Não foi possível concluir a autenticação.", {
      code: "JWT_NOT_CONFIGURED",
    });
    return null;
  }

  return jwtSecret;
}

function createAuthToken(user, jwtSecret) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
    },
    jwtSecret,
    { expiresIn: "7d" },
  );
}

export const registerUser = async (req, res, next) => {
  try {
    const jwtSecret = ensureJwtConfigured(res);
    if (!jwtSecret) {
      return;
    }

    const name = req.body?.name?.trim();
    const email = req.body?.email?.trim();
    const password = req.body?.password;

    if (!name) {
      return fail(res, 400, "Nome é obrigatório.", {
        code: "NAME_REQUIRED",
      });
    }

    if (!email) {
      return fail(res, 400, "E-mail é obrigatório.", {
        code: "EMAIL_REQUIRED",
      });
    }

    if (!validateEmail(email)) {
      return fail(res, 422, "E-mail inválido.", {
        code: "INVALID_EMAIL",
      });
    }

    if (!password) {
      return fail(res, 400, "Senha é obrigatória.", {
        code: "PASSWORD_REQUIRED",
      });
    }

    if (password.length < 6) {
      return fail(res, 422, "Sua senha precisa ter pelo menos 6 caracteres.", {
        code: "PASSWORD_TOO_SHORT",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const { user, created } = await createUser({ name, email, passwordHash });

    if (!created) {
      return fail(res, 409, "Esse e-mail já está cadastrado.", {
        code: "EMAIL_ALREADY_REGISTERED",
      });
    }

    const token = createAuthToken(user, jwtSecret);
    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

    return ok(
      res,
      {
        message: "Conta criada com sucesso!",
        data: sanitizeUser(user),
      },
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const jwtSecret = ensureJwtConfigured(res);
    if (!jwtSecret) {
      return;
    }

    const email = req.body?.email?.trim();
    const password = req.body?.password;

    if (!email) {
      return fail(res, 400, "E-mail é obrigatório.", {
        code: "EMAIL_REQUIRED",
      });
    }

    if (!password) {
      return fail(res, 400, "Senha é obrigatória.", {
        code: "PASSWORD_REQUIRED",
      });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return fail(res, 401, "E-mail ou senha incorretos.", {
        code: "INVALID_CREDENTIALS",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return fail(res, 401, "E-mail ou senha incorretos.", {
        code: "INVALID_CREDENTIALS",
      });
    }

    const token = createAuthToken(user, jwtSecret);
    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

    return ok(res, {
      message: "Login realizado com sucesso.",
      data: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = (req, res) => {
  const { httpOnly, sameSite, secure } = getAuthCookieOptions();
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly,
    sameSite,
    secure,
  });

  return ok(res, { message: "Logout realizado com sucesso." });
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user?.sub;
    const user = await findUserById(userId);

    if (!user) {
      return fail(res, 404, "Usuário não encontrado.", {
        code: "USER_NOT_FOUND",
      });
    }

    return ok(res, {
      data: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};
