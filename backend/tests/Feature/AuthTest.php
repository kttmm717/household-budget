<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_ユーザー登録するとトークンが返る(): void
    {
        $response = $this->postJson('/api/register', [
            'name'                  => '山田太郎',
            'email'                 => 'taro@example.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['data' => ['token', 'user' => ['id', 'name', 'email']]])
            ->assertJsonPath('data.user.email', 'taro@example.com');

        $this->assertDatabaseHas('users', ['email' => 'taro@example.com']);
    }

    public function test_登録済みのメールアドレスでは登録できない(): void
    {
        User::factory()->create(['email' => 'taro@example.com']);

        $this->postJson('/api/register', [
            'name'                  => '山田太郎',
            'email'                 => 'taro@example.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ])->assertUnprocessable()->assertJsonValidationErrors('email');
    }

    public function test_パスワード確認が一致しないと登録できない(): void
    {
        $this->postJson('/api/register', [
            'name'                  => '山田太郎',
            'email'                 => 'taro@example.com',
            'password'              => 'password123',
            'password_confirmation' => 'different123',
        ])->assertUnprocessable()->assertJsonValidationErrors('password');
    }

    public function test_正しい認証情報でログインできる(): void
    {
        User::factory()->create(['email' => 'taro@example.com', 'password' => 'password123']);

        $this->postJson('/api/login', [
            'email'    => 'taro@example.com',
            'password' => 'password123',
        ])->assertOk()->assertJsonStructure(['data' => ['token', 'user']]);
    }

    public function test_パスワードが違うとログインできない(): void
    {
        User::factory()->create(['email' => 'taro@example.com', 'password' => 'password123']);

        $this->postJson('/api/login', [
            'email'    => 'taro@example.com',
            'password' => 'wrong-password',
        ])->assertUnprocessable()->assertJsonValidationErrors('email');
    }

    public function test_トークンでログインユーザー情報を取得できる(): void
    {
        $user  = User::factory()->create();
        $token = $user->createToken('web')->plainTextToken;

        $this->withToken($token)->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('data.id', $user->id);
    }

    public function test_ログアウトするとトークンが失効する(): void
    {
        $user  = User::factory()->create();
        $token = $user->createToken('web')->plainTextToken;

        $this->withToken($token)->postJson('/api/logout')->assertNoContent();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_未ログインでは保護されたAPIにアクセスできない(): void
    {
        $this->getJson('/api/user')->assertUnauthorized();
        $this->getJson('/api/budgets')->assertUnauthorized();
        $this->getJson('/api/categories')->assertUnauthorized();
    }

    public function test_Acceptヘッダーなしでも未ログインは401のJSONを返す(): void
    {
        $this->get('/api/budgets')->assertUnauthorized()->assertJson(['message' => 'Unauthenticated.']);
    }
}
