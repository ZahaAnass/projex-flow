<?php

namespace Database\Factories;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityLogFactory extends Factory
{
    protected $model = ActivityLog::class;

    public function definition(): array
    {
        // Simulate different types of models being interacted with
        $subjectTypes = [
            'App\Models\Project',
            'App\Models\Task',
            'App\Models\Sprint',
            'App\Models\User'
        ];

        $actions = ['created', 'updated', 'deleted', 'login'];

        return [
            'user_id' => User::inRandomOrder()->first()?->id,
            'action' => fake()->randomElement($actions),
            'subject_type' => fake()->randomElement($subjectTypes),
            'subject_id' => fake()->numberBetween(1, 20),

            // Fixed: Now matching your migration columns
            'data_before' => json_encode(['status' => 'todo']),
            'data_after' => json_encode(['status' => fake()->randomElement(['in_progress', 'done'])]),

            // Fixed: Added the metadata from your migration
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),

            'created_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'updated_at' => now(),
        ];
    }
}
