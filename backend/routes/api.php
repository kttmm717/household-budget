<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SummaryController;
use Illuminate\Support\Facades\Route;

// 認証不要（試行回数の制限は AppServiceProvider の "auth" を参照）
Route::middleware('throttle:auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

// 要ログイン（Authorization: Bearer <token>）
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'me']);

    Route::apiResource('budgets', BudgetController::class);
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('summary', [SummaryController::class, 'show']);
});
