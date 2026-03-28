import { API_URL } from "../../config";

async function parsePayload(response) {
  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    throw new Error(
      payload.message || "Não foi possível concluir a autenticação agora. Tente novamente.",
    );
  }

  return payload;
}

export async function registerUser(data) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return parsePayload(response);
}

export async function loginUser(data) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return parsePayload(response);
}

export async function getCurrentUser() {
  const response = await fetch(`${API_URL}/auth/me`, {
    credentials: "include",
  });

  return parsePayload(response);
}

export async function logoutUser() {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  return parsePayload(response);
}
