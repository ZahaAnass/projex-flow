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
        $startDate = fake()->dateTimeBetween('-3 months', 'now');
        return [
            'uuid' => fake()->uuid(),
            'name' => fake()->catchPhrase(), // e.g., "Synergistic Timeline Solution"
            'description' => fake()->paragraph(),
            'status' => fake()->randomElement(['pending', 'active', 'on_hold', 'completed']),
            'start_date' => $startDate,
            'end_date' => fake()->dateTimeBetween($startDate, '+6 months'),
            // We will assign owner_id in the Seeder
            'owner_id' => User::factory(),
        ];
    }
}
