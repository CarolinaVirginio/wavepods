import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../data");
const usersFile = path.join(dataDir, "users.json");

async function ensureStore() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(usersFile, "utf-8");
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(usersFile, "[]", "utf-8");
      return;
    }

    throw error;
  }
}

async function readUsers() {
  await ensureStore();
  const rawData = await readFile(usersFile, "utf-8");
  return JSON.parse(rawData);
}

async function writeUsers(users) {
  await ensureStore();
  await writeFile(usersFile, JSON.stringify(users, null, 2), "utf-8");
}

export async function findUserByEmail(email) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const users = await readUsers();

  return users.find((user) => user.email === normalizedEmail) || null;
}

export async function findUserById(userId) {
  const users = await readUsers();
  return users.find((user) => user.id === userId) || null;
}

export async function createUser({ name, email, passwordHash }) {
  const normalizedName = String(name).trim();
  const normalizedEmail = String(email).trim().toLowerCase();
  const users = await readUsers();

  const existingUser = users.find((user) => user.email === normalizedEmail);
  if (existingUser) {
    return { user: existingUser, created: false };
  }

  const user = {
    id: crypto.randomUUID(),
    name: normalizedName,
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);

  return { user, created: true };
}
