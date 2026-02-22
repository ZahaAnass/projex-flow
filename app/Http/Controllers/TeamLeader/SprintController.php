<?php

namespace App\Http\Controllers\TeamLeader;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Sprint;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SprintController extends Controller
{
    private function getMyProjectIds() {
        return Project::where('owner_id', auth()->id())->pluck('id');
    }

    public function index(Request $request)
    {
        // SCOPE: Only sprints that belong to the leader's projects
        $query = Sprint::whereIn('project_id', $this->getMyProjectIds())->with('project');

        if ($request->search) $query->where('name', 'like', '%'.$request->search.'%');
        if ($request->status && $request->status !== 'all') $query->where('status', $request->status);

        return Inertia::render('TeamLeader/Sprints/Index', [
            'sprints' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('TeamLeader/Sprints/Create', [
            // Only load THEIR projects in the dropdown
            'projects' => Project::where('owner_id', auth()->id())->select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'goal' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'status' => 'required|in:planned,active,completed',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        Sprint::create($validated);
        return redirect()->route('leader.sprints.index')->with('success', 'Sprint created.');
    }

    public function edit(Sprint $sprint)
    {
        abort_if(!in_array($sprint->project_id, $this->getMyProjectIds()->toArray()), 403);

        return Inertia::render('TeamLeader/Sprints/Edit', [
            'sprint' => $sprint,
            'projects' => Project::where('owner_id', auth()->id())->select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, Sprint $sprint)
    {
        // 1. Security Check
        abort_if(!in_array($sprint->project_id, $this->getMyProjectIds()->toArray()), 403);

        // 2. Full Validation Rules
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'goal' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'status' => 'required|in:planned,active,completed',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        // 3. Update the Database
        $sprint->update($validated);

        // 4. Return correct response
        return redirect()->route('leader.sprints.index')->with('success', 'Sprint updated successfully.');
    }
}
