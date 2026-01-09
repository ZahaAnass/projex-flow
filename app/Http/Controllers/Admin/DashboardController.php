<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => User::count(),
                'active_projects' => Project::where('status', 'active')->count(),
                'pending_tasks' => Task::where('status', '!=', 'done')->count(),
                'completed_tasks' => Task::where('status', 'done')->count(),
            ],
            'recent_projects' => Project::with('owner')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'owner' => $p->owner->name,
                    'status' => $p->status,
                    'date' => $p->created_at->diffForHumans(),
                ]),
            'task_distribution' => [
                'todo' => Task::where('status', 'todo')->count(),
                'in_progress' => Task::where('status', 'in_progress')->count(),
                'review' => Task::where('status', 'review')->count(),
                'done' => Task::where('status', 'done')->count(),
            ]
        ]);
    }
}
