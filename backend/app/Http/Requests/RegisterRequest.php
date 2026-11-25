<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'confirmed', Password::min(8)],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'      => '名前を入力してください。',
            'name.max'           => '名前は255文字以内で入力してください。',
            'email.required'     => 'メールアドレスを入力してください。',
            'email.email'        => 'メールアドレスの形式が正しくありません。',
            'email.max'          => 'メールアドレスは255文字以内で入力してください。',
            'email.unique'       => 'このメールアドレスは既に登録されています。',
            'password.required'  => 'パスワードを入力してください。',
            'password.confirmed' => 'パスワード（確認）が一致しません。',
            'password.min'       => 'パスワードは8文字以上で入力してください。',
        ];
    }
}
