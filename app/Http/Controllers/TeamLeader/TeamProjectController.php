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
        // Stats for the Team Leader's Dashboard
        return Inertia::render('TeamLeader/Dashboard', [
            'stats' => [
                'active_projects' => Project::where('status', 'active')->count(),
                'pending_tasks' => Task::where('status', 'todo')->count(),
                'completed_tasks' => Task::where('status', 'done')->count(),
            ],
            // Get 5 recent tasks across all projects
            'recent_tasks' => Task::with(['project', 'assignee'])
                ->latest()
                ->take(5)
                ->get()
        ]);
    }

    public function index(Request $request)
    {
        $query = Project::query();

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
        // When a Leader clicks a project, they see the Kanban Board for THAT project
        $tasks = $project->tasks()
            ->with('assignee')
            ->get(); // Get all tasks for this project

        return Inertia::render('TeamLeader/Projects/Show', [
            'project' => $project,
            'tasks' => $tasks
        ]);
    }
}
