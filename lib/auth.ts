import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.ADMIN_SECRET ?? "aftab-malik-dev-secret";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const COOKIE_NAME = "admin_token";

export function verifyAdminPassword(password: string): boolean {
  return password === PASSWORD;
}

export function createAdminToken(): string {
  const payload = `admin:${Date.now()}`;
  const sig = createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64");
}

export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const dot = decoded.lastIndexOf(".");
    if (dot === -1) return false;
    const payload = decoded.slice(0, dot);
    const sig = decoded.slice(dot + 1);
    const expected = createHmac("sha256", SECRET).update(payload).digest("hex");
    if (sig.length !== expected.length) return false;
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return Boolean(token && verifyAdminToken(token));
}

export { COOKIE_NAME };
