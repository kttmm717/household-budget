<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBudgetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:255'],
            'amount'      => ['required', 'integer', 'min:1'],
            'type'        => ['required', 'in:income,expense'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'date'     => ['required', 'date'],
            'memo'     => ['nullable', 'string', 'max:1000'],
        ];
    }
}
