# 家計簿アプリ

Next.js（App Router）+ Laravel API で構築した家計簿管理アプリです。

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | Next.js 16 (App Router) / TypeScript / Tailwind CSS v4 |
| バックエンド | Laravel 13 / PHP 8.3 |
| アイコン | Material Design Icons (`@mdi/js` + `@mdi/react`) |

## 機能

- **ダッシュボード** — 収入・支出・残高のサマリー、最近の家計簿一覧
- **家計簿一覧** — 月別フィルタリング、編集・削除
- **家計簿登録** — アイコン付きカテゴリ選択、クライアントサイドバリデーション

## ディレクトリ構成

```
household-budget/
├── frontend/          # Next.js
│   └── app/
│       ├── (dashboard)/   # サイドメニュー付きレイアウトグループ
│       │   ├── dashboard/ # ① ダッシュボード
│       │   └── budgets/   # ② 一覧 / ③ 登録
│       ├── _components/   # 共通コンポーネント
│       └── _lib/          # API クライアント・型定義
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
php artisan db:seed --class=CategorySeeder
php artisan db:seed --class=BudgetSeeder
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

## API エンドポイント

| メソッド | パス | 説明 |
|---|---|---|
| GET | `/api/budgets` | 一覧取得（`?month=YYYY-MM` で月絞り込み） |
| POST | `/api/budgets` | 登録 |
| PUT | `/api/budgets/{id}` | 更新 |
| DELETE | `/api/budgets/{id}` | 削除 |
| GET | `/api/categories` | カテゴリ一覧取得 |
