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
        abort_if(!in_array($sprint->project_id, $this->getMyProjectIds()->toArray()), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'goal' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'status' => 'required|in:planned,active,completed',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $sprint->update($validated);

        return redirect()->route('leader.sprints.index')->with('success', 'Sprint updated successfully.');
    }
}
