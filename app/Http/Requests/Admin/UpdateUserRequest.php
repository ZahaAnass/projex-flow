<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', \Illuminate\Validation\Rule::unique('users')->ignore($this->user->id)],
            'role' => 'required|string|exists:roles,name',
            'phone' => 'nullable|string|max:20',
            'status' => 'required|in:active,inactive,banned',
        ];
    }
}
