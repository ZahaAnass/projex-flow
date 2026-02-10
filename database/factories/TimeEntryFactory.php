<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TimeEntry>
 */
class TimeEntryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'description' => fake()->sentence(),
            'duration_minutes' => fake()->numberBetween(15, 240), // 15 mins to 4 hours
            'date' => fake()->date(),
            'task_id' => Task::factory(),
            'user_id' => User::factory(),
        ];
    }
}
