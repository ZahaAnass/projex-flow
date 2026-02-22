<?php

namespace App\Http\Controllers\TeamLeader;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Sprint;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        // Get the IDs of projects owned by this leader to scope tasks and sprints
        $myProjectIds = Project::where('owner_id', $userId)->pluck('id');

        $stats = [
            'active_projects' => Project::where('owner_id', $userId)->where('status', 'active')->count(),
            'active_sprints' => Sprint::whereIn('project_id', $myProjectIds)->where('status', 'active')->count(),
            'total_tasks' => Task::whereIn('project_id', $myProjectIds)->count(),
            'completed_tasks' => Task::whereIn('project_id', $myProjectIds)->where('status', 'done')->count(),
        ];

        $task_distribution = [
            'todo' => Task::whereIn('project_id', $myProjectIds)->where('status', 'todo')->count(),
            'in_progress' => Task::whereIn('project_id', $myProjectIds)->where('status', 'in_progress')->count(),
            'review' => Task::whereIn('project_id', $myProjectIds)->where('status', 'review')->count(),
            'done' => Task::whereIn('project_id', $myProjectIds)->where('status', 'done')->count(),
        ];

        $recent_projects = Project::where('owner_id', $userId)
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'status', 'created_at']);

        return Inertia::render('TeamLeader/Dashboard', [
            'stats' => $stats,
            'task_distribution' => $task_distribution,
            'recent_projects' => $recent_projects,
        ]);
    }
}
