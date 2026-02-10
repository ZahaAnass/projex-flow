<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientProjectController extends Controller
{
    public function dashboard()
    {
        // Stats for the client dashboard
        return Inertia::render('Client/Dashboard', [
            'stats' => [
                'total_projects' => Project::count(), // Or filter by client_id if you have it
                'active_projects' => Project::where('status', 'active')->count(),
                'completed_projects' => Project::where('status', 'completed')->count(),
            ],
            // 5 Most recent projects
            'recent_projects' => Project::with('owner')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'status' => $p->status,
                    'progress' => $this->calculateProgress($p), // Helper calculation
                    'due_date' => $p->due_date,
                ]),
        ]);
    }

    public function index(Request $request)
    {
        $query = Project::query()->with('owner');

        if ($request->search) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        return Inertia::render('Client/Projects/Index', [
            'projects' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Project $project)
    {
        // Load tasks with assignees
        return Inertia::render('Client/Projects/Show', [
            'project' => $project->load('owner'),
            'tasks' => $project->tasks()->with('assignee')->get(),
        ]);
    }

    // Helper to calculate % completion based on tasks
    private function calculateProgress($project)
    {
        $total = $project->tasks()->count();
        if ($total === 0) return 0;
        $done = $project->tasks()->where('status', 'done')->count();
        return round(($done / $total) * 100);
    }
}
