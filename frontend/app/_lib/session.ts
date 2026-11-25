// frontend/app/_lib/session.ts
// ログイントークンを httpOnly Cookie で管理する（サーバー専用）
// ブラウザの JavaScript からトークンを読めないようにすることで、XSS による盗難を防ぐ

import "server-only";
import { cookies } from "next/headers";

export const TOKEN_COOKIE = "token";

// Laravel 側のトークン有効期限（7日）と揃える
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export async function getToken(): Promise<string | undefined> {
  return (await cookies()).get(TOKEN_COOKIE)?.value;
}

export async function setToken(token: string): Promise<void> {
  (await cookies()).set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function deleteToken(): Promise<void> {
  (await cookies()).delete(TOKEN_COOKIE);
}
