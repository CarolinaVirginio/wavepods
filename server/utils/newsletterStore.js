import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, "../data");
const subscribersFile = path.join(dataDir, "newsletter-subscribers.json");

async function ensureStore() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(subscribersFile, "utf-8");
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(subscribersFile, "[]", "utf-8");
      return;
    }

    throw error;
  }
}

async function readSubscribers() {
  await ensureStore();
  const rawData = await readFile(subscribersFile, "utf-8");
  return JSON.parse(rawData);
}

async function writeSubscribers(subscribers) {
  await ensureStore();
  await writeFile(
    subscribersFile,
    JSON.stringify(subscribers, null, 2),
    "utf-8",
  );
}

export async function saveSubscriber(email) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const subscribers = await readSubscribers();
  const existingSubscriber = subscribers.find(
    (subscriber) => subscriber.email === normalizedEmail,
  );

  if (existingSubscriber) {
    return { subscriber: existingSubscriber, created: false };
  }

  const subscriber = {
    email: normalizedEmail,
    subscribedAt: new Date().toISOString(),
  };

  subscribers.push(subscriber);
  await writeSubscribers(subscribers);

  return { subscriber, created: true };
}
