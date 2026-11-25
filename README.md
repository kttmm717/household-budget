# 家計簿アプリ

Next.js（App Router）+ Laravel API で構築した家計簿管理アプリです。

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | Next.js 16 (App Router) / TypeScript / Tailwind CSS v4 |
| バックエンド | Laravel 13 / PHP 8.3 |
| 認証 | Laravel Sanctum（APIトークン）+ httpOnly Cookie |
| アイコン | Material Design Icons (`@mdi/js` + `@mdi/react`) |

## 機能

- **ダッシュボード** — 月ごとの収入・支出・収支のサマリー、収支推移グラフ（直近6か月）、カテゴリ別支出グラフ、最近の家計簿一覧
- **家計簿一覧** — 月別フィルタリング、編集・削除
- **家計簿登録** — アイコン付きカテゴリ選択、クライアントサイドバリデーション
- **ログイン / 新規登録** — ユーザーごとに家計簿データを分離

## 認証の仕組み

```
ブラウザ ──(httpOnly Cookie)──▶ Next.js サーバー ──(Authorization: Bearer)──▶ Laravel API
```

- ログインすると Laravel（Sanctum）が API トークンを発行し、Next.js が **httpOnly Cookie** に保存します。
  ブラウザの JavaScript からはトークンを読めないため、XSS で盗まれません。
- API 呼び出しはすべて Next.js のサーバー側（Server Components / Server Actions）で行い、Cookie のトークンを `Authorization` ヘッダーに付けて送ります。
- `proxy.ts` が未ログインのアクセスをログイン画面へ振り分けます。トークンが失効していた場合は API の 401 を受けてログイン画面に戻します。
- 他人の家計簿へのアクセスは 404 を返します（存在自体を知られないようにするため 403 ではなく 404）。

## ディレクトリ構成

```
household-budget/
├── frontend/          # Next.js
│   └── app/
│       ├── (auth)/        # ログイン / 新規登録
│       ├── (dashboard)/   # サイドメニュー付きレイアウトグループ
│       │   ├── dashboard/ # ① ダッシュボード
│       │   └── budgets/   # ② 一覧 / ③ 登録
│       ├── _components/   # 共通コンポーネント
│       └── _lib/          # API クライアント・Server Actions・セッション・型定義
│   └── proxy.ts       # 未ログイン時のリダイレクト
└── backend/           # Laravel
    ├── app/Http/Controllers/
    ├── app/Models/
    ├── database/migrations/
    └── routes/api.php
```

## セットアップ

### バックエンド（Laravel）

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

`.env` のデータベース設定を編集後：

```bash
php artisan migrate
php artisan db:seed
php artisan serve
```

> デフォルトで `http://localhost:8000` で起動します。

### フロントエンド（Next.js）

```bash
cd frontend
npm install
```

`frontend/.env.local` を作成：

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

```bash
npm run dev
```

> `http://localhost:3000` でアクセスできます。

### デモアカウント

シーダーで以下のユーザーとサンプルデータが作成されます。

| メールアドレス | パスワード |
|---|---|
| `demo@example.com` | `password` |

### テスト

```bash
cd backend
php artisan test
```

## API エンドポイント

`/api/register` と `/api/login` 以外は `Authorization: Bearer <token>` が必要です。

| メソッド | パス | 説明 |
|---|---|---|
| POST | `/api/register` | 新規登録（トークンを返す） |
| POST | `/api/login` | ログイン（トークンを返す） |
| POST | `/api/logout` | ログアウト（トークンを失効） |
| GET | `/api/user` | ログイン中のユーザー情報 |
| GET | `/api/budgets` | 一覧取得（`?month=YYYY-MM` で月絞り込み） |
| POST | `/api/budgets` | 登録 |
| PUT | `/api/budgets/{id}` | 更新 |
| DELETE | `/api/budgets/{id}` | 削除 |
| GET | `/api/categories` | カテゴリ一覧取得 |
| GET | `/api/summary` | ダッシュボード集計（`?month=YYYY-MM`。月の合計・直近6か月の推移・カテゴリ別支出） |
