<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Sprint;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SprintController extends Controller
{
    public function index(Request $request)
    {
        $query = Sprint::query()->with(['project' => fn($q) => $q->select('id', 'name')]);

        if ($request->search) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        return Inertia::render('Admin/Sprints/Index', [
            'sprints' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Sprints/Create', [
            'projects' => Project::select('id', 'name')->get(),
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
        return redirect()->route('admin.sprints.index')->with('success', 'Sprint created successfully.');
    }

    public function edit(Sprint $sprint)
    {
        return Inertia::render('Admin/Sprints/Edit', [
            'sprint' => $sprint,
            'projects' => Project::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, Sprint $sprint)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'goal' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'status' => 'required|in:planned,active,completed',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $sprint->update($validated);
        return redirect()->route('admin.sprints.index')->with('success', 'Sprint updated successfully.');
    }

    public function destroy(Sprint $sprint)
    {
        $sprint->delete();
        return back()->with('success', 'Sprint deleted.');
    }
}
