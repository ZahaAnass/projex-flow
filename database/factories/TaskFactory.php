<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'uuid' => fake()->uuid(),
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'type' => fake()->randomElement(['task', 'bug', 'story']),
            'priority' => fake()->randomElement(['low', 'medium', 'high', 'urgent']),
            'status' => fake()->randomElement(['todo', 'in_progress', 'review', 'done']),
            'order' => fake()->numberBetween(0, 10),
            'due_date' => fake()->dateTimeBetween('now', '+2 months'),
            'estimated_hours' => fake()->numberBetween(1, 40),

            // Relationships (to be overridden in seeder)
            'project_id' => Project::factory(),
            'created_by' => User::factory(),
            'assigned_to' => User::factory(),
        ];
    }
}
