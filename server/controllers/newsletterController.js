import { saveSubscriber } from "../utils/newsletterStore.js";
import { validateEmail } from "../utils/validateEmail.js";
import { fail, ok } from "../utils/httpResponses.js";

export const createNewsletterSubscription = async (req, res, next) => {
  try {
    const email = req.body?.email;

    if (!email) {
      return fail(res, 400, "E-mail é obrigatório.", {
        code: "EMAIL_REQUIRED",
      });
    }

    if (!validateEmail(email)) {
      return fail(res, 422, "E-mail inválido.", { code: "INVALID_EMAIL" });
    }

    const { subscriber, created } = await saveSubscriber(email);

    return ok(
      res,
      {
        message: created
          ? "Inscrição realizada com sucesso."
          : "Esse e-mail já está cadastrado",
        data: subscriber,
      },
      created ? 201 : 200,
    );
  } catch (error) {
    next(error);
  }
};
