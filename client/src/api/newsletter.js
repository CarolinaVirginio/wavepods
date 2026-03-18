import { API_URL } from "../../config";

export async function createNewsletterSubscription(email) {
  const response = await fetch(`${API_URL}/newsletter-subscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    throw new Error(
      payload.message || "Não foi possível salvar seu e-mail. Tente novamente.",
    );
  }

  return payload;
}
