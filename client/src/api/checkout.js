import { API_URL } from "../../config";

async function createCheckoutSession(quantity = 1) {
  try {
    const res = await fetch(`${API_URL}/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });

    if (!res.ok) {
      throw new Error(`Erro ao criar sessão (${res.status})`);
    }

    const payload = await res.json();
    const url = payload.data?.url;

    if (!url) {
      throw new Error("URL de sessão não recebida.");
    }

    window.location.href = url;
    return { success: true };
  } catch (err) {
    console.error("Falha ao iniciar checkout:", err);
    return { success: false, error: err.message };
  }
}

export default createCheckoutSession;
