<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Sprint;
use App\Models\Tag;
use App\Models\Task;
use App\Models\TimeEntry;
use App\Models\User;
use App\Models\ActivityLog; // <-- Import the ActivityLog model
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Spatie Roles (Professional Way)
        $roleAdmin  = Role::create(['name' => 'admin']);
        $roleLeader = Role::create(['name' => 'team_leader']);
        $roleUser   = Role::create(['name' => 'user']);
        $roleClient = Role::create(['name' => 'client']);

        // 2. Create Specific Users and Assign Roles

        // ADMIN
        $admin = User::factory()->create([
            'name' => 'System Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole($roleAdmin);

        // TEAM LEADER
        $leader = User::factory()->create([
            'name' => 'Team Leader',
            'email' => 'leader@example.com',
            'password' => Hash::make('password'),
        ]);
        $leader->assignRole($roleLeader);

        // MEMBER / USER
        $user = User::factory()->create([
            'name' => 'John Developer',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
        ]);
        $user->assignRole($roleUser);

        // CLIENT
        $client = User::factory()->create([
            'name' => 'Happy Client',
            'email' => 'client@example.com',
            'password' => Hash::make('password'),
        ]);
        $client->assignRole($roleClient);

        // 3. Create Random Users (Assign 'user' role to all)
        $randomUsers = User::factory(10)->create();
        foreach($randomUsers as $rUser) {
            $rUser->assignRole($roleUser);
        }

        // 4. Create Tags
        $tags = Tag::factory(25)->create();

        // 5. Create Projects (Owned by the Leader)
        $projects = Project::factory(25)->create([
            'owner_id' => $leader->id,
        ]);

        foreach ($projects as $project) {

            // Create 3 Sprints per Project
            $sprints = Sprint::factory(3)->create([
                'project_id' => $project->id,
            ]);

            // Create Tasks for each Sprint
            foreach ($sprints as $sprint) {
                $tasks = Task::factory(10)->create([
                    'project_id' => $project->id,
                    'sprint_id' => $sprint->id,
                    'created_by' => $leader->id,
                    // Randomly assign to our main User or the random pool
                    'assigned_to' => $randomUsers->push($user)->random()->id,
                ]);

                // Attach Tags and Time Entries to Tasks
                foreach ($tasks as $task) {
                    $task->tags()->attach($tags->random(rand(1, 3))->pluck('id'));

                    TimeEntry::factory(rand(0, 3))->create([
                        'task_id' => $task->id,
                        'user_id' => $task->assigned_to,
                    ]);
                }
            }

            // Create some "Backlog" tasks (No Sprint ID)
            Task::factory(3)->create([
                'project_id' => $project->id,
                'sprint_id' => null,
                'created_by' => $leader->id,
                'assigned_to' => null,
            ]);
        }

        // 6. GENERATE FAKE ACTIVITY LOGS (New Addition)
        // This will create 100 random log entries to populate your Admin view
        ActivityLog::factory(100)->create();
    }
}
