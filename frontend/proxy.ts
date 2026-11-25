// frontend/proxy.ts
// 未ログイン（トークン Cookie なし）のアクセスをログイン画面へ振り分ける
// ここでは Cookie の有無だけを見る「楽観的チェック」。
// トークンが本当に有効かは API が判定し、401 なら api.ts がログイン画面へ戻す

import { NextResponse, type NextRequest } from "next/server";

const TOKEN_COOKIE = "token";
const PUBLIC_PATHS = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const hasToken = request.cookies.has(TOKEN_COOKIE);

  if (!isPublic && !hasToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // 静的ファイル・画像最適化・favicon には適用しない
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico)$).*)"],
};
