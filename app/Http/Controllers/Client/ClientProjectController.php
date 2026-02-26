<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientProjectController extends Controller
{
    public function dashboard()
    {
        $userId = auth()->id();

        // Scope: Only projects assigned to this client
        $myProjects = Project::where('client_id', $userId)->with('tasks')->get();

        // Calculate high-level stats for the client
        $totalTasks = 0;
        $completedTasks = 0;

        foreach ($myProjects as $project) {
            $totalTasks += $project->tasks->count();
            $completedTasks += $project->tasks->where('status', 'done')->count();
        }

        $stats = [
            'total_projects' => $myProjects->count(),
            'active_projects' => $myProjects->where('status', 'active')->count(),
            'completed_projects' => $myProjects->where('status', 'completed')->count(),
            'overall_progress' => $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0,
        ];

        return Inertia::render('Client/Dashboard', [
            'stats' => $stats,
            'recent_projects' => Project::where('client_id', $userId)
                ->latest()
                ->take(4)
                ->get(['id', 'name', 'status', 'start_date', 'end_date']),
        ]);
    }

    public function index(Request $request)
    {
        $query = Project::where('client_id', auth()->id());

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        return Inertia::render('Client/Projects/Index', [
            'projects' => $query->latest()->paginate(12)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Project $project)
    {
        // SECURITY: Ensure the client actually owns this project
        abort_if($project->client_id !== auth()->id(), 403, 'Unauthorized access to project.');

        // Load sprints and tasks for a transparent progress view
        $project->load(['sprints', 'tasks' => function($q) {
            // Only show them tasks that are somewhat relevant (maybe exclude internal bugs if you want, but we will load all for progress tracking)
            $q->select('id', 'project_id', 'sprint_id', 'title', 'status', 'priority', 'type', 'due_date');
        }]);

        $totalTasks = $project->tasks->count();
        $completedTasks = $project->tasks->where('status', 'done')->count();
        $progress = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

        return Inertia::render('Client/Projects/Show', [
            'project' => $project,
            'stats' => [
                'total_tasks' => $totalTasks,
                'completed_tasks' => $completedTasks,
                'progress' => $progress,
                'sprints_count' => $project->sprints->count(),
            ]
        ]);
    }
}
