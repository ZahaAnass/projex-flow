<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->bs() . ' Project',
            'description' => fake()->paragraph(),
            'status' => fake()->randomElement(['active', 'pending', 'completed']),
            'due_date' => fake()->dateTimeBetween('now', '+6 months'),
            'created_by' => User::factory(),
        ];
    }
}
