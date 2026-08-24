<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BudgetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'amount'      => $this->amount,
            'type'        => $this->type,
            'category_id' => $this->category_id,
            'category'    => $this->category->name,
            'date'        => $this->date->format('Y-m-d'),
            'memo'        => $this->memo,
            'created_at'  => $this->created_at->toIso8601String(),
            'updated_at'  => $this->updated_at->toIso8601String(),
        ];
    }
}
