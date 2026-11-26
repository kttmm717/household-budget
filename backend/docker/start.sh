#!/bin/sh
# コンテナ起動時の処理（Render はポート番号を環境変数 PORT で渡してくる）
set -e

PORT="${PORT:-80}"
sed -i "s/^Listen .*/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:[0-9]*>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

# 本番用に設定とルートをキャッシュ
php artisan config:cache
php artisan route:cache

# DB を最新の状態にし、カテゴリとデモユーザーを用意する（どちらも何度実行しても安全）
php artisan migrate --force
php artisan db:seed --force

exec apache2-foreground
