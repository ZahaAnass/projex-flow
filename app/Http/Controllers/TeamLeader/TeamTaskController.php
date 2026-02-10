<?php

namespace App\Http\Controllers\TeamLeader;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamTaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::query()->with(['project', 'assignee']);

        if ($request->search) {
            $query->where('title', 'like', '%'.$request->search.'%');
        }
        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if ($request->priority && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        return Inertia::render('TeamLeader/Tasks/Index', [
            'tasks' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'status', 'priority']),
        ]);
    }

    public function create()
    {
        return Inertia::render('TeamLeader/Tasks/Create', [
            'projects' => Project::select('id', 'name')->get(),
            // Team leaders can assign to other leaders or standard users
            'users' => User::whereIn('role', ['team_leader', 'user'])->select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
            'status' => 'required|in:todo,in_progress,review,done',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        Task::create($validated);

        return redirect('/team/tasks')->with('success', 'Task created successfully.');
    }

    public function edit(Task $task)
    {
        return Inertia::render('TeamLeader/Tasks/Edit', [
            'task' => $task,
            'projects' => Project::select('id', 'name')->get(),
            'users' => User::whereIn('role', ['team_leader', 'user'])->select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'project_id' => 'sometimes|exists:projects,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'sometimes|in:low,medium,high',
            'status' => 'sometimes|in:todo,in_progress,review,done',
            'assigned_to' => 'nullable|exists:users,id',
        ]);

        $task->update($validated);

        return redirect()->back()->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return redirect()->back()->with('success', 'Task deleted successfully.');
    }
}
