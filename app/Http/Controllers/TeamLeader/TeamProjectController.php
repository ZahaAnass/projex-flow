<?php

namespace App\Http\Controllers\TeamLeader;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamProjectController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('TeamLeader/Dashboard', [
            'stats' => [
                'active_projects' => Project::where('status', 'active')->count(),
                'pending_tasks' => Task::where('status', '!=', 'done')->count(),
                'completed_tasks' => Task::where('status', 'done')->count(),
            ],
            // 5 Recent projects
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

    public function index(Request $request)
    {
        $query = Project::query()->with('owner');

        if ($request->search) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        return Inertia::render('TeamLeader/Projects/Index', [
            'projects' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Project $project)
    {
        // View specific project details + its tasks
        return Inertia::render('TeamLeader/Projects/Show', [
            'project' => $project->load('owner'),
            'tasks' => $project->tasks()->with('assignee')->latest()->get(),
        ]);
    }
}
