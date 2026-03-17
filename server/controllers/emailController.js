import { validateEmail } from "../utils/validateEmail.js";
import { fail, ok } from "../utils/httpResponses.js";

export const validateEmailController = (req, res) => {
  const email = req.body?.email;

  if (!email) {
    return fail(res, 400, "E-mail é obrigatório.", {
      code: "EMAIL_REQUIRED",
      valid: false,
    });
  }

  if (!validateEmail(email)) {
    return fail(res, 422, "E-mail inválido.", {
      code: "INVALID_EMAIL",
      valid: false,
    });
  }

  return ok(res, { valid: true, message: "E-mail válido!" });
};
