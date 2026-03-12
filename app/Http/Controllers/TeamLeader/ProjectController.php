<?php

namespace App\Http\Controllers\TeamLeader;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::where('owner_id', auth()->id())->with('owner');

        if ($request->search) $query->where('name', 'like', '%'.$request->search.'%');
        if ($request->status && $request->status !== 'all') $query->where('status', $request->status);

        return Inertia::render('TeamLeader/Projects/Index', [
            'projects' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('TeamLeader/Projects/Create', [
            'owners' => [['id' => auth()->id(), 'name' => auth()->user()->name]],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable',
            'status' => 'required',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $validated['owner_id'] = auth()->id();

        Project::create($validated);
        return redirect()->route('leader.projects.index')->with('success', 'Project created.');
    }

    public function edit(Project $project)
    {
        abort_if($project->owner_id !== auth()->id(), 403, 'Unauthorized action.');

        return Inertia::render('TeamLeader/Projects/Edit', [
            'project' => $project,
            'owners' => [['id' => auth()->id(), 'name' => auth()->user()->name]],
        ]);
    }

    public function update(Request $request, Project $project)
    {
        abort_if($project->owner_id !== auth()->id(), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable',
            'status' => 'required',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $project->update($validated);
        return redirect()->route('leader.projects.index')->with('success', 'Project updated.');
    }

    public function destroy(Project $project)
    {
        abort_if($project->owner_id !== auth()->id(), 403);
        $project->delete();
        return back()->with('success', 'Project deleted.');
    }

    public function show(Project $project)
    {
        abort_if($project->owner_id !== auth()->id(), 403, 'Unauthorized action.');

        $project->load(['owner', 'sprints', 'tasks']);

        $totalTasks = $project->tasks->count();
        $completedTasks = $project->tasks->where('status', 'done')->count();
        $progress = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

        return Inertia::render('TeamLeader/Projects/Show', [
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
