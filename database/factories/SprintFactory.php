<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class SprintFactory extends Factory
{
    public function definition(): array
    {
        // 1. Generate a random start date
        $start = fake()->dateTimeBetween('-1 month', '+1 month');

        // 2. CLONE the start date and add 14-28 days to it for the end date.
        // We use 'clone' so we don't modify the original $start object.
        $end = (clone $start)->modify('+' . fake()->numberBetween(14, 28) . ' days');

        return [
            'name' => 'Sprint ' . fake()->numberBetween(1, 10),
            'goal' => fake()->sentence(),
            'start_date' => $start,
            'end_date' => $end, // Now guaranteed to be after start_date
            'status' => fake()->randomElement(['planned', 'active', 'completed']),
            'project_id' => Project::factory(),
        ];
    }
}
