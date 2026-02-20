<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::query()->with('owner');

        if ($request->search) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        // 1. ADDED STATUS FILTER
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Projects/Create', [
            'owners' => User::role(['admin', 'team_leader'])->select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable',
            'status' => 'required',
            'owner_id' => 'required|exists:users,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        Project::create($validated);
        return redirect()->route('admin.projects.index')->with('success', 'Project created successfully.');
    }

    // 2. ADDED SHOW METHOD FOR VIEW PAGE
    public function show(Project $project)
    {
        // Load relationships
        $project->load(['owner', 'sprints', 'tasks']);

        // Calculate basic stats for the view page
        $totalTasks = $project->tasks->count();
        $completedTasks = $project->tasks->where('status', 'done')->count();
        $progress = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

        return Inertia::render('Admin/Projects/Show', [
            'project' => $project,
            'stats' => [
                'total_tasks' => $totalTasks,
                'completed_tasks' => $completedTasks,
                'progress' => $progress,
                'sprints_count' => $project->sprints->count(),
            ]
        ]);
    }

    public function edit(Project $project)
    {
        return Inertia::render('Admin/Projects/Edit', [
            'project' => $project,
            'owners' => User::role(['admin', 'team_leader'])->select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable',
            'status' => 'required',
            'owner_id' => 'required|exists:users,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $project->update($validated);
        return redirect()->route('admin.projects.index')->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return back()->with('success', 'Project deleted.');
    }
}
