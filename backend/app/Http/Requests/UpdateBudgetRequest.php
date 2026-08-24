<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBudgetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => ['sometimes', 'required', 'string', 'max:255'],
            'amount'      => ['sometimes', 'required', 'integer', 'min:1'],
            'type'        => ['sometimes', 'required', 'in:income,expense'],
            'category_id' => ['sometimes', 'required', 'integer', 'exists:categories,id'],
            'date'     => ['sometimes', 'required', 'date'],
            'memo'     => ['nullable', 'string', 'max:1000'],
        ];
    }
}
