<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Specific Test Users (All password: password1234)
        $password = Hash::make('password1234');

        $admin = User::factory()->create([
            'name' => 'System Admin',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'password' => $password,
        ]);

        $leader = User::factory()->create([
            'name' => 'Team Leader',
            'email' => 'leader@example.com',
            'role' => 'team_leader',
            'password' => $password,
        ]);

        $user = User::factory()->create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'role' => 'user',
            'password' => $password,
        ]);

        $client = User::factory()->create([
            'name' => 'Client User',
            'email' => 'client@example.com',
            'role' => 'client',
            'password' => $password,
        ]);

        // 2. Create 10 Random "Members" to assign tasks to
        $members = User::factory(10)->create([
            'role' => 'user',
            'password' => $password
        ]);

        // 3. Create Projects (5 created by Admin, 5 by Team Leader)
        $creators = [$admin, $leader];

        foreach ($creators as $creator) {
            Project::factory(5)->create([
                'created_by' => $creator->id,
            ])->each(function ($project) use ($members) {

                // 4. Create 5-10 Tasks per Project
                Task::factory(rand(5, 10))->create([
                    'project_id' => $project->id,
                    // Assign randomly to one of the created members
                    'assigned_to' => $members->random()->id,
                ]);
            });
        }
    }
}
