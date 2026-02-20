<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectRequest;
use App\Http\Requests\Admin\UpdateProjectRequest; // You create this similar to Store
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

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Projects/Create', [
            // Only Admins and Team Leaders can own projects
            'owners' => User::role(['admin', 'team_leader'])->select('id', 'name')->get(),
        ]);
    }

    public function store(StoreProjectRequest $request)
    {
        Project::create($request->validated());
        return redirect()->route('admin.projects.index')->with('success', 'Project created.');
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
        // Simple validation for update or use UpdateProjectRequest
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable',
            'status' => 'required',
            'owner_id' => 'required|exists:users,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ]);

        $project->update($validated);
        return redirect()->route('admin.projects.index')->with('success', 'Project updated.');
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return back()->with('success', 'Project deleted.');
    }
}
